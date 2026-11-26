"""Publish interactive versions of the full-sphere photographs."""
from html import escape
import json
import shutil

from PIL import Image

# The cropped panoramas remain in the still gallery.
SPHERES = {
    1: 'Snow between the trees',
    2: 'Snow over the foothills',
    3: 'Winter reflections',
    4: 'Beside the lake',
    5: 'Long shadow on the shore',
    6: 'An empty paved lot',
    12: 'Lakeside boardwalk',
    13: 'Under the footbridge',
    14: 'An overcast field',
    15: 'Roads under a stormy sky',
    16: 'Across the sandy shore',
    17: 'Shoreline in color',
}


def install_panoramas(root, output, page, css, versioned):
    script = 'panoramas.js'
    shutil.copy2(root / 'assets' / script, output / 'assets' / script)
    media = output / 'assets' / 'media' / 'panoramas'
    media.mkdir()
    scenes = []
    for number, title in SPHERES.items():
        with Image.open(root / 'imgs/design/photography/360' / f'360_{number}.JPG') as image:
            if image.width != image.height * 2:
                raise ValueError(f'Panorama {number} is not a full sphere')
            image.draft('RGB', (4096, 2048))
            image.thumbnail((3072, 1536), Image.Resampling.LANCZOS)
            image.save(media / f'{number}.webp', 'WEBP', quality=83, method=3)
            image.thumbnail((480, 240), Image.Resampling.LANCZOS)
            image.save(media / f'{number}-thumb.webp', 'WEBP', quality=75, method=3)
        scenes.append(dict(id=str(number), title=title, image=f'/assets/media/panoramas/{number}.webp',
                           thumb=f'/assets/media/panoramas/{number}-thumb.webp', group='Photography'))
    additions = json.loads((root / 'data/panorama-additions.json').read_text(encoding='utf-8'))
    for scene in additions:
        for field in ('image', 'thumb'):
            if not (output / scene[field].lstrip('/')).is_file():
                raise ValueError(f'Missing panorama asset {scene[field]}')
    scenes.extend(additions)
    cards = []
    for group in dict.fromkeys(scene['group'] for scene in scenes):
        entries = ''.join(
            f'<li><a data-scene="{scene["id"]}" href="{scene["image"]}">'
            f'<img src="{scene["thumb"]}" alt="" width="480" height="240" loading="lazy" decoding="async">'
            f'<span>{escape(scene["title"])}</span></a></li>'
            for scene in scenes if scene['group'] == group
        )
        cards.append(f'<section><h2>{escape(group)}</h2><ul class="pano-scenes">{entries}</ul></section>')
    first = scenes[0]
    payload = json.dumps(scenes, ensure_ascii=False).replace('<', '\\u003c')
    route = '/art/panoramas/'
    page(output, route, '360° photography',
         f'Look around {len(scenes)} spherical photographs and imagined worlds by 3ichael 7ambert.',
         '<p><a href="/art/">← Art &amp; photography</a></p><h1>360° photography</h1>'
         '<p class="page-intro">Look around winter landscapes and lakeshores, then step into illustrated worlds.</p>'
         '<section class="pano" aria-labelledby="scene-title"><header>'
         f'<h2 id="scene-title">{escape(first["title"])}</h2><a data-pano-flat href="{first["image"]}">Open flat image</a>'
         '<button type="button" data-pano-full aria-haspopup="dialog" hidden>Full screen</button>'
         '<button type="button" data-pano-close hidden>Exit full screen</button>'
         '</header><div class="pano-stage"><img data-pano-poster '
         f'src="{first["thumb"]}" alt="{escape(first["title"])}" width="480" height="240">'
         '<canvas hidden tabindex="0" aria-label="360 degree panorama. Use arrow keys to look around." '
         'aria-describedby="pano-help"></canvas>'
         '<button type="button" class="button" data-pano-open hidden>Look around</button></div>'
         '<p id="pano-help" data-pano-help hidden>Drag or use the arrow keys to look around.</p>'
         '<div class="pano-controls" role="group" aria-label="Panorama controls" hidden>'
         '<button type="button" data-view="left">Look left</button><button type="button" data-view="right">Look right</button>'
         '<button type="button" data-view="up">Look up</button><button type="button" data-view="down">Look down</button>'
         '<button type="button" data-view="in">Zoom in</button><button type="button" data-view="out">Zoom out</button>'
         '<button type="button" data-view="reset">Reset view</button></div>'
         '<p data-pano-status role="status"></p>'
         '<nav class="pano-route" aria-label="Switch panorama" hidden>'
         '<button type="button" data-pano-step="-1">← Previous</button>'
         '<span data-pano-count aria-live="polite"></span>'
         '<button type="button" data-pano-step="1">Next →</button></nav></section>'
         '<dialog class="pano-dialog" aria-labelledby="scene-title"></dialog>'
         + ''.join(cards) +
         f'<script type="application/json" id="panorama-data">{payload}</script>'
         f'<script defer src="{versioned(output, script)}"></script>', css, image=first['thumb'])
    return route
