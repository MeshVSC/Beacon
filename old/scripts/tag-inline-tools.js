const fs = require('fs');

// Import tagging maps from the main script by extracting the logic
// (This is a one-shot utility)

const DOMAIN_TAGS = [
  [/deepseek|openai|anthropic|claude\.ai|chatgpt|gemini|copilot\.microsoft|groq\.com|huggingface|ollama|replicate\.com|together\.ai|mistral\.ai|cohere\.com|ai\.google|perplexity/i, ['ai']],
  [/midjourney|dall-e|stable.?diffusion|ideogram|leonardo\.ai|flux/i, ['ai', 'ai-image']],
  [/runway|pika\.art|luma|kling\.ai|hailuoai/i, ['ai', 'ai-video']],
  [/cursor\.com|codeium|copilot|tabnine|cody|windsurf|aider/i, ['ai', 'ai-coding']],
  [/replit\.com|bolt\.new|lovable\.dev|v0\.dev/i, ['ai-coding', 'web-building']],
  [/^vercel\.com/i, ['hosting', 'dev-tools']],
  [/discord\.com|discord\.gg|discordapp/i, ['social']],
  [/reddit\.com/i, ['social']],
  [/telegram\.org|t\.me\//i, ['social']],
  [/twitter\.com|x\.com/i, ['social']],
  [/twitch/i, ['streaming', 'social']],
  [/youtube|youtu\.be/i, ['streaming', 'social']],
  [/mastodon|lemmy|bluesky/i, ['social']],
  [/netflix|hulu|disney|primevideo|crunchyroll|funimation|hbomax|peacock|paramount/i, ['streaming']],
  [/plex|jellyfin|emby|kodi/i, ['streaming']],
  [/stremio|popcorntime/i, ['streaming', 'torrents']],
  [/spotify|soundcloud|bandcamp|deezer|tidal|audiomack|last\.fm/i, ['music']],
  [/steam|epicgames|gog\.com|itch\.io|humble/i, ['gaming']],
  [/nexusmods|moddb|curseforge/i, ['game-tools']],
  [/retroarch|dolphin-emu|pcsx|rpcs3|yuzu|ryujinx|cemu|citra/i, ['gaming', 'game-tools']],
  [/github(?!\.io)|gitlab|bitbucket/i, ['dev-tools']],
  [/stackoverflow|stackexchange/i, ['dev-tools']],
  [/npm|pypi|crates\.io|packagist/i, ['dev-tools']],
  [/docker|kubernetes/i, ['dev-tools', 'hosting']],
  [/^netlify\.com|^railway\.app|^render\.com|^fly\.io|^heroku\.com|digitalocean\.com|aws\.amazon|cloudflare\.com/i, ['hosting']],
  [/^firebase\.google|^supabase\.com|^appwrite\.io|^pocketbase\.io/i, ['dev-tools', 'hosting']],
  [/codepen|codesandbox|stackblitz|jsfiddle/i, ['dev-tools']],
  [/postman|insomnia|apidog/i, ['dev-tools']],
  [/ngrok/i, ['dev-tools', 'network']],
  [/figma|sketch\.com|penpot/i, ['design']],
  [/dribbble|behance|awwwards/i, ['design']],
  [/canva/i, ['design']],
  [/tailwind/i, ['ui-libraries']],
  [/shadcn|radix|chakra|mantine|mui\.com|nextui|daisyui|flowbite|headlessui/i, ['ui-libraries']],
  [/framer\.com\/motion|gsap|lottie/i, ['animation']],
  [/bootstrap|bulma/i, ['ui-libraries']],
  [/fonts\.google|fontshare|dafont|myfonts|fonts\.adobe|fontawesome|pangrampangram|typewolf/i, ['fonts']],
  [/mullvad|protonvpn|nordvpn|expressvpn|surfshark|wireguard|openvpn/i, ['privacy', 'network']],
  [/ublock|adguard|adblock|pihole|nextdns/i, ['privacy']],
  [/protonmail|tutanota|guerrillamail|temp-mail/i, ['privacy']],
  [/bitwarden|keepass|1password|lastpass/i, ['privacy']],
  [/torproject|torbrowser/i, ['privacy', 'browsers']],
  [/firefox|chrome|brave|vivaldi|opera|arc\.net|librewolf|ungoogled/i, ['browsers']],
  [/libgen|z-lib|annas-archive|gutenberg|openlibrary|archive\.org\/details/i, ['books']],
  [/mangadex|mangaplus|mangafire|mangareader|mangakakalot/i, ['books', 'anime']],
  [/kindle|calibre|kobo/i, ['books']],
  [/1337x|rarbg|piratebay|torrentgalaxy|rutracker|nyaa|torrent/i, ['torrents']],
  [/qbittorrent|deluge|transmission|utorrent/i, ['torrents']],
  [/real-debrid|alldebrid|premiumize/i, ['downloads']],
  [/jdownloader|idm|yt-dlp|cobalt/i, ['downloads']],
  [/apkmirror|apkpure|fdroid|aurora/i, ['mobile']],
  [/archlinux|ubuntu|fedora|debian|mint|manjaro|nixos|gentoo/i, ['linux']],
  [/homebrew|macport/i, ['linux']],
  [/mega\.nz|mediafire|gofile|pixeldrain|wetransfer|dropbox|gdrive|onedrive/i, ['files']],
  [/7-zip|winrar|peazip/i, ['files']],
  [/remove\.bg|squoosh|tinypng|imgbb|imgur/i, ['image-editing']],
  [/photopea|pixlr|gimp/i, ['image-editing']],
  [/handbrake|ffmpeg|obs|clipchamp|davinci/i, ['video-editing']],
  [/vlc|mpv|potplayer/i, ['video-editing']],
  [/bleachbit|ccleaner|wiztree|revo/i, ['system']],
  [/powertoys|sysinternals|nirsoft/i, ['system']],
  [/libreoffice|onlyoffice|notion|obsidian|logseq/i, ['note-taking']],
  [/ilovepdf|smallpdf|pdf24/i, ['office']],
  [/searx|duckduckgo|startpage|brave\.com\/search|presearch/i, ['search']],
  [/archive\.org(?!\/details)/i, ['search']],
];

const DESC_TAGS = [
  [/\b(artificial intelligence|machine learning|neural|llm|large language|chatbot|chat.?bot|gpt|generative ai)\b/i, ['ai']],
  [/\b(image generat|text.?to.?image|ai.?art|diffusion model|ai.?image)\b/i, ['ai', 'ai-image']],
  [/\b(video generat|text.?to.?video|ai.?video)\b/i, ['ai', 'ai-video']],
  [/\b(code complet|code assist|ai.?cod|copilot|pair program)\b/i, ['ai', 'ai-coding']],
  [/\b(ai.?api|api.?key|inference|model.?api)\b/i, ['ai', 'ai-api']],
  [/\b(no.?sign.?up|no.?registr|no.?account|without.?sign)\b/i, ['no-signup']],
  [/\b(automat|workflow|zapier|n8n|ifttt|make\.com)\b/i, ['automation']],
  [/\b(stream|watch.?movie|watch.?tv|watch.?show|watch.?film|watch.?anime|movie.?site|tv.?show)\b/i, ['streaming']],
  [/\b(live.?tv|live.?sport|iptv|live.?stream|sports?.?stream)\b/i, ['live-tv']],
  [/\b(anime|manga|waifu|otaku|crunchyroll|funimation|anilist|myanimelist)\b/i, ['anime']],
  [/\b(music|song|album|playlist|audio.?stream|music.?stream|listen)\b/i, ['music']],
  [/\b(radio|podcast|fm.?station|internet.?radio)\b/i, ['radio']],
  [/\b(game.?download|rom.?download|emulat|retro.?game|browser.?game|free.?game|pc.?game|crack.?game)\b/i, ['gaming']],
  [/\b(game.?launch|game.?mod|save.?edit|game.?cheat|game.?trainer|game.?tool|steam.?tool|epic.?tool)\b/i, ['game-tools']],
  [/\b(ebook|audiobook|book.?download|epub|pdf.?book|read.?online|light.?novel|comic|graphic.?novel)\b/i, ['books']],
  [/\b(design.?tool|graphic.?design|ui.?design|web.?design|design.?inspir|design.?galler|mood.?board|brand)\b/i, ['design']],
  [/\b(image.?edit|photo.?edit|upscal|background.?remov|image.?compress|screenshot|ocr|image.?enhance|image.?host)\b/i, ['image-editing']],
  [/\b(video.?edit|screen.?record|video.?convert|video.?download|video.?compress|subtitle|caption|video.?player|media.?player|disc.?rip|media.?server)\b/i, ['video-editing']],
  [/\b(font|typeface|typograph|glyph|lettering)\b/i, ['fonts']],
  [/\b(icon|vector|svg|illustration|clipart)\b/i, ['icons']],
  [/\b(3d.?model|3d.?print|3d.?asset|blender|three\.?js|3d.?render)\b/i, ['3d']],
  [/\b(template|starter|boilerplate|theme|landing.?page|portfolio)\b/i, ['templates']],
  [/\b(component.?librar|ui.?kit|ui.?librar|css.?framework|react.?component|vue.?component)\b/i, ['ui-libraries']],
  [/\b(animat|motion|lottie|transition|parallax|gsap|framer.?motion)\b/i, ['animation']],
  [/\b(code.?editor|ide|git.?tool|terminal|cli|command.?line|devops|ci.?cd|database|sql|api.?tool|rest.?api|graphql|debug|deploy|sdk)\b/i, ['dev-tools']],
  [/\b(web.?host|cloud.?host|vps|server.?host|domain.?regist|ssl|cdn|deploy)\b/i, ['hosting']],
  [/\b(website.?build|app.?build|no.?code|low.?code|web.?app.?build|site.?build|cms|wordpress)\b/i, ['web-building']],
  [/\b(learn|course|tutorial|education|study|academic|university|school|quiz|exam|certification|mooc)\b/i, ['education']],
  [/\b(science|math|physics|chemistry|biology|astronomy|space|nasa|planet)\b/i, ['science']],
  [/\b(note.?tak|mind.?map|writing.?tool|markdown|wiki|knowledge.?base|second.?brain|journa)\b/i, ['note-taking']],
  [/\b(office.?suite|spreadsheet|pdf.?tool|pdf.?edit|word.?process|presentation.?tool|slide.?maker|libreoffice|onlyoffice)\b/i, ['office']],
  [/\b(browser|extension|addon|userscript|tampermonkey|greasemonkey)\b/i, ['browsers']],
  [/\b(search.?engine|web.?search|metasearch|web.?archiv|wayback)\b/i, ['search']],
  [/\b(social.?media|discord.?bot|reddit.?tool|twitter.?tool|youtube.?tool|twitch.?tool|telegram.?bot)\b/i, ['social']],
  [/\b(vpn|ad.?block|privacy|encrypt|anonymous|anti.?track|fingerprint|password.?manag|2fa|authenticat)\b/i, ['privacy']],
  [/\b(dns|proxy|network|firewall|port.?forward|bandwidth|speed.?test|ping|traceroute|ip.?address|url.?short)\b/i, ['network']],
  [/\b(system.?util|disk.?clean|registry|driver|benchmark|hardware|spec|cpu|gpu|ram|bios|boot|partition|backup.?tool|uninstall)\b/i, ['system']],
  [/\b(file.?host|cloud.?storage|file.?shar|file.?transfer|file.?convert|file.?manag|file.?compress|archive|zip|rar)\b/i, ['files']],
  [/\b(download.?manag|download.?site|direct.?download|ddl|debrid|leech.?service|download.?accel)\b/i, ['downloads']],
  [/\b(torrent|magnet|tracker|seed|leech|peer.?to.?peer|p2p)\b/i, ['torrents']],
  [/\b(android|ios|mobile.?app|apk|iphone|ipad|smartphone)\b/i, ['mobile']],
  [/\b(linux|ubuntu|debian|arch|fedora|macos|mac.?app|homebrew|terminal.?emulat)\b/i, ['linux']],
];

const FALLBACK_MAP = {
  'Apps|AI & Multi-Model': ['ai'],
  'Apps|Automation': ['automation'],
  'Apps|Design & Image': ['design', 'image-editing'],
  'Apps|Video & Animation': ['video-editing', 'animation'],
  'Apps|Website & App Builders': ['web-building'],
  'Apps|Coding & Dev': ['dev-tools', 'ai-coding'],
  'Apps|PDF & Documents': ['office'],
  'Apps|Audio & Music': ['music'],
  'Apps|Home & Interior': ['design'],
  'Apps|Travel & Geography': ['education'],
  'Apps|Learning & Productivity': ['education', 'note-taking'],
  'Apps|Utilities': ['system'],
  'Apps|E-Commerce & Merch': ['templates', 'web-building'],
  'Apps|Marketing & Sales': ['automation'],
  'Apps|3D & Manufacturing': ['3d', 'ai'],
  'Apps|Job Boards & Remote': ['education'],
  'FreeAI|Free Chat (No Signup)': ['ai', 'free-chat', 'no-signup'],
  'FreeAI|Free Chat (Signup)': ['ai', 'free-chat'],
  'FreeAI|AI & Multi-Model': ['ai'],
  'FreeAI|AI Terminal & Tasks': ['ai', 'ai-coding'],
  'FreeAI|Free AI APIs': ['ai', 'ai-api'],
  'FreeAI|Image & Video Gen': ['ai', 'ai-image', 'ai-video'],
  'Inspiration|Web Design': ['design'],
  'Inspiration|Creative & Branding': ['design'],
  'Inspiration|UI Elements': ['design', 'ui-libraries'],
  'Libraries|Component Libraries': ['ui-libraries'],
  'Libraries|Animations': ['ui-libraries', 'animation'],
  'Libraries|CSS Frameworks': ['ui-libraries'],
  'Libraries|Advanced Layouts': ['ui-libraries'],
  'Templates|Landing Pages': ['templates'],
  'Templates|Portfolios': ['templates'],
  'Templates|Dashboards': ['templates', 'ui-libraries'],
  'Templates|E-Commerce': ['templates', 'web-building'],
  'Templates|Webflow & Framer': ['templates', 'web-building'],
  'Fonts|General Foundries': ['fonts'],
  'Fonts|Icons & Symbols': ['fonts', 'icons'],
  'Fonts|Premium Typefaces': ['fonts'],
  'Fonts|Specialty & Display': ['fonts'],
  'Assets|Icons & Vectors': ['icons'],
  'Assets|Illustrations': ['icons'],
  'Assets|Stock Photography': ['design'],
  'Assets|3D Models & Elements': ['3d', 'icons'],
  'Assets|Video & Audio': ['video-editing', 'music'],
};

function assignTags(tool) {
  const tags = new Set();
  const domain = (tool.domain || '').toLowerCase();
  const desc = (tool.description || '').toLowerCase();
  for (const [regex, t] of DOMAIN_TAGS) { if (regex.test(domain)) t.forEach(tag => tags.add(tag)); }
  for (const [regex, t] of DESC_TAGS) { if (regex.test(desc)) t.forEach(tag => tags.add(tag)); }
  if (tags.size === 0 && tool.section && tool.category) {
    const key = tool.section + '|' + tool.category;
    const fb = FALLBACK_MAP[key];
    if (fb) fb.forEach(tag => tags.add(tag));
  }
  if (tags.size === 0) tags.add('uncategorized');
  return [...tags];
}

// Read beacon.html, find TOOLS array, replace it
const html = fs.readFileSync('beacon.html', 'utf8');
const startMarker = 'const TOOLS = [';
const startIdx = html.indexOf(startMarker) + 'const TOOLS = '.length;
let depth = 0, endIdx = -1;
for (let i = startIdx; i < html.length; i++) {
  if (html[i] === '[') depth++;
  else if (html[i] === ']') { depth--; if (depth === 0) { endIdx = i; break; } }
}

const tools = JSON.parse(html.slice(startIdx, endIdx + 1));
console.log('Tagging ' + tools.length + ' inline entries...');

const tagged = tools.map(tool => {
  const tags = assignTags(tool);
  const newTool = { tags };
  for (const [k, v] of Object.entries(tool)) {
    if (k === 'section' || k === 'category') continue;
    newTool[k] = v;
  }
  return newTool;
});

// Show 10 samples
for (let i = 0; i < 10; i++) {
  const idx = Math.floor(Math.random() * tagged.length);
  console.log(tools[idx].domain + ': [' + tagged[idx].tags.join(', ') + '] (was: ' + tools[idx].section + '|' + tools[idx].category + ')');
}

// Replace in file
const newJson = JSON.stringify(tagged, null, 2);
const newHtml = html.slice(0, startIdx) + newJson + html.slice(endIdx + 1);
fs.writeFileSync('beacon.html', newHtml, 'utf8');
console.log('Done. Wrote tagged TOOLS to beacon.html');
