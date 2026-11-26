"""Three guided paths through the public portfolio."""
from html import escape

TOURS = (
    (
        'ways-of-seeing', 'Ways of seeing',
        'Follow a line from graphite portraiture to photography and the printed page.',
        'graphite-480.webp', 'Graphite portrait study',
        (
            ('Look closely at a portrait', 'Start with the graphite study. Compare the soft shading with the harder edges that define the face.', '/art/', 'See the portrait and selected artwork'),
            ('Change the scale', 'In the Plastic Photography collection, notice how a change in perspective can make a familiar view feel like a small world.', '/books/a-world-within/', 'Open A World Within'),
            ('Make your own comparison', 'Search the full archive for “portrait,” then try “little planet” to see how the same visual questions show up in different media.', '/#design', 'Search the gallery'),
        ),
    ),
    (
        'sound-in-motion', 'Sound in motion',
        'Explore two ways of putting images to sound, then visit a soundtrack made for a game.',
        'music-0-640.webp', 'A Rocket’s Intensity artwork',
        (
            ('Watch a music visualizer', 'Start with Guardians of the Waterfall. Listen for a change in the music and watch what happens in the frame at the same moment.', '/music/watch/guardians-of-the-waterfall/', 'Watch Guardians of the Waterfall'),
            ('Look outside the frame', 'Denver Underwater Moon uses a 360-degree canvas. On a supported player, drag the view and see how much of the scene you can find.', '/music/watch/denver-underwater-moon/', 'Explore the 360° video'),
            ('Go from video to a game score', 'The AR3NA Foosball soundtrack is one place to hear how Michael’s music crosses into his game work.', '/music/', 'Browse music and soundtracks'),
        ),
    ),
    (
        'from-sketch-to-play', 'From sketch to play',
        'Draw on the page, explore work that combines code and design, and try a playable world.',
        'urban-colour-480.webp', 'Colorful original character illustration',
        (
            ('Leave a mark', 'Choose Pencil on the cover and draw on the page with your mouse or finger. Use Eraser to remove a stroke and Browse when you’re ready to move on.', '/#introduction', 'Open the drawing desk'),
            ('Enter a playable world', 'Explore a game from the portfolio. Moly, Bart & Skid builds its puzzles around three characters with different abilities.', '/#games', 'Choose a game to explore'),
            ('See what goes into making it', 'Follow the skills chapter into software, game design, illustration, writing, or music production.', '/skills/', 'Visit skills and projects'),
        ),
    ),
)


def install_tours(output, css, page):
    routes = ['/explore/']
    cards = []
    for slug, title, intro, image, alt, stops in TOURS:
        path = f'/explore/{slug}/'
        media = f'/assets/media/{image}'
        if not (output / media.lstrip('/')).is_file():
            raise ValueError(f'Missing tour artwork {media}')
        cards.append(f'<article class="release-card"><a href="{path}"><img src="{media}" loading="lazy" '
                     f'alt=""><h2>{escape(title)}</h2></a><p>{escape(intro)}</p></article>')
        steps = ''.join(
            f'<li><article class="release-card"><h2>{escape(heading)}</h2><p>{escape(note)}</p>'
            f'<a href="{url}">{escape(label)} →</a></article></li>'
            for heading, note, url, label in stops
        )
        page(output, path, title, intro,
             f'<p><a href="/explore/">← All tours</a></p><h1>{escape(title)}</h1>'
             f'<div class="book-spread"><img src="{media}" alt="{escape(alt)}">'
             f'<p class="page-intro">{escape(intro)}</p></div>'
             f'<ol class="release-list">{steps}</ol>'
             '<div class="page-turn"><a href="/explore/">Choose another tour</a>'
             '<a href="/work/">Work with me →</a></div>', css, image=media)
        routes.append(path)

    page(output, '/explore/', 'Explore the living sketchbook',
         'Take a guided tour through 3ichael 7ambert’s art, photography, books, music visualizers, games, and interactive drawing desk.',
         '<h1>Explore the sketchbook</h1><p class="page-intro">Pick a path through the portfolio. '
         'Each tour has three stops, with something to look at, listen to, read, or try along the way.</p>'
         f'<div class="release-grid">{"".join(cards)}</div>', css)
    return routes
