"""Public client services and résumé, using the portfolio's existing academic record."""
from html import escape
import json
from urllib.parse import quote

from bs4 import BeautifulSoup


def install_client_pages(root, output, css, page):
    email = 'mlambertbusiness@gmail.com'
    subject = quote('Project inquiry for Michael Lambert')
    body = quote('Hi Michael,\n\nProject or role:\nWhat I need:\nTimeline:\nBudget range, if known:\nLinks or references:\n')
    contact = f'mailto:{email}?subject={subject}&amp;body={body}'
    services = (
        ('Websites and creative tools', 'Portfolio sites, interactive front ends, and browser-based tools. See this sketchbook for an example of a static site with searchable artwork, reader controls, and drawing tools.', '/', 'Explore the sketchbook'),
        ('Game prototypes and interactive experiences', 'Mechanics, UI, game art, and browser-playable prototypes. Explore examples from arcade games, sports games, and puzzle adventures.', '/#games', 'See playable projects'),
        ('Art, photography and publishing', 'Illustration, photography, creative assets, and illustrated or image-heavy books. Browse the work to see the range of media and formats.', '/art/', 'See the art portfolio'),
        ('Music and visualizers', 'Composition, game soundtracks, and visuals made to accompany music. The archive includes a 360° piece and official music visualizers.', '/music/', 'Watch the visualizers'),
    )
    cards = ''.join(f'<article class="release-card"><h2>{escape(title)}</h2><p>{escape(text)}</p><a href="{url}">{escape(label)} →</a></article>'
                    for title, text, url, label in services)
    page(output, '/work/', 'Work with Michael Lambert',
         'Contact Denver-based developer and multidisciplinary artist Michael Lambert for websites, game prototypes, illustration, publishing, music and visualizers.',
         '<h1>Work with me</h1><p class="page-intro">I’m Michael Andrew Lambert Jr., a Denver-based developer and artist. '
         'I take on projects that bring software and creative work together.</p>'
         f'<p><a class="button" href="{contact}">Email a project brief</a> <a href="/resume/">View my résumé</a></p>'
         f'<div class="release-grid">{cards}</div>'
         '<h2>Tell me what you’re making</h2><p>Send a short description, examples, your deadline, and a budget range if you have one.</p>'
         f'<p><a href="{contact}">{email}</a></p>', css)

    career = json.loads((root / 'data/career.json').read_text(encoding='utf-8'))
    academic = BeautifulSoup(career['education'], 'html.parser')
    rows = []
    for heading in academic.find_all('h3'):
        school = heading.find_next_sibling('p')
        if not school:
            continue
        degree = ' '.join(heading.stripped_strings).replace('Govenors', 'Governors')
        institution = ' '.join(school.stripped_strings).replace('Govenors', 'Governors')
        if degree.startswith('Master of Arts Organizational Leadership'):
            institution += ' · 2025'
        rows.append(f'<li><strong>{escape(degree)}</strong><br>{escape(institution)}</li>')
    if not rows:
        raise ValueError('Missing academic record for the public résumé')
    page(output, '/resume/', 'Michael Lambert résumé and education',
         'Read Michael Andrew Lambert Jr.’s résumé, including academic credentials, certifications, software projects and creative work.',
         '<h1>Michael Lambert</h1><p class="page-intro">Software developer and multidisciplinary artist based in Denver, Colorado.</p>'
         f'<p><a class="button" href="{contact}">Contact me about a role or project</a></p>'
         '<h2>Selected work</h2><p>Explore <a href="/skills/">skills and projects</a>, '
         '<a href="/#games">playable games</a>, and <a href="/art/">art and photography</a>.</p>'
         f'<h2>Education</h2><ul class="release-list">{"".join(rows)}</ul>'
         '<h2>Certifications and experience</h2><p>See the <a href="/#background">full experience, certificates, and résumé links</a> in the portfolio.</p>', css)
