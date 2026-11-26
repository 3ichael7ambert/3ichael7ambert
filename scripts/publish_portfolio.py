"""Publish the interactive About page and the public collections."""
from hashlib import sha256
from html import escape
from pathlib import Path
from urllib.parse import urlencode
import re
import json
import shutil

from bs4 import BeautifulSoup

from publish_public_archive import restore_public_archive
from publish_panoramas import install_panoramas
from publish_exhibition import install_exhibition

AUTHOR = 'Michael Andrew Lambert Jr.'
MEDIA = '/assets/media/lenticular/'
PUBLIC_ARCHIVE = ('https://raw.githubusercontent.com/3ichael7ambert/blueandyellow-portfolio/'
                  '604fdae73d3b3ccd037236d8d7331261bef9dd0d/gallery/images/')
MOTION_INTRO = (
    'Stop motion, animation, 360° environments, and music visualizers from my moving-image work.'
)


COLLECTIONS = (
    ('Photography', 'sunlight-480.webp', 'Photography', 'Botanical details, wildlife, and landscapes'),
    ('Ink & graphite', 'graphite-480.webp', 'Ink & graphite', 'Portraits, sketchbooks, and studies in line'),
    ('Illustration', 'micro-world-480.webp', 'Illustration', 'Characters, objects, and imagined places'),
    ('Digital art', 'neon-figure-480.webp', 'Digital & urban', 'Color, light, collage, and graphic experiments'),
    ('Little planets', 'little-world-480.webp', 'Little planets & panoramas', 'Photographs shaped into worlds'),
    ('Alieno Apparel', 'cherry-shirt-480.webp', 'Apparel', 'Repeat patterns and wearable illustration'),
)


def artwork_card(work):
    title = escape(work['title'] or work['alt'], quote=True)
    return (
        f'<figure class="portfolio-work"><a href="{escape(work["large"], quote=True)}" aria-label="Open {title}">'
        f'<img src="{escape(work["thumb"], quote=True)}" alt="{escape(work["alt"], quote=True)}"'
        ' loading="lazy" decoding="async"></a>'
        f'<figcaption><span>{escape(work["title"])}</span><small>{escape(work["category"])}</small>'
        '</figcaption></figure>'
    )


def gallery_payload(root, output):
    homepage = BeautifulSoup((output / 'index.html').read_text(encoding='utf-8'), 'html.parser')
    works = json.loads(homepage.select_one('#gallery-data').string)
    archive = json.loads((root / 'data/portfolio-collection.json').read_text(encoding='utf-8'))
    runtime = output / 'assets' / 'media'
    for work in archive:
        for name in ('thumb', 'large'):
            if work[name].startswith(PUBLIC_ARCHIVE):
                continue
            path = Path(work[name].removeprefix('/assets/media/'))
            if not work[name].startswith('/assets/media/portfolio/') or '..' in path.parts:
                raise ValueError(f'Invalid portfolio image address {work[name]}')
            if not (runtime / path).is_file():
                raise ValueError(f'Missing portfolio image {work[name]}')
    items = []
    for work in [*works, *archive, *restore_public_archive(root, output, works)]:
        item = {key: work[key] for key in ('title', 'alt', 'category', 'thumb', 'large')}
        for key in ('width', 'height', 'collection'):
            if key in work:
                item[key] = work[key]
        for key in ('thumb', 'large'):
            if not item[key].startswith(('https://', '/')):
                item[key] = '/' + item[key]
        item['id'] = work.get('id') or sha256(item['large'].encode()).hexdigest()[:20]
        items.append(item)
    return items


def install_portfolio(root, output, page, versioned, video_cards, videos, publish_video):
    for filename in ('portfolio.css', 'portfolio.js', 'lenticular.js'):
        shutil.copy2(root / 'assets' / filename, output / 'assets' / filename)
    art_css = versioned(output, 'portfolio.css')
    about_js = versioned(output, 'lenticular.js')
    gallery_js = versioned(output, 'portfolio.js')

    frames = []
    for view in range(1, 5):
        path = f'{MEDIA}portrait-{view}.webp'
        if (output / path.lstrip('/')).is_file():
            frames.append(f'<img src="{path}" width="480" height="600" alt="" decoding="async">')
    if frames and len(frames) != 4:
        raise ValueError('The lenticular portrait requires four aligned frames')
    portrait = (
        '<figure class="lenticular" data-lenticular><div class="lenticular-stage">'
        f'<div class="lenticular-face" role="img" aria-label="Lenticular portrait of {AUTHOR}">'
        + ''.join(frames) +
        '</div></div><figcaption>Move your pointer or swipe across the portrait.</figcaption>'
        '<div class="lenticular-controls"><label>Portrait angle'
        '<input type="range" min="0" max="100" value="34"></label>'
        '<button type="button" data-tilt aria-pressed="false" hidden>Enable tilt</button></div>'
        '<p role="status" aria-live="polite" data-motion-status></p></figure>'
    )
    if frames:
        description = 'Meet 3ichael 7ambert and explore an interactive lenticular portrait of the Colorado artist and developer.'
        image = f'{MEDIA}portrait-2.webp'
        portrait_script = f'<script defer src="{about_js}"></script>'
    else:
        description = 'About 3ichael 7ambert, the Colorado artist, photographer and developer Michael Andrew Lambert Jr.'
        image = '/assets/media/portrait-480.webp'
        portrait_script = ''
        portrait = (f'<figure class="lenticular"><img class="about-still" src="{image}" '
                    f'alt="Portrait of {AUTHOR}" decoding="async"></figure>')
    page(output, '/about/', 'About Michael Lambert',
         description,
         f'<div class="about-layout">{portrait}<div class="about-copy"><div class="about-title"><p class="eyebrow">About the artist</p>'
         '<h1>Michael Lambert</h1><p class="page-intro">I’m Michael Andrew Lambert Jr., a Colorado artist and '
         'developer working as 3ichael 7ambert.</p></div><div class="about-details">'
         '<p>I draw in ink and graphite, photograph the world at its smallest and widest, and build characters '
         'that find their way into books, games, and animation. I also make music and design all-over prints '
         'for Alieno Apparel.</p><p>Design with a Technical Mind.</p>'
         '<div class="portfolio-links"><a class="button" href="/art/">Explore my work</a>'
         '<a href="/work/">Work with me</a><a href="/resume/">Résumé</a></div></div></div></div>'
         + portrait_script, art_css, image=image, kind='about',
         schema={'@context': 'https://schema.org', '@type': 'ProfilePage', 'mainEntity': {
             '@type': 'Person', '@id': 'https://3ichael7ambert.com/#michael-lambert', 'name': AUTHOR,
             'alternateName': '3ichael 7ambert',
             'image': 'https://3ichael7ambert.com' + image,
         }})

    works = gallery_payload(root, output)
    archive = output / 'assets' / 'portfolio-collection.json'
    archive.write_text(json.dumps(works, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    categories = sorted({work['category'] for work in works}, key=str.casefold)
    options = ''.join(f'<option>{escape(category)}</option>' for category in categories)
    grid = ''.join(artwork_card(work) for work in works[:36])
    shelves = ''.join(
        f'<a class="portfolio-shelf" href="/art/?{urlencode({"medium": medium})}#archive">'
        f'<img src="/assets/media/{image}" alt="" loading="lazy" decoding="async">'
        f'<span><strong>{escape(label)}</strong><small>{escape(summary)}</small></span></a>'
        for label, image, medium, summary in COLLECTIONS
    )
    page(output, '/art/', 'Art and photography portfolio',
         'Explore the artwork, photographs, graphic design, panoramas and moving-image work of 3ichael 7ambert.',
         '<div class="portfolio-hero"><img src="/assets/media/water-world-1600.webp" '
         'alt="Illustration of an imagined aquatic world in blue and green" decoding="async">'
         '<div class="portfolio-hero-copy"><h1>Art &amp; photography</h1>'
         '<p>Drawn faces, small worlds, moving images, and patterns you can wear.</p>'
         '<div class="portfolio-links"><a class="button" href="/explore/visual-journey/">Start the visual journey</a>'
         '<a href="#archive">Browse all works ↓</a></div></div></div>'
         '<nav class="portfolio-links portfolio-landmarks" aria-label="Explore the portfolio">'
         '<a href="/art/motion/">Cinematography &amp; motion</a><a href="/art/panoramas/">360° photography</a>'
         '<a href="/worlds/">Characters &amp; worlds</a><a href="/books/">Art and photography books</a>'
         '<a href="/about/">About the artist</a></nav>'
         '<section aria-labelledby="collection-heading"><h2 id="collection-heading">Browse by medium</h2>'
         f'<div class="portfolio-shelves">{shelves}</div></section>'
         f'<section id="archive" aria-labelledby="archive-heading" data-portfolio="{versioned(output, archive.name)}">'
         '<h2 id="archive-heading">The full archive</h2>'
         '<form class="portfolio-tools" role="search" hidden><label>Search the portfolio'
         '<input type="search" placeholder="Title, subject, or collection"></label>'
         f'<label>Medium<select><option value="">All media</option>{options}</select></label>'
         '<button type="reset">Clear filters</button><button type="button" data-surprise>Surprise me</button></form>'
         f'<p role="status" aria-live="polite">{len(works):,} works</p>'
         f'<div class="portfolio-grid" tabindex="-1">{grid}</div>'
         '<nav class="portfolio-pages" aria-label="Gallery pages" hidden>'
         '<button type="button" data-prev-page>← Previous page</button>'
         '<button type="button" data-next-page>Next page →</button></nav>'
         '<template><figure class="portfolio-work"><a><img alt="" loading="lazy" decoding="async"></a>'
         '<figcaption><span></span><small></small></figcaption></figure></template></section>'
         '<dialog class="portfolio-viewer" aria-labelledby="portfolio-viewer-title"><header>'
         '<h2 id="portfolio-viewer-title"></h2><button type="button" data-close-work>Close ×</button></header>'
         '<img alt=""><nav aria-label="View artwork"><button type="button" data-prev-work>← Previous</button>'
         '<small data-viewer-count></small><a data-work-link href="#archive">Link to artwork</a>'
         '<button type="button" data-next-work>Next →</button></nav></dialog>'
         f'<script defer src="{gallery_js}"></script>', art_css)
    motion = [video for video in videos if video['format'] != 'Podcast video']
    motion_archive = json.loads((root / 'data/motion-portfolio.json').read_text(encoding='utf-8'))
    if len({video['id'] for video in [*videos, *motion_archive]}) != len(videos) + len(motion_archive):
        raise ValueError('Duplicate video ID in the portfolio')
    for video in motion_archive:
        slug = re.sub(r'[^a-z0-9]+', '-', video['title'].lower()).strip('-')[:75].rstrip('-')
        video['address'] = f'/art/motion/watch/{slug}-{video["id"]}/'
        video['description'] = f'{video["title"]}, from the {video["format"].lower()} portfolio of {video["credit"]}.'
        publish_video(output, art_css, video, '/art/motion/', 'Cinematography & motion')
    motion.extend(motion_archive)
    collections = (
        ('Cinematography, animation & stop motion', {'Art film', 'Cinematography', 'Animation', 'Stop motion'}),
        ('360° & VR', {'360° animation', '360° visualizer'}),
        ('Music videos & visualizers', {video['format'] for video in motion} -
         {'Art film', 'Cinematography', 'Animation', 'Stop motion', '360° animation', '360° visualizer'}),
    )
    motion_html = ''.join(
        f'<section class="motion-collection" id="{section}"><h2>{escape(label)}</h2><div class="release-grid">'
        f'{video_cards([video for video in motion if video["format"] in types])}</div></section>'
        for section, (label, types) in zip(('animation', 'vr', 'visualizers'), collections, strict=True)
    )
    page(output, '/art/motion/', 'Cinematography & motion', MOTION_INTRO,
         '<p><a href="/art/">← Artwork and photography</a></p><h1>Cinematography &amp; motion</h1>'
         f'<p class="page-intro">{MOTION_INTRO}</p>'
         '<p><a href="/art/panoramas/">Explore the 360° photographs</a></p>'
         + motion_html, art_css)
    panoramas = install_panoramas(root, output, page, art_css, versioned)
    routes = ['/about/', '/art/', '/art/motion/', panoramas, *install_exhibition(output, page, art_css)]
    routes.extend(video['address'] for video in motion_archive)
    return routes, motion_archive
