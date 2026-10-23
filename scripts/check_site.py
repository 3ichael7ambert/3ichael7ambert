"""Offline regression checks and asset budgets; exits nonzero on a defect."""
import json, re
from pathlib import Path
from urllib.parse import urlsplit, unquote
from collections import Counter
from bs4 import BeautifulSoup
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
soup = BeautifulSoup((ROOT/'index.html').read_text(), 'html.parser')
errors = []
def check(condition, message):
    if not condition: errors.append(message)

ids = [x['id'] for x in soup.select('[id]')]
check(len(ids) == len(set(ids)), 'Duplicate HTML IDs')
check(len(soup.select('h1')) == 1, 'Expected exactly one H1')
check(not soup.select('iframe'), 'No third-party frames allowed on initial load')
check(not soup.select('canvas'), 'No unbounded decorative canvases')
for element in soup.find_all(True):
    check(not any(key.startswith('on') for key in element.attrs), 'Inline event handler')
    for attr in ('src','href'):
        url = element.get(attr, '')
        if not url: continue
        parsed = urlsplit(url)
        if url.startswith('#'):
            check(url[1:] in ids, f'Missing anchor {url}')
        elif not parsed.scheme and not parsed.netloc:
            check((ROOT/unquote(parsed.path)).is_file(), f'Missing asset {url}')
        else:
            check(parsed.scheme in ('https','mailto','tel'), f'Unsafe URL {url}')
for image in soup.select('img'):
    check(image.has_attr('alt'), 'Missing alt attribute')
    check(image.has_attr('width') and image.has_attr('height'), 'Missing image dimensions')
    check(image.get('loading') == 'lazy' or image.get('id') == 'pencil-cursor' or 'hero' in ' '.join(str(p.get('class','')) for p in image.parents), 'Non-hero image must lazy load')
for css_url in re.findall(r'url\([\'"]?([^\)\'\"]+)',(ROOT/'assets/site.css').read_text()):
    check((ROOT/'assets'/css_url).is_file(), f'Missing CSS asset {css_url}')
gallery=json.loads((ROOT/'data/gallery.json').read_text())
books=json.loads((ROOT/'data/books.json').read_text())
check(len(gallery)==len(soup.select('.art-card')), 'Gallery/build mismatch')
check(len(books)==len(soup.select('.book-card')), 'Books/build mismatch')
check(len({g['id'] for g in gallery})==len(gallery), 'Duplicate artwork IDs')
for p in (ROOT/'assets/media').glob('*.webp'):
    with Image.open(p) as im: check(max(im.size)<=1600, f'Oversized decoded image {p.name}')
    check(p.stat().st_size<500_000, f'Image exceeds 500 KB budget: {p.name}')
check((ROOT/'assets/site.js').stat().st_size<25_000, 'JavaScript exceeds 25 KB budget')
check((ROOT/'index.html').stat().st_size<250_000, 'HTML exceeds 250 KB budget')
check(sum(p.stat().st_size for p in (ROOT/'assets/media').glob('*'))<6_000_000, 'Media exceeds 6 MB budget')
if errors:
    raise SystemExit('\n'.join(sorted(set(errors))))
print(f'PASS: unique IDs, anchors, local assets, alt text, dimensions, lazy loading, safe links, {len(gallery)} artworks, {len(books)} books and performance budgets.')
