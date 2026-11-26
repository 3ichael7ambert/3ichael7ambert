"""Publish individual book pages and a source-linked discography."""
from html import escape
import json

BOOK_DETAILS = {
    'artist-statement': (
        'A retrospective on work made between 2005 and 2024. The book moves from graphite, ink and painting to photography, digital illustration, animation and game development, with a timeline and reflections on how those media overlap.',
        'Google Books', 'https://books.google.com/books/about/The_Artwork_of_3ichael_7ambert.html?id=rbqc0gEACAAJ',
        '/art/from-the-book/', 'View selected works from the illustrated anthology'),
    'portraitography-2026': (
        'Portrait and figure studies in graphite, ink, paint and digital color. The book puts detail plates and short notes alongside the artwork so readers can compare how each medium shapes a likeness.',
        'Readings', 'https://www.readings.com.au/product/9798182915281/portraitography--michael-andrew-lambert--2026--9798182915281',
        '/art/', 'Explore more artwork'),
    'deadsexymikey': (
        'A memoir about the person behind the MySpace-era username. It follows the author through photography, music, trucking and software, tracing how those changes shaped his creative life.',
        '', '', '/about/', 'Meet the author'),
}
PHOTO_EDITIONS = {
    'the-early-years': ('9798182941860', 'Hardcover', 'Early photographs from 2011 and 2012 trace experiments with color, artificial light, motion, reflections and close details.'),
    'lines-in-shape': ('9798182939539', 'Hardcover', 'Architecture alternates with natural subjects in a sequence organized around edges, repetition and geometry.'),
    'seasons-of-change': ('9798182939645', 'Paperback', 'Photographs move through snow, budding plants, blooms and autumn color, following changes in light and texture across the seasons.'),
}
RECORDINGS = (
    ('A Rocket’s Intensity', 'Spread Love Like Wildfire (Continuous 3ichael 7ambert Remix)',
     'Electronic · 2018', 'A continuous electronic mix running over 80 minutes.',
     'https://music.apple.com/us/album/spread-love-like-wildfire-continuous-3ichael-7ambert/1541142447'),
    ('Connect the Dots', 'Spread Love Like Wildfire, Pt. 1',
     'Hip-hop · 2024', 'A 16-track edition, released under Connect the Dots with a 3ichael 7ambert recording credit.',
     'https://music.apple.com/us/album/spread-love-like-wildfire-pt-1/1779390775'),
    ('Pond Nozzles', 'Spread Love Like Wildfire, Pt. I',
     'Country · 2025', 'A 16-track country edition released under Pond Nozzles with a 3ichael 7ambert recording credit.',
     'https://music.apple.com/us/album/spread-love-like-wildfire-pt-i/1796018266'),
    ('Red Hail', 'Spread Love Like Wildfire',
     'Alternative · 2025', 'A 13-track Red Hail release with a 3ichael 7ambert recording credit.',
     'https://music.amazon.com/albums/B0DXFWPV8G'),
)


def install_book_releases(root, output, page, css, origin, author_id):
    books = json.loads((root / 'data/books.json').read_text(encoding='utf-8'))
    entries = {book['id']: book for book in books}
    routes = []
    cards = []
    for slug, (detail, source_label, source, related, related_label) in BOOK_DETAILS.items():
        book = entries[slug]
        route = f'/books/{slug}/'
        title = escape(book['title'])
        cover = f'/assets/media/{slug}-480.webp'
        if not (output / cover.lstrip('/')).is_file():
            raise ValueError(f'Missing book cover {cover}')
        retailer = escape(book['links'][0]['url'], quote=True)
        reference = f' · <a href="{source}">Find this edition on {source_label}</a>' if source else ''
        schema = {'@context': 'https://schema.org', '@type': 'Book', 'name': book['title'],
                  'description': detail, 'url': origin + route, 'image': origin + cover,
                  'author': {'@type': 'Person', '@id': author_id, 'name': 'Michael Andrew Lambert Jr.'}}
        page(output, route, book['title'], detail,
             f'<p><a href="/books/">← Bookshelf</a></p><h1>{title}</h1>'
             f'<div class="book-spread"><img src="{cover}" alt="Cover of {title}"><div>'
             f'<p>{escape(detail)}</p><p><a class="button" href="{retailer}">Find on Apple Books</a>{reference}</p>'
             f'<p><a href="{related}">{related_label} →</a></p></div></div>', css, image=cover, schema=schema)
        routes.append(route)
        cards.append(f'<a class="edition-card" data-release-card href="{route}">'
                     f'<img src="{cover}" alt="" width="240" height="320" loading="lazy" decoding="async">'
                     f'<span>{title}</span><small>{escape(book["category"])}</small></a>')
    return routes, ''.join(cards)


def install_discography(output, page, css):
    route = '/music/discography/'
    cards = []
    for artist, title, metadata, description, url in RECORDINGS:
        platform = 'Apple Music' if url.startswith('https://music.apple.com/') else 'Amazon Music'
        cards.append(f'<article class="release-card"><h2>{escape(artist)}</h2>'
                     f'<p><cite>{escape(title)}</cite> · {metadata}</p><p>{escape(description)}</p>'
                     f'<a href="{url}">Listen on {platform} ↗</a></article>')
    page(output, route, 'Selected discography and recording credits',
         'Explore four editions of Spread Love Like Wildfire across electronic, hip-hop, country and alternative music.',
         '<p><a href="/music/">← Music and visualizers</a></p><h1>Selected discography</h1>'
         '<p class="page-intro"><cite>Spread Love Like Wildfire</cite> appears across several projects. '
         'Follow it from an extended electronic mix to releases in hip-hop, country and alternative music.</p>'
         f'<div class="release-grid">{"".join(cards)}</div>'
         '<p><a href="https://music.apple.com/us/artist/3ichael-7ambert/653323466">Explore 3ichael 7ambert on Apple Music ↗</a></p>', css)
    return route
