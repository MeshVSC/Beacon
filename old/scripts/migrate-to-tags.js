const fs = require('fs');
const path = require('path');

// --- DOMAIN KEYWORD -> TAGS ---
const DOMAIN_TAGS = [
  // AI
  [/deepseek|openai|anthropic|claude\.ai|chatgpt|gemini|copilot\.microsoft|groq\.com|huggingface|ollama|replicate\.com|together\.ai|mistral\.ai|cohere\.com|ai\.google|perplexity/i, ['ai']],
  [/midjourney|dall-e|stable.?diffusion|ideogram|leonardo\.ai|flux/i, ['ai', 'ai-image']],
  [/runway|pika\.art|luma|kling\.ai|hailuoai/i, ['ai', 'ai-video']],
  [/cursor\.com|codeium|copilot|tabnine|cody|windsurf|aider/i, ['ai', 'ai-coding']],
  [/replit\.com|bolt\.new|lovable\.dev|v0\.dev/i, ['ai-coding', 'web-building']],
  [/^vercel\.com/i, ['hosting', 'dev-tools']],

  // Social
  [/discord\.com|discord\.gg|discordapp/i, ['social']],
  [/reddit\.com/i, ['social']],
  [/telegram\.org|t\.me\//i, ['social']],
  [/twitter\.com|x\.com/i, ['social']],
  [/twitch/i, ['streaming', 'social']],
  [/youtube|youtu\.be/i, ['streaming', 'social']],
  [/mastodon|lemmy|bluesky/i, ['social']],

  // Streaming
  [/netflix|hulu|disney|primevideo|crunchyroll|funimation|hbomax|peacock|paramount/i, ['streaming']],
  [/plex|jellyfin|emby|kodi/i, ['streaming']],
  [/stremio|popcorntime/i, ['streaming', 'torrents']],

  // Music
  [/spotify|soundcloud|bandcamp|deezer|tidal|audiomack|last\.fm/i, ['music']],

  // Gaming
  [/steam|epicgames|gog\.com|itch\.io|humble/i, ['gaming']],
  [/nexusmods|moddb|curseforge/i, ['game-tools']],
  [/retroarch|dolphin-emu|pcsx|rpcs3|yuzu|ryujinx|cemu|citra/i, ['gaming', 'game-tools']],

  // Dev Tools
  [/github(?!\.io)|gitlab|bitbucket/i, ['dev-tools']],
  [/stackoverflow|stackexchange/i, ['dev-tools']],
  [/npm|pypi|crates\.io|packagist/i, ['dev-tools']],
  [/docker|kubernetes/i, ['dev-tools', 'hosting']],
  [/^netlify\.com|^railway\.app|^render\.com|^fly\.io|^heroku\.com|digitalocean\.com|aws\.amazon|cloudflare\.com/i, ['hosting']],
  [/^firebase\.google|^supabase\.com|^appwrite\.io|^pocketbase\.io/i, ['dev-tools', 'hosting']],
  [/codepen|codesandbox|stackblitz|jsfiddle/i, ['dev-tools']],
  [/postman|insomnia|apidog/i, ['dev-tools']],
  [/ngrok/i, ['dev-tools', 'network']],

  // UI / Design
  [/figma|sketch\.com|penpot/i, ['design']],
  [/dribbble|behance|awwwards/i, ['design']],
  [/canva/i, ['design']],
  [/tailwind/i, ['ui-libraries']],
  [/shadcn|radix|chakra|mantine|mui\.com|nextui|daisyui|flowbite|headlessui/i, ['ui-libraries']],
  [/framer\.com\/motion|gsap|lottie/i, ['animation']],
  [/bootstrap|bulma/i, ['ui-libraries']],

  // Fonts
  [/fonts\.google|fontshare|dafont|myfonts|fonts\.adobe|fontawesome|pangrampangram|typewolf/i, ['fonts']],

  // Privacy
  [/mullvad|protonvpn|nordvpn|expressvpn|surfshark|wireguard|openvpn/i, ['privacy', 'network']],
  [/ublock|adguard|adblock|pihole|nextdns/i, ['privacy']],
  [/protonmail|tutanota|guerrillamail|temp-mail/i, ['privacy']],
  [/bitwarden|keepass|1password|lastpass/i, ['privacy']],
  [/torproject|torbrowser/i, ['privacy', 'browsers']],

  // Browsers
  [/firefox|chrome|brave|vivaldi|opera|arc\.net|librewolf|ungoogled/i, ['browsers']],

  // Books
  [/libgen|z-lib|annas-archive|gutenberg|openlibrary|archive\.org\/details/i, ['books']],
  [/mangadex|mangaplus|mangafire|mangareader|mangakakalot/i, ['books', 'anime']],
  [/kindle|calibre|kobo/i, ['books']],

  // Downloads
  [/1337x|rarbg|piratebay|torrentgalaxy|rutracker|nyaa|torrent/i, ['torrents']],
  [/qbittorrent|deluge|transmission|utorrent/i, ['torrents']],
  [/real-debrid|alldebrid|premiumize/i, ['downloads']],
  [/jdownloader|idm|yt-dlp|cobalt/i, ['downloads']],

  // Mobile
  [/apkmirror|apkpure|fdroid|aurora/i, ['mobile']],

  // Linux
  [/archlinux|ubuntu|fedora|debian|mint|manjaro|nixos|gentoo/i, ['linux']],
  [/homebrew|macport/i, ['linux']],

  // Files
  [/mega\.nz|mediafire|gofile|pixeldrain|wetransfer|dropbox|gdrive|onedrive/i, ['files']],
  [/7-zip|winrar|peazip/i, ['files']],

  // Image tools
  [/remove\.bg|squoosh|tinypng|imgbb|imgur/i, ['image-editing']],
  [/photopea|pixlr|gimp/i, ['image-editing']],

  // Video tools
  [/handbrake|ffmpeg|obs|clipchamp|davinci/i, ['video-editing']],
  [/vlc|mpv|potplayer/i, ['video-editing']],

  // System
  [/bleachbit|ccleaner|wiztree|revo/i, ['system']],
  [/powertoys|sysinternals|nirsoft/i, ['system']],

  // Office/PDF
  [/libreoffice|onlyoffice|notion|obsidian|logseq/i, ['note-taking']],
  [/ilovepdf|smallpdf|pdf24/i, ['office']],

  // Search
  [/searx|duckduckgo|startpage|brave\.com\/search|presearch/i, ['search']],
  [/archive\.org(?!\/details)/i, ['search']],
];

// --- DESCRIPTION KEYWORD -> TAGS ---
const DESC_TAGS = [
  // AI
  [/\b(artificial intelligence|machine learning|neural|llm|large language|chatbot|chat.?bot|gpt|generative ai)\b/i, ['ai']],
  [/\b(image generat|text.?to.?image|ai.?art|diffusion model|ai.?image)\b/i, ['ai', 'ai-image']],
  [/\b(video generat|text.?to.?video|ai.?video)\b/i, ['ai', 'ai-video']],
  [/\b(code complet|code assist|ai.?cod|copilot|pair program)\b/i, ['ai', 'ai-coding']],
  [/\b(ai.?api|api.?key|inference|model.?api)\b/i, ['ai', 'ai-api']],
  [/\b(no.?sign.?up|no.?registr|no.?account|without.?sign)\b/i, ['no-signup']],
  [/\b(automat|workflow|zapier|n8n|ifttt|make\.com)\b/i, ['automation']],

  // Streaming / Media
  [/\b(stream|watch.?movie|watch.?tv|watch.?show|watch.?film|watch.?anime|movie.?site|tv.?show)\b/i, ['streaming']],
  [/\b(live.?tv|live.?sport|iptv|live.?stream|sports?.?stream)\b/i, ['live-tv']],
  [/\b(anime|manga|waifu|otaku|crunchyroll|funimation|anilist|myanimelist)\b/i, ['anime']],
  [/\b(music|song|album|playlist|audio.?stream|music.?stream|listen)\b/i, ['music']],
  [/\b(radio|podcast|fm.?station|internet.?radio)\b/i, ['radio']],
  [/\b(game.?download|rom.?download|emulat|retro.?game|browser.?game|free.?game|pc.?game|crack.?game)\b/i, ['gaming']],
  [/\b(game.?launch|game.?mod|save.?edit|game.?cheat|game.?trainer|game.?tool|steam.?tool|epic.?tool)\b/i, ['game-tools']],
  [/\b(ebook|audiobook|book.?download|epub|pdf.?book|read.?online|light.?novel|comic|graphic.?novel)\b/i, ['books']],

  // Creative / Design
  [/\b(design.?tool|graphic.?design|ui.?design|web.?design|design.?inspir|design.?galler|mood.?board|brand)\b/i, ['design']],
  [/\b(image.?edit|photo.?edit|upscal|background.?remov|image.?compress|screenshot|ocr|image.?enhance|image.?host)\b/i, ['image-editing']],
  [/\b(video.?edit|screen.?record|video.?convert|video.?download|video.?compress|subtitle|caption|video.?player|media.?player|disc.?rip|media.?server)\b/i, ['video-editing']],
  [/\b(font|typeface|typograph|glyph|lettering)\b/i, ['fonts']],
  [/\b(icon|vector|svg|illustration|clipart)\b/i, ['icons']],
  [/\b(3d.?model|3d.?print|3d.?asset|blender|three\.?js|3d.?render)\b/i, ['3d']],
  [/\b(template|starter|boilerplate|theme|landing.?page|portfolio)\b/i, ['templates']],
  [/\b(component.?librar|ui.?kit|ui.?librar|css.?framework|react.?component|vue.?component)\b/i, ['ui-libraries']],
  [/\b(animat|motion|lottie|transition|parallax|gsap|framer.?motion)\b/i, ['animation']],

  // Dev
  [/\b(code.?editor|ide|git.?tool|terminal|cli|command.?line|devops|ci.?cd|database|sql|api.?tool|rest.?api|graphql|debug|deploy|sdk)\b/i, ['dev-tools']],
  [/\b(web.?host|cloud.?host|vps|server.?host|domain.?regist|ssl|cdn|deploy)\b/i, ['hosting']],
  [/\b(website.?build|app.?build|no.?code|low.?code|web.?app.?build|site.?build|cms|wordpress)\b/i, ['web-building']],

  // Productivity / Education
  [/\b(learn|course|tutorial|education|study|academic|university|school|quiz|exam|certification|mooc)\b/i, ['education']],
  [/\b(science|math|physics|chemistry|biology|astronomy|space|nasa|planet)\b/i, ['science']],
  [/\b(note.?tak|mind.?map|writing.?tool|markdown|wiki|knowledge.?base|second.?brain|journa)\b/i, ['note-taking']],
  [/\b(office.?suite|spreadsheet|pdf.?tool|pdf.?edit|word.?process|presentation.?tool|slide.?maker|libreoffice|onlyoffice)\b/i, ['office']],

  // Internet / System
  [/\b(browser|extension|addon|userscript|tampermonkey|greasemonkey)\b/i, ['browsers']],
  [/\b(search.?engine|web.?search|metasearch|web.?archiv|wayback)\b/i, ['search']],
  [/\b(social.?media|discord.?bot|reddit.?tool|twitter.?tool|youtube.?tool|twitch.?tool|telegram.?bot)\b/i, ['social']],
  [/\b(vpn|ad.?block|privacy|encrypt|anonymous|anti.?track|fingerprint|password.?manag|2fa|authenticat)\b/i, ['privacy']],
  [/\b(dns|proxy|network|firewall|port.?forward|bandwidth|speed.?test|ping|traceroute|ip.?address|url.?short)\b/i, ['network']],
  [/\b(system.?util|disk.?clean|registry|driver|benchmark|hardware|spec|cpu|gpu|ram|bios|boot|partition|backup.?tool|uninstall)\b/i, ['system']],
  [/\b(file.?host|cloud.?storage|file.?shar|file.?transfer|file.?convert|file.?manag|file.?compress|archive|zip|rar)\b/i, ['files']],

  // Downloads
  [/\b(download.?manag|download.?site|direct.?download|ddl|debrid|leech.?service|download.?accel)\b/i, ['downloads']],
  [/\b(torrent|magnet|tracker|seed|leech|peer.?to.?peer|p2p)\b/i, ['torrents']],

  // Platform
  [/\b(android|ios|mobile.?app|apk|iphone|ipad|smartphone)\b/i, ['mobile']],
  [/\b(linux|ubuntu|debian|arch|fedora|macos|mac.?app|homebrew|terminal.?emulat)\b/i, ['linux']],
];

// --- SECTION/CATEGORY FALLBACK MAP ---
const FALLBACK_MAP = {
  'FreeAI|AI & Multi-Model': ['ai'],
  'FreeAI|AI Terminal & Tasks': ['ai', 'ai-coding'],
  'FreeAI|Free AI APIs': ['ai', 'ai-api'],
  'FreeAI|Free Chat (No Signup)': ['ai', 'free-chat', 'no-signup'],
  'FreeAI|Free Chat (Signup)': ['ai', 'free-chat'],
  'FreeAI|Image & Video Gen': ['ai', 'ai-image', 'ai-video'],
  'Apps|3D & Manufacturing': ['ai', '3d'],
  'Apps|AI & Multi-Model': ['ai'],
  'Apps|Audio & Music': ['music'],
  'Apps|Automation': ['automation'],
  'Apps|Coding & Dev': ['dev-tools', 'ai-coding'],
  'Apps|Design & Image': ['design', 'image-editing'],
  'Apps|E-Commerce & Merch': ['templates', 'web-building'],
  'Apps|Home & Interior': ['design'],
  'Apps|Job Boards & Remote': ['education'],
  'Apps|Learning & Productivity': ['education', 'note-taking'],
  'Apps|Marketing & Sales': ['automation'],
  'Apps|PDF & Documents': ['office'],
  'Apps|Travel & Geography': ['education'],
  'Apps|Utilities': ['system'],
  'Apps|Video & Animation': ['video-editing', 'animation'],
  'Apps|Website & App Builders': ['web-building'],
  'Assets|3D Models & Elements': ['3d', 'icons'],
  'Assets|Icons & Vectors': ['icons'],
  'Assets|Illustrations': ['icons'],
  'Assets|Stock Photography': ['design'],
  'Assets|Video & Audio': ['video-editing', 'music'],
  'Books & Reading|Academic': ['books', 'education'],
  'Books & Reading|Audiobooks': ['books'],
  'Books & Reading|Comics': ['books'],
  'Books & Reading|Ebook Readers': ['books'],
  'Books & Reading|Ebooks': ['books'],
  'Books & Reading|Manga': ['books', 'anime'],
  'Books & Reading|Newspapers & Magazines': ['books'],
  'Developer Tools|API Tools': ['dev-tools'],
  'Developer Tools|Code Editors': ['dev-tools'],
  'Developer Tools|Databases': ['dev-tools'],
  'Developer Tools|Dev Communities': ['dev-tools', 'social'],
  'Developer Tools|Dev News': ['dev-tools'],
  'Developer Tools|Git Tools': ['dev-tools'],
  'Developer Tools|Hosting': ['hosting'],
  'Downloading|Debrid & Leeches': ['downloads'],
  'Downloading|Download Directories': ['downloads'],
  'Downloading|Download Sites': ['downloads'],
  'Downloading|Software Sites': ['downloads'],
  'Educational|Documentaries': ['education', 'streaming'],
  'Educational|History': ['education', 'science'],
  'Educational|Learning Sites': ['education'],
  'Educational|Science & Math': ['education', 'science'],
  'Educational|Skills & DIY': ['education'],
  'Educational|Space': ['education', 'science'],
  'File Tools|Cloud Storage': ['files'],
  'File Tools|Download Managers': ['files', 'downloads'],
  'File Tools|File Archivers': ['files'],
  'File Tools|File Conversion': ['files'],
  'File Tools|File Hosting': ['files'],
  'File Tools|File Transfer': ['files'],
  'File Tools|PDF Tools': ['files', 'office'],
  'Fonts|General Foundries': ['fonts'],
  'Fonts|Icons & Symbols': ['fonts', 'icons'],
  'Fonts|Premium Typefaces': ['fonts'],
  'Fonts|Specialty & Display': ['fonts'],
  'Gaming|Browser Games': ['gaming'],
  'Gaming|Emulation & ROMs': ['gaming', 'game-tools'],
  'Gaming|Game Downloads': ['gaming', 'downloads'],
  'Gaming|Game Repacks': ['gaming', 'downloads'],
  'Gaming|Indie & Retro': ['gaming'],
  'Gaming|Puzzle & Tabletop': ['gaming'],
  'Gaming|VR Games': ['gaming'],
  'Gaming Tools|Game Launchers': ['game-tools'],
  'Gaming Tools|Homebrew': ['game-tools'],
  'Gaming Tools|Minecraft': ['game-tools', 'gaming'],
  'Gaming Tools|Mods & Saves': ['game-tools'],
  'Gaming Tools|Multiplayer': ['game-tools', 'gaming'],
  'Gaming Tools|Optimization': ['game-tools', 'system'],
  'Gaming Tools|Steam & Epic': ['game-tools'],
  'Image Tools|Color Tools': ['image-editing', 'design'],
  'Image Tools|Image Compression': ['image-editing'],
  'Image Tools|Image Editors': ['image-editing'],
  'Image Tools|Image Enhancement': ['image-editing'],
  'Image Tools|Image Hosting': ['image-editing', 'files'],
  'Image Tools|OCR Tools': ['image-editing', 'office'],
  'Image Tools|Online Image Editors': ['image-editing'],
  'Image Tools|Screenshot Tools': ['image-editing', 'system'],
  'Inspiration|Creative & Branding': ['design'],
  'Inspiration|UI Elements': ['design', 'ui-libraries'],
  'Inspiration|Web Design': ['design'],
  'Internet Tools|Browser Extensions': ['browsers'],
  'Internet Tools|Browsers': ['browsers'],
  'Internet Tools|Network & DNS': ['network'],
  'Internet Tools|Search Tools': ['search'],
  'Internet Tools|URL & Link Tools': ['network'],
  'Internet Tools|Web Archiving': ['search'],
  'Libraries|Advanced Layouts': ['ui-libraries'],
  'Libraries|Animations': ['ui-libraries', 'animation'],
  'Libraries|CSS Frameworks': ['ui-libraries'],
  'Libraries|Component Libraries': ['ui-libraries'],
  'Linux & macOS|Linux Apps': ['linux'],
  'Linux & macOS|Linux Customization': ['linux'],
  'Linux & macOS|Linux Distros': ['linux'],
  'Linux & macOS|Linux Guides': ['linux'],
  'Linux & macOS|Mac Apps': ['linux'],
  'Miscellaneous|Food & Recipes': ['education'],
  'Miscellaneous|Free Stuff': ['downloads'],
  'Miscellaneous|Health': ['education'],
  'Miscellaneous|Indexes': ['search'],
  'Miscellaneous|Maps': ['education'],
  'Miscellaneous|News': ['social'],
  'Miscellaneous|Sports': ['streaming'],
  'Mobile|Android APKs': ['mobile'],
  'Mobile|Android Device': ['mobile'],
  'Mobile|Android Tools': ['mobile'],
  'Mobile|iOS Tools': ['mobile'],
  'Music & Audio|Audio Tools': ['music'],
  'Music & Audio|Music Downloads': ['music', 'downloads'],
  'Music & Audio|Music Streaming': ['music'],
  'Music & Audio|Music Torrenting': ['music', 'torrents'],
  'Music & Audio|Radio': ['radio'],
  'Music & Audio|Soundtracks': ['music'],
  'Privacy & Security|Adblocking': ['privacy'],
  'Privacy & Security|Antivirus': ['privacy', 'system'],
  'Privacy & Security|Privacy Tools': ['privacy'],
  'Privacy & Security|Proxy': ['privacy', 'network'],
  'Privacy & Security|VPN': ['privacy', 'network'],
  'Privacy & Security|Web Privacy': ['privacy'],
  'Social Media|Discord': ['social'],
  'Social Media|Reddit': ['social'],
  'Social Media|Social Tools': ['social'],
  'Social Media|Telegram': ['social'],
  'Social Media|Twitch': ['social', 'streaming'],
  'Social Media|Twitter / X': ['social'],
  'Social Media|YouTube': ['social', 'streaming'],
  'Streaming|Anime': ['streaming', 'anime'],
  'Streaming|Live TV & Sports': ['live-tv'],
  'Streaming|Movies & TV': ['streaming'],
  'Streaming|Torrent Streaming': ['streaming', 'torrents'],
  'System Tools|Hardware & Specs': ['system'],
  'System Tools|System Utilities': ['system'],
  'System Tools|Terminal': ['system', 'dev-tools'],
  'System Tools|Windows': ['system'],
  'Templates|Dashboards': ['templates', 'ui-libraries'],
  'Templates|E-Commerce': ['templates', 'web-building'],
  'Templates|Landing Pages': ['templates'],
  'Templates|Portfolios': ['templates'],
  'Templates|Webflow & Framer': ['templates', 'web-building'],
  'Text Tools|Fonts': ['fonts'],
  'Text Tools|Grammar & Writing': ['note-taking'],
  'Text Tools|Markup Tools': ['dev-tools', 'note-taking'],
  'Text Tools|Mind Mapping': ['note-taking'],
  'Text Tools|Note-Taking': ['note-taking'],
  'Text Tools|Office Suites': ['office'],
  'Text Tools|Pastebins': ['dev-tools'],
  'Text Tools|Text Editors': ['note-taking', 'dev-tools'],
  'Text Tools|Translators': ['note-taking'],
  'Torrenting|Private Trackers': ['torrents'],
  'Torrenting|Torrent Clients': ['torrents'],
  'Torrenting|Torrent Sites': ['torrents'],
  'Video Tools|Disc Ripping': ['video-editing', 'downloads'],
  'Video Tools|Media Servers': ['video-editing', 'streaming'],
  'Video Tools|Screen Recording': ['video-editing'],
  'Video Tools|Video Converters': ['video-editing'],
  'Video Tools|Video Downloaders': ['video-editing', 'downloads'],
  'Video Tools|Video Editors': ['video-editing'],
  'Video Tools|Video Hosting': ['video-editing', 'files'],
  'Video Tools|Video Players': ['video-editing'],
};

function assignTags(tool) {
  const tags = new Set();
  const domain = (tool.domain || '').toLowerCase();
  const desc = (tool.description || '').toLowerCase();

  // Layer 1: Domain matching
  for (const [regex, t] of DOMAIN_TAGS) {
    if (regex.test(domain)) t.forEach(tag => tags.add(tag));
  }

  // Layer 2: Description matching
  for (const [regex, t] of DESC_TAGS) {
    if (regex.test(desc)) t.forEach(tag => tags.add(tag));
  }

  // Layer 3: Fallback from section|category if nothing matched
  if (tags.size === 0 && tool.section && tool.category) {
    const key = `${tool.section}|${tool.category}`;
    const fallback = FALLBACK_MAP[key];
    if (fallback) fallback.forEach(tag => tags.add(tag));
  }

  return [...tags];
}

// --- MAIN ---
const dataPath = path.join(__dirname, '..', 'js', 'data.js');
const raw = fs.readFileSync(dataPath, 'utf8');

// Parse: find the first array assignment
let varName, jsonStr;
const match = raw.match(/^(?:\/\*.*?\*\/\s*)?const\s+(\w+)\s*=\s*\[/s);
if (!match) { console.error('Could not parse data.js'); process.exit(1); }
varName = match[1];
const arrayStart = match[0].length - 1; // position of the '['

// Find matching ']' by counting brackets
let depth = 0, arrayEnd = -1;
for (let i = arrayStart; i < raw.length; i++) {
  if (raw[i] === '[') depth++;
  else if (raw[i] === ']') { depth--; if (depth === 0) { arrayEnd = i; break; } }
}
if (arrayEnd === -1) { console.error('Could not find end of array'); process.exit(1); }
jsonStr = raw.slice(arrayStart, arrayEnd + 1);

// Capture everything after the array (trailing vars like FMHY_DESC_ES)
const trailingContent = raw.slice(arrayEnd + 1).replace(/^\s*;\s*/, '\n');

let tools;
try {
  tools = JSON.parse(jsonStr);
} catch(e) {
  console.error('JSON parse error:', e.message);
  process.exit(1);
}

console.log(`Parsed ${tools.length} entries from ${varName}`);

// Process all entries
let fallbackCount = 0;
let emptyCount = 0;
const newTools = tools.map(tool => {
  const tags = assignTags(tool);
  if (tags.length === 0) {
    emptyCount++;
    tags.push('uncategorized');
  }
  // Check if fallback was used
  const domainMatched = DOMAIN_TAGS.some(([r]) => r.test((tool.domain||'').toLowerCase()));
  const descMatched = DESC_TAGS.some(([r]) => r.test((tool.description||'').toLowerCase()));
  if (!domainMatched && !descMatched) fallbackCount++;

  const newTool = { tags };
  for (const [k, v] of Object.entries(tool)) {
    if (k === 'section' || k === 'category') continue;
    newTool[k] = v;
  }
  return newTool;
});

// --- DRY RUN: Show samples ---
const dryRun = process.argv.includes('--dry-run');

// Pick diverse samples: 5 random from each source layer
const samples = [];
const byLayer = { domain: [], desc: [], fallback: [], empty: [] };
for (let i = 0; i < tools.length; i++) {
  const domain = (tools[i].domain||'').toLowerCase();
  const desc = (tools[i].description||'').toLowerCase();
  const domainHit = DOMAIN_TAGS.some(([r]) => r.test(domain));
  const descHit = DESC_TAGS.some(([r]) => r.test(desc));
  if (domainHit) byLayer.domain.push(i);
  else if (descHit) byLayer.desc.push(i);
  else if (newTools[i].tags[0] !== 'uncategorized') byLayer.fallback.push(i);
  else byLayer.empty.push(i);
}

function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

const sampleIdxs = [
  ...pickRandom(byLayer.domain, 6),
  ...pickRandom(byLayer.desc, 6),
  ...pickRandom(byLayer.fallback, 5),
  ...pickRandom(byLayer.empty, 3),
];

console.log('\n=== SAMPLE ENTRIES ===\n');
for (const i of sampleIdxs) {
  if (i === undefined) continue;
  const old = tools[i];
  const neu = newTools[i];
  console.log(`  ${old.domain}`);
  console.log(`    OLD: ${old.section} | ${old.category}`);
  console.log(`    NEW: [${neu.tags.join(', ')}]`);
  console.log('');
}

// Stats
const tagCounts = {};
for (const t of newTools) {
  for (const tag of t.tags) {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  }
}
console.log('=== STATS ===');
console.log(`Total entries: ${tools.length}`);
console.log(`Domain-matched: ${byLayer.domain.length}`);
console.log(`Desc-matched: ${byLayer.desc.length}`);
console.log(`Fallback-only: ${byLayer.fallback.length}`);
console.log(`Uncategorized: ${byLayer.empty.length}`);
console.log(`\nTag distribution:`);
Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).forEach(([tag, count]) => {
  console.log(`  ${tag}: ${count}`);
});

if (dryRun) {
  console.log('\n[DRY RUN] No files modified. Remove --dry-run to apply.');
  process.exit(0);
}

// Write — preserve the comment header and trailing variables
const comment = raw.match(/^(\/\*.*?\*\/\s*)/s);
const prefix = comment ? comment[1] : '';
const output = prefix + 'const ' + varName + ' = ' + JSON.stringify(newTools, null, 2) + ';' + trailingContent;
fs.writeFileSync(dataPath, output, 'utf8');
console.log(`\nWrote ${newTools.length} entries to ${dataPath}`);
