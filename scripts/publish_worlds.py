"""Install the portfolio's world guide and playable notebook margin."""
from html import escape
import json
import shutil

from bs4 import BeautifulSoup


def install_worlds(root, output, page, versioned):
    for filename in ('worlds.css', 'sketch-run.js', 'world-art.js'):
        shutil.copy2(root / 'assets' / filename, output / 'assets' / filename)
    css = versioned(output, 'worlds.css')
    worlds = json.loads((root / 'data/worlds.json').read_text(encoding='utf-8'))
    index = ''.join(f'<a href="#{item["id"]}">{escape(item["title"])}</a>' for item in worlds)
    entries = []
    for item in worlds:
        image = ''
        if 'image' in item:
            src, alt, caption = item['image']
            if src.startswith('/') and not (output / src.lstrip('/')).is_file():
                raise ValueError(f'Missing world art: {src}')
            src = escape(src)
            image = (f'<figure><a href="{src}"><img src="{src}" loading="lazy" decoding="async" '
                     f'alt="{escape(alt)}"></a><figcaption>{escape(caption)}</figcaption></figure>')
        if 'reader_art' in item:
            sheet, alt, caption = item['reader_art']
            reader_url = escape(item['links'][0][1])
            image = (f'<figure data-comic-sheet="{escape(sheet)}"><a href="{reader_url}">'
                     f'<img alt="{escape(alt)}" decoding="async"></a>'
                     f'<figcaption>{escape(caption)}</figcaption></figure>')
        cards = []
        for profile in item['cast']:
            facts = ''.join(
                f'<div><dt>{label}</dt><dd>{escape(profile[key])}</dd></div>'
                for key, label in (('role', 'Role'), ('appearance', 'Design reference'))
                if key in profile
            )
            details = f'<dl>{facts}</dl>' if facts else ''
            cards.append(f'<article class="character-card"><h4>{escape(profile["name"])}</h4>'
                         f'<p>{escape(profile["description"])}</p>{details}</article>')
        links = ''.join(f'<a href="{escape(url)}">{escape(label)}</a>' for label, url in item.get('links', []))
        actions = f'<p class="world-links">{links}</p>' if links else ''
        sheets = f'{item["id"]}-sheets'
        entries.append(f'<section class="world-entry" id="{item["id"]}"><h2>{escape(item["title"])}</h2>'
                       f'<p>{escape(item["setting"])}</p>'
                       f'<section class="character-sheets" aria-labelledby="{sheets}">'
                       f'<h3 id="{sheets}">Character sheets</h3>{image}'
                       f'<div class="character-grid">{"".join(cards)}</div></section>{actions}</section>')
    page(output, '/worlds/', 'Characters & worlds',
         'Explore Michael Lambert’s original characters, comics, and game worlds through cast profiles and design notes.',
         '<div class="world-guide"><h1>Characters &amp; worlds</h1>'
         '<p>Meet the characters behind my comics and games. Follow them from early drawings and'
         ' character sheets into the places they live, race, and explore.</p>'
         f'<nav aria-label="Jump to a world">{index}</nav>{"".join(entries)}</div>'
         f'<script src="{versioned(output, "world-art.js")}" defer></script>', css)

    homepage = output / 'index.html'
    document = BeautifulSoup(homepage.read_text(encoding='utf-8'), 'html.parser')
    document.head.append(document.new_tag('link', rel='stylesheet', href=css))
    document.head.append(document.new_tag('script', src=versioned(output, 'sketch-run.js'), defer=True))
    nav = document.select_one('.section-nav')
    worlds_link = document.new_tag('a', href='/worlds/')
    worlds_link.string = 'Worlds'
    nav.select_one('a[href="#games"]').insert_after(worlds_link)
    cover_index = document.select_one('.sketchbook-index')
    item = document.new_tag('li')
    link = document.new_tag('a', href='#sketch-run')
    link.string = 'Play Sketchbook Run'
    item.append(link)
    cover_index.append(item)
    section = BeautifulSoup("""
<section class="chapter" id="sketch-run" aria-labelledby="run-title">
  <h2 id="run-title">Sketchbook Run</h2>
  <p id="run-instructions">Take the stick figure across the page and collect all four ink stars.
    Use the left and right arrows to move and Space to jump, or use the buttons below.</p>
  <canvas width="760" height="174" tabindex="0" aria-label="Sketchbook Run play area" aria-describedby="run-instructions">
    Sketchbook Run requires canvas support.
  </canvas>
  <div class="run-controls">
    <button type="button" data-play>Play</button>
    <button type="button" data-move="left">Left</button>
    <button type="button" data-move="right">Right</button>
    <button type="button" data-move="jump">Jump</button>
  </div>
  <p role="status">Ready to play</p>
</section>""", 'html.parser').section
    document.select_one('#introduction').insert_after(section)
    button = document.new_tag('a', href='/worlds/', attrs={'class': 'button'})
    button.string = 'Meet the characters and explore their worlds'
    document.select_one('#games .section-heading').insert_after(button)
    homepage.write_text(str(document), encoding='utf-8')
    return '/worlds/'
