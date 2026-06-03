#!/usr/bin/env python3
"""
Fetches website titles for all tools and writes a name map JS file.
Outputs js/names.js with: const TOOL_NAMES = { "domain": "Display Name", ... };
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

class TitleParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_title = False
        self.title = ''
        self.og_site_name = ''
        self.og_title = ''

    def handle_starttag(self, tag, attrs):
        if tag == 'title':
            self.in_title = True
        if tag == 'meta':
            d = dict(attrs)
            prop = d.get('property', '').lower()
            name = d.get('name', '').lower()
            content = d.get('content', '')
            if prop == 'og:site_name' and content:
                self.og_site_name = content
            elif prop == 'og:title' and content:
                self.og_title = content
            elif name == 'application-name' and content:
                if not self.og_site_name:
                    self.og_site_name = content

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data

    def best_name(self):
        if self.og_site_name:
            return self.og_site_name.strip()
        t = self.title.strip()
        if t:
            # Clean common suffixes like " - Home", " | Dashboard", " – Welcome"
            for sep in [' - ', ' | ', ' – ', ' — ', ' :: ']:
                if sep in t:
                    parts = t.split(sep)
                    # Usually the app name is the shortest meaningful part
                    # or the first part
                    return parts[0].strip() if len(parts[0].strip()) > 1 else parts[-1].strip()
            return t
        if self.og_title:
            return self.og_title.strip()
        return ''


ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def fetch_name(domain, url):
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml',
            'Accept-Language': 'en-US,en;q=0.9',
        })
        with urllib.request.urlopen(req, timeout=TIMEOUT, context=ctx) as resp:
            content_type = resp.headers.get('Content-Type', '')
            if 'text/html' not in content_type and 'application/xhtml' not in content_type:
                return domain, ''
            raw = resp.read(50000)  # Only need first 50KB for meta tags
            charset = 'utf-8'
            ct_match = re.search(r'charset=([^\s;]+)', content_type)
            if ct_match:
                charset = ct_match.group(1)
            try:
                html = raw.decode(charset, errors='replace')
            except (LookupError, UnicodeDecodeError):
                html = raw.decode('utf-8', errors='replace')

            parser = TitleParser()
            try:
                parser.feed(html)
            except Exception:
                pass
            name = parser.best_name()
            return domain, name
    except Exception as e:
        return domain, ''


def load_domains_from_js(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    # Find the start of the array
    match = re.search(r'(?:const|var|let)\s+\w+\s*=\s*\[', text)
    if not match:
        print(f"Could not find array in {filepath}", file=sys.stderr)
        return []
    start = match.start() + len(match.group()) - 1  # position of '['
    # Find matching closing bracket by counting brackets
    depth = 0
    end = start
    for i in range(start, len(text)):
        if text[i] == '[':
            depth += 1
        elif text[i] == ']':
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    json_str = text[start:end]
    try:
        arr = json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"JSON parse error in {filepath}: {e}", file=sys.stderr)
        return []
    return [(item['domain'], item['url']) for item in arr if 'domain' in item and 'url' in item]


def main():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    tools_path = os.path.join(base, 'js', 'tools.js')
    data_path = os.path.join(base, 'js', 'data.js')

    domains = []
    if os.path.exists(tools_path):
        domains.extend(load_domains_from_js(tools_path))
    if os.path.exists(data_path):
        domains.extend(load_domains_from_js(data_path))

    # Deduplicate by domain
    seen = set()
    unique = []
    for domain, url in domains:
        if domain not in seen:
            seen.add(domain)
            unique.append((domain, url))

    print(f"Fetching names for {len(unique)} domains with {MAX_WORKERS} workers...")

    names = {}
    done = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(fetch_name, d, u): d for d, u in unique}
        for future in concurrent.futures.as_completed(futures):
            domain, name = future.result()
            done += 1
            if name:
                names[domain] = name
                if done % 100 == 0 or done == len(unique):
                    print(f"  {done}/{len(unique)} done, {len(names)} names found")
            else:
                if done % 100 == 0 or done == len(unique):
                    print(f"  {done}/{len(unique)} done, {len(names)} names found")

    # Write output
    out_path = os.path.join(base, 'js', 'names.js')
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write('const TOOL_NAMES = ')
        json.dump(names, f, ensure_ascii=False, indent=2, sort_keys=True)
        f.write(';\n')

    print(f"\nDone! {len(names)}/{len(unique)} names fetched.")
    print(f"Written to {out_path}")


if __name__ == '__main__':
    main()
