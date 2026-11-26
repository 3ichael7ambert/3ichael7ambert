"""Standalone play and shop pages, with shared home navigation."""
from html import escape
import json

from bs4 import BeautifulSoup


def theme_control():
    choices = [('sketchbook', 'Sketchbook'), ('light', 'Daylight'), ('dark', 'Midnight'),
               ('music', 'Soundtrack'), ('art', 'Graph paper'), ('system', 'System')]
    options = ''.join(f'<option value="{key}">{title}</option>' for key, title in choices)
    return f'<label class="studio-theme" hidden><span>Theme</span><select data-studio-theme aria-label="Theme">{options}</select></label>'


def featured_cards(root, group, items):
    cards = []
    for number, item in enumerate(items):
        asset = f'/assets/media/{group}-{number}-640.webp' if group != 'stores' else f'/assets/media/stores-{number}-480.webp'
        image = f'<img src="{asset}" alt="" width="640" height="480" loading="lazy" decoding="async">' if (root / asset.lstrip('/')).is_file() else ''
        cards.append(
            f'<article class="release-card studio-card">{image}<div>'
            f'<p class="studio-category">{escape(item["category"])}</p>'
            f'<h2>{escape(item["title"])}</h2><p>{escape(item["description"])}</p>'
            f'<a href="{escape(item["url"], quote=True)}">{"Visit storefront" if group == "stores" else "View project"} ↗</a>'
            '</div></article>'
        )
    return ''.join(cards)


def install_studio(root, output, page, css, versioned):
    featured = json.loads((root / 'data/featured.json').read_text(encoding='utf-8'))
    homepage = output / 'index.html'
    html = BeautifulSoup(homepage.read_text(encoding='utf-8'), 'html.parser')
    game = html.select_one('#sketch-run')
    if not game:
        raise ValueError('Missing Sketchbook Run')
    game_page = BeautifulSoup(str(game), 'html.parser').section
    del game_page['class']
    game_page.h2.decompose()
    game_page['aria-labelledby'] = 'play-title'
    page(output, '/play/', 'Play and explore',
         'Play Sketchbook Run and discover independent games and interactive worlds by 3ichael 7ambert.',
         '<div class="studio-band"><h1 id="play-title">Play &amp; explore</h1><p class="page-intro">'
         'Run across a sketchbook page, then explore games made from the same mix of drawing and code.</p>'
         '<a href="/worlds/">Meet the characters →</a></div>'
         '<h2>Sketchbook Run</h2>' + str(game_page) +
         '<h2>Independent games</h2><div class="release-grid studio-cards">' +
         featured_cards(output, 'games', featured['games']) +
         '</div><p><a href="/#games">Browse the complete games and tools catalog →</a></p>'
         f'<script defer src="{versioned(output, "sketch-run.js")}"></script>', css)
    page(output, '/store/', 'Prints, apparel and digital work',
         'Find art prints, wearables, games, tools, and books from 3ichael 7ambert.',
         '<div class="studio-band"><h1>Shop the work</h1><p class="page-intro">Find the drawings, photographs, '
         'and patterns as prints, apparel, illustrated books, and digital releases.</p>'
         '<a href="/art/?medium=Apparel#archive">See Alieno Apparel designs →</a></div>'
         '<div class="release-grid studio-cards">' + featured_cards(output, 'stores', featured['stores']) +
         '</div><p><a href="/books/">Explore the books</a> · <a href="/#clothing">More storefronts</a></p>', css)

    destinations = (
        ('/art/', 'Art & photography', 'urban-colour-480.webp'),
        ('/art/depth/', '3D images', '/assets/media/depth/cherries-thumb.webp'),
        ('/art/panoramas/', '360° worlds', '/assets/media/panoramas/3-thumb.webp'),
        ('/art/motion/', 'Films & animation', 'micro-world-480.webp'),
        ('/play/', 'Play & games', 'games-0-640.webp'),
        ('/books/', 'Books & reading', 'book-11-480.webp'),
        ('/music/', 'Music', 'music-0-640.webp'),
        ('/store/', 'Shop', 'cherry-shirt-480.webp'),
    )
    cards = []
    for address, label, asset in destinations:
        src = asset if asset.startswith('/') else f'/assets/media/{asset}'
        if not (output / src.lstrip('/')).is_file():
            raise ValueError(f'Missing cover image {src}')
        cards.append(f'<a href="{address}"><img src="{src}" alt="" width="320" height="180" loading="lazy" decoding="async"><span>{escape(label)}</span></a>')
    rail = BeautifulSoup('<nav class="studio-cover" aria-label="Explore the portfolio">' +
                         ''.join(cards) + '</nav>', 'html.parser').nav
    index = html.select_one('.sketchbook-index')
    index.insert_before(rail)
    primary = {address for address, _, _ in destinations}
    for link in index.select('a[href]'):
        if link['href'] in primary:
            link.parent.decompose()
    games = html.select_one('.section-nav a[href="#games"]')
    games['href'] = '/play/'
    games.string = 'Play'
    depth = html.new_tag('a', href='/art/depth/')
    depth.string = '3D & depth'
    html.select_one('.section-nav a[href="/art/"]').insert_after(depth)
    homepage.write_text(str(html), encoding='utf-8')
    return ['/play/', '/store/']
