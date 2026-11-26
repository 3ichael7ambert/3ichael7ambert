"""Publish the press release archive and links checked against the original article."""
from html import escape
import json
from urllib.parse import urlsplit


def install_press(root, output, page, css):
    route = '/press/'
    copies = json.loads((root / 'data/press-copies.json').read_text(encoding='utf-8'))
    links = []
    for copy in copies:
        url = copy['url']
        address = urlsplit(url)
        if address.scheme not in ('http', 'https') or not address.hostname or address.username:
            raise ValueError(f'Invalid publication URL: {url}')
        links.append(
            f'<li><a href="{escape(url, quote=True)}">{escape(copy["name"])}</a>'
            f'<br><small>{escape(address.hostname)}</small></li>'
        )

    release = ('Celebrating Creativity: 3ichael 7ambert Explores the Simplicities '
               'and Complexities of Art in Various Forms')
    page(output, route, 'Press kit and press release archive',
         'Find 3ichael 7ambert’s artist bio, portrait, media contact and verified copies of the November 2022 MarketersMEDIA press release.',
         '<h1>Press kit</h1>'
         '<p class="page-intro">Michael Andrew Lambert Jr. works as 3ichael 7ambert. '
         'He is a Colorado artist, photographer, author, musician and developer whose work '
         'spans drawing, digital illustration, 360° photography, books and independent games.</p>'
         '<p class="page-turn"><a href="/assets/media/identity-480.webp" download>Download artist portrait</a>'
         '<a href="/about/">Artist bio</a><a href="/art/">Visual portfolio</a>'
         '<a href="/work/">Media and project inquiries</a></p>'
         '<h2>Press release archive</h2>'
         '<article class="release-card"><p>MarketersMEDIA · <time datetime="2022-11-16">November 16, 2022</time></p>'
         f'<h3>{escape(release)}</h3><p>The release introduced the 3ichael 7ambert artist name '
         'and described a practice that crosses visual art and other creative media.</p>'
         f'<details><summary>View all {len(links)} verified republications</summary>'
         '<p>These links lead to syndicated copies of the same announcement.</p>'
         f'<ul class="release-list">{"".join(links)}</ul></details></article>', css)
    return route
