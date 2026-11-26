"""Publish the interactive gallery of paired images and depth maps."""
from html import escape
import json
import shutil


def install_depth(root, output, page, css, versioned):
    filename = 'depth-gallery.js'
    shutil.copy2(root / 'assets' / filename, output / 'assets' / filename)
    scenes = json.loads((root / 'data/depth-gallery.json').read_text(encoding='utf-8'))
    for scene in scenes:
        for field in ('image', 'depth', 'thumb'):
            if not (output / scene[field].lstrip('/')).is_file():
                raise ValueError(f'Missing depth gallery asset {scene[field]}')
    first = scenes[0]
    cards = ''.join(
        f'<li><a data-depth-id="{scene["id"]}" href="{scene["image"]}"><img src="{scene["thumb"]}"'
        f' loading="lazy" decoding="async" alt=""><span>{escape(scene["title"])}</span></a></li>'
        for scene in scenes
    )
    payload = json.dumps(scenes, ensure_ascii=False).replace('<', '\\u003c')
    route = '/art/depth/'
    page(output, route, '3D & depth photography',
         'Explore still images with interactive depth from the 3D photography and illustration archive of 3ichael 7ambert.',
         '<p><a href="/art/">← Art &amp; photography</a></p><h1>3D &amp; depth</h1>'
         '<p class="page-intro">Move your mouse or drag across an image to see its layers shift. On a supported phone, enable tilt to look around.</p>'
         '<section class="depth-gallery" aria-labelledby="depth-title">'
         f'<header><h2 id="depth-title">{escape(first["title"])}</h2><a data-depth-flat href="{first["image"]}">Open still image</a>'
         '<button type="button" data-depth-full aria-haspopup="dialog" hidden>Full screen</button>'
         '<button type="button" data-depth-close hidden>Exit full screen</button></header>'
         f'<div class="depth-viewport"><div class="depth-stage" style="--depth-ratio:{first["width"] / first["height"]:.6f}">'
         f'<img src="{first["image"]}" width="{first["width"]}" height="{first["height"]}" alt="{escape(first["alt"], quote=True)}">'
         '<canvas aria-label="Interactive depth image" hidden></canvas></div></div>'
         '<div class="depth-controls" hidden><button type="button" data-depth-toggle aria-pressed="false">Enable depth</button>'
         '<button type="button" data-depth-tilt aria-pressed="false" hidden>Enable tilt</button>'
         '<label>View angle <input type="range" min="-100" max="100" value="0" disabled></label></div>'
         '<p data-depth-status role="status"></p>'
         '<nav class="depth-route" aria-label="Switch depth image" hidden>'
         '<button type="button" data-depth-step="-1">← Previous</button><span data-depth-count aria-live="polite"></span>'
         '<button type="button" data-depth-step="1">Next →</button></nav></section>'
         '<dialog class="pano-dialog depth-dialog" aria-labelledby="depth-title"></dialog>'
         f'<ul class="pano-scenes" aria-label="Choose a depth image">{cards}</ul>'
         '<p><a href="/art/panoramas/">Explore the 360° collection →</a></p>'
         f'<script type="application/json" id="depth-data">{payload}</script>'
         f'<script defer src="{versioned(output, filename)}"></script>', css, image=first['thumb'])
    return route
