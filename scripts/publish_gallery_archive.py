"""Add the early portfolio collection to the existing gallery and lightbox."""

from html import escape
import json
from bs4 import BeautifulSoup


def append_gallery_archive(root, html):
    archive = json.loads((root / 'data/gallery-archive.json').read_text(encoding='utf-8'))
    document = BeautifulSoup(html, 'html.parser')
    payload = document.select_one('#gallery-data')
    works = json.loads(payload.string)
    gallery = document.select_one('#art-grid')
    filters = document.select_one('#design .filters')
    categories = {button['data-filter'] for button in filters.select('[data-filter]')}
    ids = {work['id'] for work in works}
    for work in archive:
        if work['id'] in ids:
            raise ValueError(f'Duplicate artwork: {work["id"]}')
        ids.add(work['id'])
        for size in ('thumb', 'large'):
            if not work[size].startswith("https://raw.githubusercontent.com/3ichael7ambert/blueandyellow-portfolio/"):
                raise ValueError(f'Unexpected archive image source: {work[size]}')
        category = work['category']
        if category not in categories:
            button = document.new_tag('button', type='button', attrs={
                'data-filter': category, 'data-scope': 'art', 'aria-pressed': 'false',
            })
            button.string = category
            filters.append(button)
            categories.add(category)
        title = escape(work['title'])
        label = escape(category)
        thumb, large = escape(work['thumb']), escape(work['large'])
        card = BeautifulSoup(
            f'<figure class="art-card" data-category="{label}">'
            f'<a class="art-open" href="{large}" data-gallery="{len(works)}" '
            f'aria-label="Open {title} in full-screen gallery">'
            f'<img src="{thumb}" alt="{escape(work["alt"])}" width="{work["width"]}" '
            f'height="{work["height"]}" loading="lazy" decoding="async">'
            '<span class="expand" aria-hidden="true">↗</span></a>'
            f'<figcaption><span>{title}</span><small>{label} · Early portfolio</small></figcaption></figure>',
            'html.parser',
        )
        gallery.append(card.figure)
        works.append(work)
    payload.string = json.dumps(works, ensure_ascii=False).replace('<', '\\u003c')
    return str(document)
