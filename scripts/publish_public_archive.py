"""Restore the artwork and photographs from the site's earlier public galleries."""
from hashlib import sha256
import json
import re

from PIL import Image, ImageOps


MEDIA_TYPES = {
    '360': ('Little planets & panoramas', '360° photograph'),
    'planets': ('Little planets & panoramas', 'Little planet'),
    'photography': ('Photography', 'Photograph'),
    'illustrations': ('Illustration', 'Illustration'),
    'inktober': ('Ink & graphite', 'Inktober drawing'),
    'art': ('Sculpture & models', 'Model study'),
    'fanart': ('Illustration', 'Fan art'),
    'graphite': ('Ink & graphite', 'Graphite study'),
    'ink': ('Ink & graphite', 'Ink drawing'),
    'paint': ('Painting & mixed media', 'Painting'),
    'portraits': ('Illustration', 'Portrait'),
    'urban': ('Digital & urban', 'Urban illustration'),
    'vector': ('Graphic design', 'Vector illustration'),
}
SUFFIXES = {'.jpeg', '.jpg', '.png', '.webp'}


def restore_public_archive(root, output, deployed_gallery):
    existing = {work.get('source') for work in deployed_gallery}
    selected = ['gallery.json', 'gallery-archive.json']
    for filename in selected:
        prior = json.loads((root / 'data' / filename).read_text(encoding='utf-8'))
        existing.update(work.get('source') for work in prior)
    seen = set()
    items = []
    for original in sorted((root / 'imgs/design').rglob('*')):
        relative = original.relative_to(root).as_posix()
        if original.suffix.lower() not in SUFFIXES or relative in existing:
            continue
        bucket = original.parent.name
        if bucket not in MEDIA_TYPES:
            continue
        digest = sha256(original.read_bytes()).hexdigest()[:20]
        if digest in seen:
            continue
        seen.add(digest)
        category, label = MEDIA_TYPES[bucket]
        name = original.stem
        number = re.fullmatch(r'(?:[a-z_ ]+|360[_ -])([0-9]{1,3})', name, re.IGNORECASE)
        title = f'{label} {int(number[1])}' if number else label
        with Image.open(original) as source:
            source.draft('RGB', (1500, 1500))
            asset = ImageOps.exif_transpose(source)
            mode = 'RGBA' if 'A' in asset.getbands() or 'transparency' in asset.info else 'RGB'
            asset = asset.convert(mode)
            asset.thumbnail((1400, 1400))
        large = f'/assets/media/portfolio/public-{digest}.webp'
        thumb = f'/assets/media/portfolio/public-{digest}-tile.webp'
        file = output / large.lstrip('/')
        file.parent.mkdir(exist_ok=True)
        asset.save(file, 'WEBP', quality=79, method=3)
        width, height = asset.size
        asset.thumbnail((360, 360))
        asset.save(output / thumb.lstrip('/'), 'WEBP', quality=74, method=3)
        items.append(dict(title=title, alt=title, category=category, collection='Original website portfolio',
                          thumb=thumb, large=large, width=width, height=height))
    return items
