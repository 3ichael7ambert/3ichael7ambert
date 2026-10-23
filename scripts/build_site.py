"""Build a static, searchable portfolio. No network access required."""
import json, re, shutil
from pathlib import Path
from html import escape as e
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parents[1]
def read(name):return json.loads((ROOT/'data'/f'{name}.json').read_text())
def link(url,label,cls='text-link'):
    if not url.startswith(('https://','mailto:','tel:','#','files/')):raise ValueError(f'Unsafe link: {url}')
    return f'<a class="{cls}" href="{e(url,quote=True)}">{e(label)} <span aria-hidden="true">↗</span></a>'
def main():
    media=read('media');gallery=read('gallery');featured=read('featured');books=read('books');career=read('career')
    def img(key,size,alt,cls='',lazy=True):
        m=media.get(key)
        if not m:return ''
        src=m.get(str(size)) or next(v for k,v in m.items() if k.isdigit())
        return f'<img src="{src}" alt="{e(alt,quote=True)}" width="{m["width"]}" height="{m["height"]}" class="{cls}" loading="{"lazy" if lazy else "eager"}" decoding="async">'
    def filters(items,scope):
        categories=['All']+list(dict.fromkeys(x['category'] for x in items))
        return '<div class="filters" role="group" aria-label="Filter '+scope+'">'+''.join(f'<button type="button" data-filter="{e(c)}" data-scope="{scope}" aria-pressed="{str(i==0).lower()}">{e(c)}</button>' for i,c in enumerate(categories))+'</div>'
    gallery_html=''
    for i,g in enumerate(gallery):
        m=media[g['id']]
        gallery_html+=f'''<figure class="art-card" data-category="{e(g['category'])}">
<a class="art-open" href="{m['1600']}" data-gallery="{i}" aria-label="Open {e(g['title'])} in full-screen gallery">{img(g['id'],480,g['alt'])}<span class="expand" aria-hidden="true">↗</span></a>
<figcaption><span>{e(g['title'])}</span><small>{e(g['category'])}</small></figcaption></figure>'''
    cards={}
    for group,items in featured.items():
        cards[group]=''
        for i,x in enumerate(items):
            picture=img(f'{group}-{i}',640,x['title'],'card-image')
            cards[group]+=f'<article class="project-card">{picture}<div class="card-copy"><span class="eyebrow">{e(x["category"])}</span><h3>{e(x["title"])}</h3><p>{e(x["description"])}</p>{link(x["url"],"Listen / explore" if group=="music" else "Visit shop" if group=="stores" else "View project")}</div></article>'
    book_html=''
    for b in books:
        picture=img(b['id'],480,'Cover of '+b['title'],'book-cover')
        if not picture:picture='<div class="book-titleplate" aria-hidden="true"><small>3ichael 7ambert</small><strong>'+e(b['title'])+'</strong></div>'
        book_html+=f'<article class="book-card" data-category="{e(b["category"])}">{picture}<div><span class="eyebrow">{e(b["category"])}</span><h3>{e(b["title"])}</h3><p>{e(b["description"])}</p><div class="book-links">'+''.join(link(x['url'],x['label']) for x in b['links'])+'</div></div></article>'
    # Keep the extensive career sections, but make them native disclosures.
    career_html=''
    for ident,title in [('education','Education'),('resume','Resumes & experience'),('certificates','Certificates'),('software','Software projects')]:
        fragment=BeautifulSoup(career[ident],'html.parser')
        for h in fragment.select('h1'):h.name='h3'
        for h in fragment.select('h2'):h.name='h3'
        career_html+=f'<details class="career-detail" id="{ident}"><summary>{title}</summary><div class="career-body">{fragment}</div></details>'
    discovered=read('discovered') if (ROOT/'data/discovered.json').exists() else {'items':[]}
    catalog_html=''.join(f'<li data-category="{e(x["category"])}">{link(x["url"],x["title"])}<small>{e(x["category"])} · {"Drunk Yeti" if "drunkyeti" in x["source"] else "3ichael 7ambert"}</small></li>' for x in discovered['items'])
    payload=[{**x,'thumb':media[x['id']]['480'],'large':media[x['id']]['1600']} for x in gallery]
    html=f'''<!doctype html>
<html lang="en" data-theme="sketchbook">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>3ichael 7ambert · Art, music & imagined worlds</title>
<meta name="description" content="The creative world of Michael Andrew Lambert Jr., also known as 3ichael 7ambert. Original art, photography, games, music, books, and Alieno Apparel.">
<meta name="theme-color" content="#f5f2e9"><link rel="canonical" href="https://3ichael7ambert.com/">
<meta property="og:title" content="3ichael 7ambert · Art, music & imagined worlds"><meta property="og:description" content="Original artwork, photographs, games, music and books by Michael Andrew Lambert Jr."><meta property="og:image" content="https://3ichael7ambert.com/assets/media/identity-480.webp"><meta property="og:type" content="website">
<link rel="icon" href="assets/media/identity-480.webp"><link rel="stylesheet" href="assets/site.css">
<script src="assets/theme-init.js"></script><script src="assets/site.js" defer></script>
</head><body>
<a class="skip-link" href="#main">Skip to content</a>
<div id="atmosphere" aria-hidden="true"></div><img id="pencil-cursor" src="assets/media/pencil-480.webp" width="40" height="90" alt="" aria-hidden="true" hidden>
<header class="masthead"><a href="#introduction" class="wordmark">3ichael <span>7ambert</span><small>THE CREATIVE NOTEBOOK</small></a><div class="appearance"><label for="theme">Theme</label><select id="theme"><option value="sketchbook">Sketchbook</option><option value="light">Light</option><option value="dark">Dark</option><option value="music">Music</option><option value="art">Art grid</option></select><button id="settings-toggle" aria-expanded="false" aria-controls="effects-settings" type="button">Effects</button></div></header>
<div id="effects-settings" class="settings" hidden><label>Atmosphere <select id="weather"><option value="none">None</option><option value="rain">Rain</option><option value="snow">Snow</option></select></label><label><input type="checkbox" id="pencil-setting"> Pencil cursor (mouse)</label><label><input type="checkbox" id="motion-setting"> Animate background</label><p>Reduced-motion and data-saving preferences are respected.</p></div>
<nav class="section-nav" aria-label="Main navigation"><a href="#design">Art & photography</a><a href="#games">Games</a><a href="#music">Music</a><a href="#book">Books</a><a href="#clothing">Store</a><a href="#background">About & work</a><a href="#contact">Contact</a></nav>
<main id="main">
<section id="introduction" class="hero">
<div class="hero-copy"><p class="eyebrow">Michael Andrew Lambert Jr. · Colorado</p><h1>A life made<br>of <em>many arts.</em></h1><p class="lead">I’m 3ichael 7ambert. I turn ideas into drawings, photographs, music, games, and stories.</p><p>From a pencil on paper to a world you can play in, this is a collection of the things I make—and the places my imagination takes me.</p><div class="hero-actions"><a class="button" href="#design">Open the sketchbook <span aria-hidden="true">↗</span></a><a class="text-link" href="#book">Browse the bookshelf →</a></div><div class="byline">{img('portrait',480,'Michael Andrew Lambert Jr.','avatar',False)}<span>Artist. Author. Developer.<br><small>Always making something.</small></span></div></div>
<div class="hero-art" aria-label="Selected artwork"><figure class="hero-main">{img('urban-colour',480,'Colorful original character illustration','',False)}<figcaption>color, character & a little curiosity</figcaption></figure><figure class="hero-photo">{img('pink-flower',480,'Pink flower macro photograph','',False)}<figcaption>a closer look</figcaption></figure><span class="handnote">There’s more than one<br>way to see a world. ↙</span></div>
</section>
<div class="chapter-rule"><span>DRAWN · CAPTURED · COMPOSED · CODED</span><span>SELECTED WORK / 01</span></div>
<section id="design" class="chapter"><div class="section-heading"><div><p class="eyebrow">01 / The visual notebook</p><h2>Look a little closer.</h2></div><p>Photography, drawn portraits, invented worlds, and experiments in color. Tap any image, then scroll through the full-screen collection.</p></div>
{filters(gallery,'art')}<p class="sr-only" id="art-status" aria-live="polite"></p><div id="art-grid" class="art-grid">{gallery_html}</div>
<div class="section-links">{link('https://www.behance.net/3ichael7ambert','More on Behance')}{link('https://www.deviantart.com/3ichael7ambert','DeviantArt')}{link('https://odonisorphane.artstation.com/','ArtStation')}</div></section>
<section id="games" class="chapter"><div class="section-heading"><div><p class="eyebrow">02 / Playable worlds</p><h2>From sketch to screen.</h2></div><p>Independent games from my original catalog and Drunk Yeti. Explore the worlds, meet the characters, and find something to play.</p></div><div class="project-grid">{cards['games']}</div><div class="section-links">{link('https://drunkyeti.itch.io/','Drunk Yeti catalog')}{link('https://3ichael7ambert.itch.io/','Original itch.io catalog')}{link('https://store.steampowered.com/publisher/3ichael7ambert','Steam publisher')}</div>
<details class="catalog-detail"><summary>Browse the full games & creative downloads catalog</summary><label for="catalog-search">Find a project</label><input id="catalog-search" type="search" placeholder="Search titles, tools, soundtracks…"><p id="catalog-status" class="small" aria-live="polite"></p><ul class="catalog-list">{catalog_html}</ul></details></section>
<section id="music" class="chapter"><div class="section-heading"><div><p class="eyebrow">03 / Sound & story</p><h2>A different kind of mark.</h2></div><p>Songs, instrumental worlds, game soundtracks, and conversations. Choose a record or artist and listen in your favorite place.</p></div><div class="project-grid music-grid">{cards['music']}</div><div class="section-links">{link('https://open.spotify.com/artist/0rWENRqbBZZK4RxUu8Q7CP','A Rocket’s Intensity on Spotify')}{link('https://soundcloud.com/odonisorphane','SoundCloud')}{link('https://www.youtube.com/arocketsintensity','YouTube')}</div><details><summary>Music videos & earlier projects</summary><div class="video-row"><button class="video-load" data-video="dC13XaLhOBY" type="button">▶ Mike on de Mic · watch video</button>{link('https://3ichael7ambert.github.io/tail-myspace/','Think About It Later archive')}{link('https://3ichael7ambert.github.io/DeadSexyMikey-MySpace/','DeadSexyMikey archive')}</div><div id="video-player"></div></details></section>
<section id="book" class="chapter"><div class="section-heading"><div><p class="eyebrow">04 / The bookshelf</p><h2>Stories you can keep.</h2></div><p>Art collections, photography, poetry, memoir, and stories for younger readers. Browse by subject and choose an edition at the retailer.</p></div>{filters(books,'books')}<p class="sr-only" id="books-status" aria-live="polite"></p><div class="books-grid">{book_html}</div><div class="section-links">{link('https://www.hoopladigital.com/publisher/3ichael-7ambert/10216095048/titles','Explore library editions on Hoopla')}</div><p class="small">Formats, prices, and availability are listed by each retailer.</p></section>
<section id="clothing" class="chapter"><div class="section-heading"><div><p class="eyebrow">05 / Take a little art with you</p><h2>Off the page.</h2></div><p>Artwork to wear, hang, collect, or create with. Find the right shop for what you’re looking for.</p></div><div class="apparel-feature">{img('cherry-shirt',480,'Cherry blossom print apparel by 3ichael 7ambert')}<div><span class="eyebrow">Alieno Apparel</span><h3>Art in everyday motion.</h3><p>My clothing design work brings illustration, abstract pattern, and all-over color to wearable forms.</p><a href="#design" class="text-link" data-apparel-filter>See the apparel work →</a></div></div><div class="project-grid">{cards['stores']}</div><details><summary>Other storefronts & original resources</summary><div class="section-links">{link('https://society6.com/3ichael7ambert/','Society6')}{link('https://www.ebay.com/usr/3ichael7ambert','eBay')}{link('https://www.redbubble.com/people/drunkyeti/shop','Drunk Yeti merchandise')}{link('https://3ichael7ambert.itch.io/','Original creative resources')}</div></details></section>
<section id="background" class="chapter"><div class="section-heading"><div><p class="eyebrow">06 / Behind the work</p><h2>Curiosity connects it all.</h2></div><p>I work across art, software, music, and storytelling. Explore my professional background, education, and projects below.</p></div>{career_html}</section>
<section id="contact" class="chapter contact"><p class="eyebrow">Let’s make something</p><h2>Have an idea in mind?</h2><p>For creative work, collaborations, and professional opportunities:</p>{link('mailto:mlambertbusiness@gmail.com','mlambertbusiness@gmail.com','contact-link')}<div class="section-links">{link('https://www.linkedin.com/in/3ichael7ambert','LinkedIn')}{link('https://github.com/3ichael7ambert','GitHub')}{link('https://www.instagram.com/3ichael7ambert','Instagram')}{link('https://www.facebook.com/3ichael7ambertOfficial','Facebook')}{link('files/vcard.vcf','Save my contact')}</div></section>
</main><footer><span>© 3ichael 7ambert · Michael Andrew Lambert Jr.</span><a href="#introduction">Back to the beginning ↑</a></footer>
<dialog id="lightbox" aria-labelledby="lightbox-title"><div class="lightbox-bar"><h2 id="lightbox-title">The visual notebook</h2><span id="lightbox-count" role="status"></span><button id="close-lightbox" type="button" aria-label="Close full-screen gallery">Close ×</button></div><div id="lightbox-scroll" tabindex="0" aria-label="Scroll through artworks"></div><div class="lightbox-controls"><button id="previous-art" aria-label="Previous artwork" type="button">↑ Previous</button><span>Scroll to explore</span><button id="next-art" aria-label="Next artwork" type="button">Next ↓</button></div></dialog>
<script type="application/json" id="gallery-data">{json.dumps(payload,ensure_ascii=False).replace('</','<\\/')}</script>
</body></html>'''
    html=html.replace('<select id="theme">','<select id="theme" aria-label="Theme">')
    report=ROOT/'docs/link-check.json'
    if report.exists():
        unavailable={x['url'] for x in json.loads(report.read_text())['results'] if x['status']==404}
        document=BeautifulSoup(html,'html.parser')
        for anchor in document.select('a[href]'):
            if anchor['href'] in unavailable:
                anchor.name='span';del anchor['href']
                anchor.string=anchor.get_text(' ',strip=True).replace('↗','').strip()+' (public link unavailable)'
        html=str(document)
    (ROOT/'index.html').write_text(html)
    print(f'Built {len(gallery)} artworks, {len(books)} books, {len(discovered["items"])} catalog links.')
if __name__=='__main__':main()
