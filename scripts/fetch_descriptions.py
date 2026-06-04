#!/usr/bin/env python3
"""
Fetches meta descriptions for all tools and checks for dead sites.
Outputs:
  js/descriptions.js  - TOOL_DESCRIPTIONS = { "domain": "description", ... }
  dead_sites.txt       - domains that returned errors/timeouts
"""

import json
import re
import sys
import os
import concurrent.futures
import urllib.request
import urllib.error
import ssl
from html.parser import HTMLParser

TIMEOUT = 8
MAX_WORKERS = 30

class MetaParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.description = ''
        self.og_description = ''

    def handle_starttag(self, tag, attrs):
        if tag == 'meta':
            d = dict(attrs)
            prop = d.get('property', '').lower()
            name = d.get('name', '').lower()
            content = d.get('content', '').strip()
            if not content:
                return
            if prop == 'og:description':
                self.og_description = content
            elif name == 'description' and not self.description:
                self.description = content

    def best_description(self):
        d = self.og_description or self.description
        if d:
            d = d.strip()
            if len(d) > 200:
                d = d[:197] + '...'
        return d


ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def fetch_info(domain, url):
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml',
            'Accept-Language': 'en-US,en;q=0.9',
        })
        with urllib.request.urlopen(req, timeout=TIMEOUT, context=ctx) as resp:
            content_type = resp.headers.get('Content-Type', '')
            if 'text/html' not in content_type and 'application/xhtml' not in content_type:
                return domain, '', True
            raw = resp.read(50000)
            charset = 'utf-8'
            ct_match = re.search(r'charset=([^\s;]+)', content_type)
            if ct_match:
                charset = ct_match.group(1)
            try:
                html = raw.decode(charset, errors='replace')
            except (LookupError, UnicodeDecodeError):
                html = raw.decode('utf-8', errors='replace')

            parser = MetaParser()
            try:
                parser.feed(html)
            except Exception:
                pass
            return domain, parser.best_description(), True
    except Exception:
        return domain, '', False


def load_domains_from_js(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    match = re.search(r'(?:const|var|let)\s+\w+\s*=\s*\[', text)
    if not match:
        return []
    start = match.start() + len(match.group()) - 1
    depth = 0
    for i in range(start, len(text)):
        if text[i] == '[':
            depth += 1
        elif text[i] == ']':
            depth -= 1
            if depth == 0:
                try:
                    arr = json.loads(text[start:i+1])
                except json.JSONDecodeError:
                    return []
                return [(item['domain'], item['url']) for item in arr if 'domain' in item and 'url' in item]
    return []


def main():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    tools_path = os.path.join(base, 'js', 'tools.js')
    data_path = os.path.join(base, 'js', 'data.js')

    domains = []
    if os.path.exists(tools_path):
        domains.extend(load_domains_from_js(tools_path))
    if os.path.exists(data_path):
        domains.extend(load_domains_from_js(data_path))

    seen = set()
    unique = []
    for domain, url in domains:
        if domain not in seen:
            seen.add(domain)
            unique.append((domain, url))

    print(f"Checking {len(unique)} domains with {MAX_WORKERS} workers...")

    descriptions = {}
    dead = []
    done = 0

    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(fetch_info, d, u): d for d, u in unique}
        for future in concurrent.futures.as_completed(futures):
            domain, desc, alive = future.result()
            done += 1
            if not alive:
                dead.append(domain)
            if desc:
                descriptions[domain] = desc
            if done % 200 == 0 or done == len(unique):
                print(f"  {done}/{len(unique)} done, {len(descriptions)} descriptions, {len(dead)} dead")

    desc_path = os.path.join(base, 'js', 'descriptions.js')
    with open(desc_path, 'w', encoding='utf-8') as f:
        f.write('const TOOL_DESCRIPTIONS = ')
        json.dump(descriptions, f, ensure_ascii=False, indent=2, sort_keys=True)
        f.write(';\n')

    dead_path = os.path.join(base, 'dead_sites.txt')
    with open(dead_path, 'w', encoding='utf-8') as f:
        for d in sorted(dead):
            f.write(d + '\n')

    print(f"\nDone! {len(descriptions)} descriptions, {len(dead)} dead sites.")
    print(f"Written to {desc_path} and {dead_path}")


if __name__ == '__main__':
    main()
