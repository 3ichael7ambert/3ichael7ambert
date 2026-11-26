"""Publish browsable gallery pages with HTML image links for search discovery."""
from html import escape
import xml.etree.ElementTree as ET

IMAGES = 'http://www.google.com/schemas/sitemap-image/1.1'
SITEMAP = 'http://www.sitemaps.org/schemas/sitemap/0.9'
ORIGIN = 'https://3ichael7ambert.com'


def install_art_archive(output, page, css, works, artwork_card):
    def address(number):
        return '/art/archive/' if number == 1 else f'/art/archive/{number}/'

    batches = [works[start:start + 36] for start in range(0, len(works), 36)]
    sitemap = ET.Element('urlset', {'xmlns': SITEMAP})
    ET.register_namespace('image', IMAGES)
    routes = []
    for number, group in enumerate(batches, 1):
        path = address(number)
        routes.append(path)
        entry = ET.SubElement(sitemap, 'url')
        ET.SubElement(entry, 'loc').text = ORIGIN + path
        for src in dict.fromkeys(w['large'] for w in group if w['large'].startswith('/')):
            image = ET.SubElement(entry, f'{{{IMAGES}}}image')
            ET.SubElement(image, f'{{{IMAGES}}}loc').text = ORIGIN + src

        title = f'Art and photography archive · Page {number}'
        categories = ', '.join(dict.fromkeys(w['category'] for w in group))
        description = f'Browse page {number} of the 3ichael 7ambert visual archive, featuring {categories}.'
        navigation = ''.join(
            f'<a href="{address(i)}"{" aria-current=page" if i == number else ""}>{i}</a>'
            for i in range(1, len(batches) + 1)
        )
        page(output, path, title, description,
             f'<h1>{escape(title)}</h1><p><a href="/art/#archive">Search and filter the gallery →</a></p>'
             f'<nav class="page-turn" aria-label="Archive pages">{navigation}</nav>'
             f'<div class="portfolio-grid">{"".join(artwork_card(work) for work in group)}</div>'
             f'<nav class="page-turn" aria-label="Archive pages">{navigation}</nav>', css,
             image=group[0]['thumb'])
    ET.ElementTree(sitemap).write(output / 'image-sitemap.xml', encoding='utf-8', xml_declaration=True)
    return routes
