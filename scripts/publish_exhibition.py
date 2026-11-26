"""Build an illustrated route through the public portfolio."""
from html import escape

STOPS = (
    ('portraiture', 'The drawn face', 'graphite-1600.webp',
     'Graphite portrait with swept dark hair and expressive shading',
     'A portrait begins with a few lines. Here, the dark sweep of the hair and the lighter marks under the eyes give the face its expression.',
     '/art/?q=portrait#archive', 'Explore more portraits', 'center 37%'),
    ('close-up', 'At the smallest scale', 'pink-flower-1600.webp',
     'Pink petals and a yellow center seen in close-up',
     'At this distance the flower is mostly color, texture, and light. Look for the same attention to small details in the botanical and animal photographs.',
     '/art/?medium=Photography#archive', 'Browse photography', 'center'),
    ('panoramas', 'Inside the landscape', 'panoramas/3-thumb.webp',
     'Snow and blue sky reflected in water across a wide panorama',
     'Step from the close-up into a winter landscape. Drag the panorama to find where the shoreline, sky, and reflections meet.',
     '/art/panoramas/?view=3', 'Enter the 360° photograph', 'center'),
    ('moving-image', 'A world in motion', 'micro-world-1600.webp',
     'Illustrated miniature ecosystem with curved plants and organic forms',
     'A world can start as a drawing, a model, or a single frame. The motion collection takes those ideas into stop motion, cinematic scenes, and 360° animation.',
     '/art/motion/#animation', 'Watch the motion collection', 'center'),
    ('imagined-worlds', 'From character to world', 'urban-colour-1600.webp',
     'A blue-skinned character with bright pink hair and green clothing',
     'Character sheets, sketches, and settings are part of the same process. Follow them into the original characters, books, and playable worlds.',
     '/worlds/', 'Explore characters and worlds', 'center 40%'),
    ('wearable-art', 'Beyond the frame', 'cherry-shirt-1600.webp',
     'All-over cherry blossom print on a shirt',
     'On fabric, a design turns with the body and continues across sleeves and seams. These Alieno Apparel pieces take color and pattern into everyday use.',
     '/art/?medium=Apparel#archive', 'Browse wearable art', 'center'),
)
ROOT = '/explore/visual-journey/'


def stop_url(slug):
    return f'{ROOT}{slug}/'


def install_exhibition(output, page, css):
    links = ''.join(
        f'<li><a href="{stop_url(slug)}"><img src="/assets/media/{image}" alt="" loading="lazy" decoding="async">'
        f'<span>{escape(title)}</span></a></li>'
        for slug, title, image, *_ in STOPS
    )
    opener = '/assets/media/graphite-1600.webp'
    page(output, ROOT, 'A journey through the work',
         'Explore six chapters across portraiture, photography, animation and design by 3ichael 7ambert.',
         '<div class="exhibit-intro"><div><p><a href="/explore/">← All tours</a></p>'
         '<h1>A journey through the work</h1><p class="page-intro">Follow a drawing from a face on paper to a world '
         'you can step into. Along the way, look closer at a photograph, enter a 360° landscape, and see how the work moves.</p>'
         f'<a class="button" href="{stop_url(STOPS[0][0])}">Start with portraiture →</a></div>'
         f'<img src="{opener}" alt="{escape(STOPS[0][3])}" decoding="async"></div>'
         f'<ol class="exhibit-index" aria-label="Exhibition chapters">{links}</ol>', css, image=opener)
    routes = [ROOT]
    for i, (slug, title, image, alt, text, target, action, position) in enumerate(STOPS):
        path = stop_url(slug)
        media = f'/assets/media/{image}'
        if not (output / media.lstrip('/')).is_file():
            raise ValueError(f'Missing exhibition artwork: {media}')
        previous = ROOT if i == 0 else stop_url(STOPS[i - 1][0])
        next_step = '/art/#archive' if i == len(STOPS) - 1 else stop_url(STOPS[i + 1][0])
        back_label = '← All chapters' if i == 0 else '← ' + STOPS[i - 1][1]
        forward_label = 'Browse the archive →' if i == len(STOPS) - 1 else STOPS[i + 1][1] + ' →'
        page(output, path, title, text,
             f'<nav class="exhibit-progress" aria-label="Exhibition progress"><a href="{ROOT}">All chapters</a>'
             f'<span>Chapter {i + 1} of {len(STOPS)}</span></nav>'
             f'<div class="exhibit-feature"><img src="{media}" alt="{escape(alt, quote=True)}" '
             f'style="object-position:{position}" decoding="async"><div><h1>{escape(title)}</h1>'
             f'<p class="page-intro">{escape(text)}</p><a class="button" href="{escape(target, quote=True)}">'
             f'{escape(action)} ↗</a></div></div>'
             f'<nav class="page-turn exhibit-turn" aria-label="Exhibition chapters"><a href="{previous}">'
             f'{escape(back_label)}</a><a href="{next_step}">{escape(forward_label)}</a></nav>',
             css, image=media)
        routes.append(path)
    return routes
