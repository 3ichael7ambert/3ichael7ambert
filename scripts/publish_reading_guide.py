"""Reader-friendly paths through Michael Lambert’s books and verified editions."""
from html import escape

SHELVES = (
    (
        'The Colorado Sunrise sequence',
        'Read the graphic memoir alongside its follow-ups to see how the same relationship looks from different points in time. Start in Colorado, then follow the story through the letter and the Midwest.',
        (
            ('Colorado Sunrise', 'Open the ebook listing on Hoopla', 'https://www.hoopladigital.com/ebook/colorado-sunrise-michael-andrew-lambert-jr/19833513'),
            ('Just in Case', 'Open the ebook listing on Hoopla', 'https://www.hoopladigital.com/ebook/just-in-case-michael-andrew-lambert-jr/19848302'),
            ('Midwest Sunset', 'Open the ebook listing on Hoopla', 'https://www.hoopladigital.com/ebook/Midwest-Sunset-Michael-Andrew-Lambert/20365010'),
        ),
    ),
    (
        'Portraits, drawings, and artist books',
        'Compare the same subject across different tools. Portraitography groups work in graphite, ink, paint, and digital color. Inktober offers a drawing-focused companion, and the Artwork series ranges across both traditional and digital media.',
        (
            ('Portraitography: Drawn in Many Ways', 'Find the edition on Apple Books', 'https://books.apple.com/us/book/portraitography/id6822920533'),
            ('Inktober 2023', 'Read on this site', '/books/inktober-2023/'),
            ('The Artwork of 3ichael 7ambert', 'Read the online collection', '/books/the-artwork-of-3ichael-7ambert/'),
            ('The Artwork of 3ichael 7ambert series', 'Browse the Apple Books editions', 'https://books.apple.com/us/book-series/the-artwork-of-3ichael-7ambert/id1897101136'),
            ('Artist Statement', 'Find the artist reflection on Apple Books', 'https://books.apple.com/us/book/the-artwork-of-3ichael-7ambert/id6822090618'),
        ),
    ),
    (
        'Ways of looking through a camera',
        'Start with a volume from Plastic Photography, then follow the subject that catches your eye. The newer photographic books each put a different subject at the center, from repeating shapes to color, plant forms, and underwater life.',
        (
            ('Plastic Photography: Selected Works', 'Read on this site', '/books/selected-works/'),
            ('Plastic Photography: A World Within', 'Read on this site', '/books/a-world-within/'),
            ('Lines in the Familiar', 'Find the print listing at Readings', 'https://www.readings.com.au/product/9798182996518/lines-in-the-familiar--michael-andrew-lambert--2026--9798182996518'),
            ('Color as a Subject', 'Find the print listing at Readings', 'https://www.readings.com.au/product/9798182996402/color-as-a-subject--michael-andrew-lambert--2026--9798182996402'),
            ('A Season in Small Forms', 'Find the print listing at Readings', 'https://www.readings.com.au/product/9798182996471/a-season-in-small-forms--michael-andrew-lambert--2026--9798182996471'),
            ('Behind the Glass', 'Find the print listing at Readings', 'https://www.readings.com.au/product/9798182996891/behind-the-glass--michael-andrew-lambert--2026--9798182996891'),
            ('Ripening Color', 'Find the print listing at Readings', 'https://www.readings.com.au/product/9798182996624/ripening-color--michael-andrew-lambert--2026--9798182996624'),
        ),
    ),
    (
        'Poetry and stories for younger readers',
        'Read a few pages of poetry in one sitting, or share a picture book about first-day nerves and finding a friend.',
        (
            ('Memorandum in a Cruet', 'Read on this site', '/books/memorandum-in-a-cruet/'),
            ('The Curly Caterpillar', 'Find the picture book at Barnes & Noble', 'https://www.barnesandnoble.com/w/the-curly-caterpillar-michael-andrew-lambert/1148223958'),
        ),
    ),
)


def install_reading_guide(output, css, page):
    path = '/books/reading-guide/'
    shelves = []
    for title, note, books in SHELVES:
        items = ''.join(
            f'<li><strong>{escape(name)}</strong><br><a href="{escape(url, quote=True)}">{escape(label)}</a></li>'
            for name, label, url in books
        )
        shelves.append(f'<section class="release-card"><h2>{escape(title)}</h2><p>{escape(note)}</p>'
                       f'<ul class="release-list">{items}</ul></section>')
    page(output, path, 'Reading guide to Michael Lambert’s books',
         'Explore the books of Michael Andrew Lambert Jr. and 3ichael 7ambert, from Colorado Sunrise to Plastic Photography, Portraitography, and poetry.',
         '<p><a href="/books/">← Bookshelf</a></p><h1>A reading guide</h1>'
         '<p class="page-intro">Start with a subject you like. Follow the links to read on this site or find an edition through a library or bookseller.</p>'
         f'<div class="release-grid">{"".join(shelves)}</div>'
         '<nav class="page-turn" aria-label="More reading"><a href="/books/">Browse the online bookshelf</a>'
         '<a href="/#book">See the full book catalog →</a></nav>', css)
    return path
