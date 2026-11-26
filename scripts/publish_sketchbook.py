"""Build the public sketchbook chapters, media watch pages, and crawl indexes."""
from hashlib import sha256
from html import escape
import json
import re
import shutil
import xml.etree.ElementTree as ET

from bs4 import BeautifulSoup

from publish_client_pages import install_client_pages
from publish_tours import install_tours
from publish_worlds import install_worlds
from publish_reading_guide import install_reading_guide
from publish_portfolio import install_portfolio
from publish_studio import install_studio, theme_control, featured_cards

ORIGIN = 'https://3ichael7ambert.com'
AUTHOR = 'Michael Andrew Lambert Jr.'
BYLINE = '3ichael 7ambert'
PROFILE = ORIGIN + '/#michael-lambert'
PORTRAIT = '/assets/media/identity-480.webp'
SITEMAP_NS = 'http://www.sitemaps.org/schemas/sitemap/0.9'
VIDEO_NS = 'http://www.google.com/schemas/sitemap-video/1.1'
HOME_DESCRIPTION = ('The living sketchbook of Michael Andrew Lambert Jr. (3ichael 7ambert). '
                    'Explore original art, photography, books, music visualizers, game design and software.')
CHAPTERS = (
    ('introduction', 'Cover'),
    ('design', 'Art & photography'),
    ('games', 'Games'),
    ('music', 'Music & visualizers'),
    ('book', 'Books'),
    ('clothing', 'Store'),
    ('background', 'About & skills'),
    ('contact', 'Contact'),
)
FOLIOS = (('/explore/', 'Explore'), ('/art/', 'Art'), ('/play/', 'Play'), ('/books/', 'Books'),
          ('/worlds/', 'Worlds'), ('/music/', 'Music'), ('/store/', 'Shop'),
          ('/about/', 'About'), ('/skills/', 'Skills'), ('/work/', 'Work with me'))
BOOK_SLUGS = {'book-2': 'memorandum-in-a-cruet', 'book-6': 'inktober-2023', 'book-11': 'the-artwork-of-3ichael-7ambert'}
BOOK_SUMMARIES = {
    'book-2': 'A collection of poems and reflections by 3ichael 7ambert.',
    'book-6': 'Drawings from the 2023 Inktober project, gathered in a single illustrated volume.',
    'book-11': 'An extended collection of artwork by 3ichael 7ambert, spanning traditional and digital media.',
    'a-world-within': 'The Plastic Photography series explores image-making through perspective and scale.',
    'after-dark': 'A Plastic Photography collection centered on light and darkness after sunset.',
    'color-studies': 'A Plastic Photography collection that traces the relationships between colors.',
    'lines-in-shape': 'A Plastic Photography collection exploring the lines, silhouettes and shapes within a frame.',
    'nature-recreated': 'A Plastic Photography collection that reshapes familiar views of nature.',
    'quiet-moments': 'A Plastic Photography collection that lingers on quiet subjects and scenes.',
    'seasons-of-change': 'A Plastic Photography collection that follows changes in the natural world through the seasons.',
    'selected-works': 'A selection from the Plastic Photography series by 3ichael 7ambert.',
    'the-early-years': 'Early work from the Plastic Photography series by 3ichael 7ambert.',
    'water-and-light': 'A Plastic Photography collection centered on water, reflections and changing light.',
}


def markup(value):
    return json.dumps(value, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c')


def nav(items):
    return ''.join(f'<a href="{escape(url, quote=True)}">{escape(label)}</a>' for url, label in items)


def canonical_meta(title, description, path, image=PORTRAIT):
    address = ORIGIN + path
    image_url = image if image.startswith('https://') else ORIGIN + image
    fields = [('description', description), ('og:type', 'website'), ('og:site_name', BYLINE),
              ('og:title', title), ('og:description', description), ('og:url', address),
              ('og:image', image_url), ('twitter:card', 'summary_large_image')]
    tags = ''.join(
        f'<meta {"property" if key.startswith("og:") else "name"}="{key}" content="{escape(value, quote=True)}">'
        for key, value in fields
    )
    return f'<link rel="canonical" href="{address}">{tags}'


def page(output, path, title, description, body, css, *, image=PORTRAIT, kind='folio', schema=None):
    full_title = f'{title} | {BYLINE}'
    structured = f'<script type="application/ld+json">{markup(schema)}</script>' if schema else ''
    shared_sheet = '' if css.startswith('/assets/sketchbook.css') else '<link rel="stylesheet" href="/assets/sketchbook.css">'
    menu = ''.join(
        f'<a href="{url}"{" aria-current=page" if path == url else ""}>{escape(label)}</a>'
        for url, label in (('/', 'Cover'), *FOLIOS)
    )
    studio_css = versioned(output, 'studio.css')
    studio_js = versioned(output, 'studio.js')
    document = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{escape(full_title)}</title>{canonical_meta(full_title, description, path, image)}
<link rel="icon" href="{PORTRAIT}"><link rel="stylesheet" href="/assets/site.css">
{shared_sheet}<link rel="stylesheet" href="{css}"><link rel="stylesheet" href="{studio_css}">
<script src="{versioned(output, 'theme-init.js')}"></script><script defer src="{studio_js}"></script>{structured}
</head><body class="{kind}-page">
<a class="skip-link" href="#main">Skip to content</a>
<header class="masthead"><a href="/" class="wordmark">3ichael <span>7ambert</span><small>THE LIVING SKETCHBOOK</small></a>{theme_control()}</header>
<nav class="section-nav" aria-label="Sketchbook chapters">{menu}</nav>
<main id="main"><article class="chapter">{body}</article></main>
<footer>{nav((('/', 'Back to the sketchbook'), ('/#contact', 'Contact')))}</footer></body></html>'''
    destination = output / path.strip('/') / 'index.html'
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(document, encoding='utf-8')


def versioned(output, filename):
    return f'/assets/{filename}?v={sha256((output / "assets" / filename).read_bytes()).hexdigest()[:12]}'


def link_element(soup, address, label, css_class=None, page_turn=False):
    link = soup.new_tag('a', href=address)
    if css_class:
        link['class'] = css_class
    if page_turn:
        link['data-page-turn'] = ''
    link.string = label
    return link


def decorate_home(output, css, script):
    homepage = output / 'index.html'
    soup = BeautifulSoup(homepage.read_text(encoding='utf-8'), 'html.parser')
    title = 'Michael Lambert (3ichael 7ambert) | Art, Books, Music & Games'
    soup.title.string = title
    for name, value in [('description', HOME_DESCRIPTION), ('og:title', title), ('og:description', HOME_DESCRIPTION),
                        ('og:url', ORIGIN + '/'), ('og:site_name', BYLINE), ('twitter:card', 'summary_large_image')]:
        attribute = 'property' if name.startswith('og:') else 'name'
        tag = soup.head.find('meta', attrs={attribute: name})
        if tag is None:
            tag = soup.new_tag('meta', attrs={attribute: name})
            soup.head.append(tag)
        tag['content'] = value
    schema = soup.new_tag('script', type='application/ld+json')
    schema.string = markup({
        '@context': 'https://schema.org', '@type': 'ProfilePage', 'url': ORIGIN + '/',
        'name': title, 'description': HOME_DESCRIPTION,
        'mainEntity': {
            '@type': 'Person', '@id': PROFILE, 'name': AUTHOR, 'alternateName': ['Michael Lambert', BYLINE],
            'url': ORIGIN + '/', 'image': ORIGIN + PORTRAIT,
            'jobTitle': ['Multimedia artist', 'Author', 'Music producer', 'Software developer'],
            'sameAs': ['https://github.com/3ichael7ambert', 'https://www.behance.net/3ichael7ambert',
                       'https://www.youtube.com/arocketsintensity', 'https://www.amazon.com/author/3ichael7ambert',
                       'https://www.redbubble.com/people/OdonisOrphane/shop'],
        },
    })
    soup.head.append(schema)
    soup.head.append(soup.new_tag('link', rel='stylesheet', href=css))
    soup.head.append(soup.new_tag('script', src=script, defer=True))
    soup.head.append(soup.new_tag('link', rel='stylesheet', href=versioned(output, 'studio.css')))
    soup.select_one('script[src="assets/theme-init.js"]')['src'] = versioned(output, 'theme-init.js')
    soup.body['class'] = [*soup.body.get('class', []), 'home-page']
    pick = BeautifulSoup(theme_control(), 'html.parser').select_one('select')
    del pick['data-studio-theme']
    pick['id'] = 'theme'
    soup.select_one('#theme').replace_with(pick)
    soup.select_one('.wordmark small').string = 'THE LIVING SKETCHBOOK'
    soup.select_one('#settings-toggle').string = 'Weather & effects'
    soup.select_one('#weather option[value="none"]').string = 'Clear'
    soup.select_one('.hero h1').string = 'A living sketchbook.'
    intro = soup.select_one('.hero .lead')
    intro.string = 'I’m Michael Lambert. This is where my drawings, photographs, music, books, and games come together.'
    extra_intro = intro.find_next_sibling('p')
    if extra_intro:
        extra_intro.decompose()
    cover_index = soup.new_tag('ul', attrs={'class': 'sketchbook-index', 'aria-label': 'Explore the sketchbook'})
    for url, label in FOLIOS:
        item = soup.new_tag('li')
        item.append(link_element(soup, url, label))
        cover_index.append(item)
    start = soup.new_tag('p', attrs={'class':'journey-start'})
    start.append(link_element(soup, '/explore/visual-journey/', 'Start the visual journey', 'button'))
    start.append(' ')
    start.append(link_element(soup, '#design', 'Browse the sketchbook', 'text-link', page_turn=True))
    soup.select_one('.hero-actions').replace_with(start, cover_index)
    soup.select_one('.chapter-rule').decompose()
    soup.select_one('.section-nav a[href="#background"]')['href'] = '/about/'
    soup.select_one('.section-nav a[href="/about/"]').string = 'About'
    soup.select_one('.section-nav a[href="#design"]')['href'] = '/art/'
    soup.select_one('.section-nav a[href="#music"]').string = 'Music & visualizers'
    for index, (chapter_id, label) in enumerate(CHAPTERS):
        chapter = soup.find(id=chapter_id)
        chapter['class'] = [*chapter.get('class', []), 'sketchbook-page']
        turn = soup.new_tag('nav', attrs={'class': 'page-turn', 'aria-label': f'Page turns from {label}'})
        if index:
            old_id, old_label = CHAPTERS[index - 1]
            turn.append(link_element(soup, '#' + old_id, '← ' + old_label, page_turn=True))
        if index + 1 < len(CHAPTERS):
            next_id, next_label = CHAPTERS[index + 1]
            turn.append(link_element(soup, '#' + next_id, next_label + ' →', page_turn=True))
        if chapter_id == 'introduction':
            soup.select_one('.hero-copy').append(turn)
        else:
            chapter.append(turn)
    for chapter_id, url, label in (
        ('design', '/art/', 'Explore the art and photography collections →'),
        ('book', '/books/', 'Browse the readable editions →'),
        ('music', '/music/', 'Watch visualizers and explore the music archive →'),
        ('background', '/about/', 'Meet the artist →'),
    ):
        paragraph = soup.new_tag('p', attrs={'class': 'sketchbook-media-link'})
        paragraph.append(link_element(soup, url, label, 'button'))
        chapter = soup.find(id=chapter_id)
        (chapter.select_one('.section-heading') or chapter.find('h2')).insert_after(paragraph)
    games = soup.select_one('#games .project-grid')
    if games:
        xero = next((card for card in games.find_all('article', recursive=False)
                     if card.find('h3') and card.h3.get_text(strip=True) == 'Xero'), None)
        if xero:
            games.insert(0, xero.extract())
    desk_tools = soup.select_one('#desk-tools')
    soup.select_one('script[src="assets/desk.js"]')['src'] = versioned(output, 'desk.js')
    desk_tools.select_one('[data-tool=clip]').string = 'Move'
    controls = BeautifulSoup("""
<div class="book-controls" hidden>
  <nav class="book-navigation" aria-label="Book controls">
    <button type="button" data-leaf-step="-1" aria-label="Previous page">‹</button>
    <label><span class="sr-only">Chapter</span><select id="book-chapter"></select></label>
    <button type="button" data-leaf-step="1" aria-label="Next page">›</button>
    <button type="button" id="book-layout" aria-pressed="false">Scroll view</button>
    <details class="book-help"><summary>Controls</summary>
      <p>Turn pages with the buttons, a swipe across the page margin, Left or Right, or your gamepad’s bumpers.</p>
      <p>Pencil draws on the page. With the desk focused, use arrow keys and hold Space to draw. Erase removes strokes. Move lets you drag the loose objects or nudge a focused object with the arrow keys. Escape returns to Browse.</p>
      <p>In Sketchbook Run, use the stick or D-pad to move and the bottom face button to jump. Press Start to play or pause.</p>
    </details>
  </nav>
</div>
""", 'html.parser').div
    controls.append(desk_tools.extract())
    soup.main.insert_before(controls)
    desk = soup.select_one('#drawing-desk')
    desk['aria-label'] = 'Sketchbook drawing surface'
    desk.append(BeautifulSoup("""
<button type="button" class="desk-object desk-star" aria-label="Move the loose star" data-object data-x=".73" data-y=".34">✦</button>
<button type="button" class="desk-object desk-ticket" aria-label="Move the Divinity ticket" data-object data-x=".61" data-y=".59">Divinity</button>
<span id="desk-key-point" hidden aria-hidden="true"></span>
""", 'html.parser'))
    desk.select_one('#paperclip').attrs.update({'data-object':'', 'data-x':'.80','data-y':'.24'})
    prompt = BeautifulSoup("""
<details class="book-pocket"><summary>Open the back pocket</summary>
  <p>Two earlier stops in the sketchbook.</p>
  <ul><li><a href="https://github.com/3ichael7ambert/bookoflife">The Book of Life archive</a></li>
      <li><a href="https://github.com/3ichael7ambert/divinity-js">Divinity archive</a></li></ul>
</details>
""", 'html.parser').details
    soup.select_one('#contact').append(prompt)
    homepage.write_text(str(soup), encoding='utf-8')


def video_cards(videos):
    return ''.join(
        f'''<article class="release-card">
<a href="{escape(video['address'], quote=True)}"><img src="{video['thumbnail']}" width="480" height="360" loading="lazy" alt="">
<h2>{escape(video['title'])}</h2></a><p>{escape(video['credit'])} · {escape(video['format'])}</p></article>'''
        for video in videos
    )


def publish_video(output, css, video, parent, parent_label):
    if not re.fullmatch(r'[A-Za-z0-9_-]{11}', video['id']):
        raise ValueError(f'Invalid video ID in {video["title"]}')
    video['thumbnail'] = f'https://i.ytimg.com/vi/{video["id"]}/hqdefault.jpg'
    video['embed'] = f'https://www.youtube-nocookie.com/embed/{video["id"]}'
    title = escape(video['title'], quote=True)
    page(output, video['address'], video['title'], video['description'],
         f'<p><a href="{parent}">← {escape(parent_label)}</a></p><h1>{title}</h1>'
         f'<p>{escape(video["credit"])} · {escape(video["format"])}</p>'
         f'<iframe class="watch-player" src="{video["embed"]}" title="{title}" '
         'width="1280" height="720" allow="encrypted-media; picture-in-picture; fullscreen" '
         'referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
         f'<p class="page-intro">{escape(video["description"])}</p>'
         f'<a href="https://www.youtube.com/watch?v={video["id"]}">Watch on YouTube ↗</a>', css,
         image=video['thumbnail'], kind='watch')


def install_sketchbook(root, output):
    for filename in ('sketchbook.css', 'sketchbook.js', 'studio.css', 'studio.js'):
        shutil.copy2(root / 'assets' / filename, output / 'assets' / filename)
    css = versioned(output, 'sketchbook.css')
    decorate_home(output, css, versioned(output, 'sketchbook.js'))
    routes = ['/']
    editions = json.loads((output / 'reader/editions.json').read_text(encoding='utf-8'))
    book_links = []
    for book in editions:
        slug = book['id']
        title = book['title']
        description = BOOK_SUMMARIES[slug]
        address = '/books/' + BOOK_SLUGS.get(slug, slug) + '/'
        cover = f'/reader/pages/{slug}/1.webp'
        read = f'/reader/?book={slug}'
        safe_title = escape(title)
        page(output, address, title, description,
             f'<p><a href="/books/">← Bookshelf</a></p><h1>{safe_title}</h1>'
             f'<div class="book-spread"><img src="{cover}" alt="Opening page of {safe_title}"><div>'
             f'<p>{escape(description)}</p><p>{book["pages"]:,} pages in this online edition.</p>'
             f'<a class="button" href="{read}">Open the book reader</a></div></div>', css, image=cover,
             schema={'@context': 'https://schema.org', '@type': 'Book', 'name': title, 'description': description,
                     'url': ORIGIN + address, 'image': ORIGIN + cover, 'numberOfPages': book['pages'],
                     'author': {'@type': 'Person', '@id': PROFILE, 'name': AUTHOR}})
        book_links.append(f'<a class="edition-card" data-release-card href="{address}">'
                          f'<img src="{cover}" alt="" width="240" height="320" loading="lazy" decoding="async">'
                          f'<span>{safe_title}</span><small>{book["pages"]:,} pages</small></a>')
        routes.append(address)
    page(output, '/books/', 'Books by Michael Lambert',
         'Browse readable editions of Memorandum in a Cruet, Inktober, artist collections and Plastic Photography.',
         '<h1>Books</h1><p class="page-intro">Poetry, drawing, photography, and collections of work '
         'originally made for the page. These editions are available to read online.</p>'
         '<p><a class="button" href="/books/reading-guide/">Explore the reading guide</a> · <a href="https://www.amazon.com/author/3ichael7ambert">Browse my books on Amazon</a></p>'
         '<label class="release-search" hidden>Find an edition <input type="search" data-release-search></label>'
         '<p role="status" data-release-status></p>'
         f'<div class="edition-grid">{"".join(book_links)}</div>'
         '<p><a href="/#book">View the full catalog and retailer links</a></p>', css)
    routes.append('/books/')
    routes.append(install_reading_guide(output, css, page))

    videos = json.loads((root / 'data/music-videos.json').read_text(encoding='utf-8'))
    for video in videos:
        if not re.fullmatch(r'[a-z0-9-]+', video['slug']):
            raise ValueError(f'Invalid video slug in {video["title"]}')
        video['address'] = f'/music/watch/{video["slug"]}/'
        publish_video(output, css, video, '/music/', 'Music & visualizers')
        routes.append(video['address'])
    portfolio_routes, motion_archive = install_portfolio(
        root, output, page, versioned, video_cards, videos, publish_video
    )
    routes.extend(portfolio_routes)
    feature_music = json.loads((root / 'data/featured.json').read_text(encoding='utf-8'))['music']
    page(output, '/music/', 'Music, soundtracks and visualizers',
         'Watch music videos and visualizers by 3ichael 7ambert and A Rocket’s Intensity. Explore original music and game soundtracks.',
         '<h1>Music &amp; visualizers</h1><p class="page-intro">Electronic and orchestral work, independent bands, '
         'game soundtracks, and the videos I make to go with the music.</p>'
         '<p class="page-turn"><a href="https://open.spotify.com/artist/0rWENRqbBZZK4RxUu8Q7CP">A Rocket’s Intensity on Spotify</a>'
         '<a href="https://music.apple.com/us/artist/3ichael-7ambert/653323466">3ichael 7ambert on Apple Music</a>'
         '<a href="https://drunkyeti.itch.io/ar3na-foosball-soundtrack">AR3NA Foosball soundtrack</a></p>'
         '<h2>Releases and listening</h2><div class="release-grid studio-cards">'
         + featured_cards(output, 'music', feature_music) +
         f'</div><h2>Watch</h2><div class="release-grid">{video_cards(videos)}</div>', css)
    routes.append('/music/')

    skills = [
        ('Software and web development', 'I build full-stack web apps and interactive interfaces with JavaScript, Python, SQL, HTML and CSS.',
         '/#background', 'See software and work history'),
        ('Game development', 'I design mechanics, levels, characters and game art, then bring them together in playable projects.',
         '/#games', 'Explore the playable worlds'),
        ('Art, photography and design', 'My work spans ink, graphite, painting, digital illustration, photography and apparel.',
         '/art/', 'Explore the visual portfolio'),
        ('Writing and independent publishing', 'I write and assemble poetry, memoir, illustrated stories and visual portfolios.',
         '/books/', 'Browse the bookshelf'),
        ('Music production and visualizers', 'I compose songs and game soundtracks and make videos and visualizers to accompany them.',
         '/music/', 'Explore the music archive'),
    ]
    cards = ''.join(f'<article class="release-card"><h2>{escape(title)}</h2><p>{escape(body)}</p>'
                    f'<a href="{url}">{escape(label)} →</a></article>' for title, body, url, label in skills)
    page(output, '/skills/', 'Skills and selected projects',
         'See Michael Lambert’s work in full-stack development, game design, photography, illustration, publishing and music production.',
         '<h1>Skills &amp; projects</h1><p class="page-intro">Design with a Technical Mind. My work moves between '
         'software, games, art, writing and music. Here’s where to see each of those skills in practice.</p>'
         f'<div class="release-grid">{cards}</div>', css)
    routes.append('/skills/')

    reader = output / 'reader/index.html'
    html = reader.read_text(encoding='utf-8').replace('<title>Reader</title>', '<title>Reader</title><meta name="robots" content="noindex,follow">')
    document = BeautifulSoup(html, 'html.parser')
    document.head.append(document.new_tag('script', src=versioned(output, 'theme-init.js')))
    document.head.append(document.new_tag('script', src=versioned(output, 'studio.js'), defer=True))
    document.select_one('header').append(BeautifulSoup(theme_control(), 'html.parser'))
    reader.write_text(str(document), encoding='utf-8')
    install_client_pages(root, output, css, page)
    routes.extend(('/work/', '/resume/'))
    routes.extend(install_tours(output, css, page))
    routes.append(install_worlds(root, output, page, versioned))
    routes.extend(install_studio(root, output, page, css, versioned))
    write_sitemaps(root, output, routes, [*videos, *motion_archive])


def write_sitemaps(root, output, routes, videos):
    ET.register_namespace('', SITEMAP_NS)
    ET.register_namespace('video', VIDEO_NS)
    sitemap = ET.Element(f'{{{SITEMAP_NS}}}urlset')
    for route in sorted(routes):
        if not (output / route.strip('/') / 'index.html').is_file():
            raise ValueError(f'Missing sitemap route {route}')
        entry = ET.SubElement(sitemap, f'{{{SITEMAP_NS}}}url')
        ET.SubElement(entry, f'{{{SITEMAP_NS}}}loc').text = ORIGIN + route
    ET.ElementTree(sitemap).write(output / 'sitemap.xml', encoding='utf-8', xml_declaration=True)
    video_sitemap = ET.Element(f'{{{SITEMAP_NS}}}urlset')
    for item in videos:
        entry = ET.SubElement(video_sitemap, f'{{{SITEMAP_NS}}}url')
        ET.SubElement(entry, f'{{{SITEMAP_NS}}}loc').text = ORIGIN + item['address']
        info = ET.SubElement(entry, f'{{{VIDEO_NS}}}video')
        for element, field in (('thumbnail_loc', 'thumbnail'), ('title', 'title'),
                               ('description', 'description'), ('player_loc', 'embed')):
            ET.SubElement(info, f'{{{VIDEO_NS}}}{element}').text = item[field]
    ET.ElementTree(video_sitemap).write(output / 'video-sitemap.xml', encoding='utf-8', xml_declaration=True)
    (output / 'robots.txt').write_text(f'User-agent: *\nAllow: /\n\nSitemap: {ORIGIN}/sitemap.xml\nSitemap: {ORIGIN}/video-sitemap.xml\nSitemap: {ORIGIN}/image-sitemap.xml\n')
    key = (root / 'data/indexnow-key.txt').read_text().strip()
    if not re.fullmatch(r'[0-9a-f]{32}', key):
        raise ValueError('Unexpected IndexNow key format')
    (output / f'{key}.txt').write_text(key + '\n')
