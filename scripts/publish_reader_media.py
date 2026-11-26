"""Package only the book and gallery update into the generated site."""
from pathlib import PurePosixPath
from zipfile import ZipFile
import json
import re
import shutil


def install_reader_media(root, output):
    for bundle in sorted((root / 'data/media-bundles').glob('*.zip')):
        with ZipFile(bundle) as archive:
            for image in archive.infolist():
                path = PurePosixPath(image.filename)
                allowed = path.is_relative_to('reader/pages') or path.is_relative_to('assets/media')
                if not allowed or '..' in path.parts or path.suffix != '.webp':
                    raise ValueError(f'Unexpected archive entry {image.filename!r}')
                archive.extract(image, output)

    for name in ('index.html', 'reader.js', 'reader.css', 'editions.json'):
        shutil.copy2(root / 'reader' / name, output / 'reader' / name)
    editions = json.loads((output / 'reader/editions.json').read_text())
    for edition in editions:
        pages = output / 'reader/pages' / edition['id']
        for page in range(1, edition['pages'] + 1):
            if not (pages / f'{page}.webp').is_file():
                raise ValueError(f'Missing reader page {edition["id"]}/{page}')

    homepage = output / 'index.html'
    html = homepage.read_text()
    for area in ('design', 'book'):
        fragment = (root / f'data/{area}-section.html').read_text().strip()
        pattern = rf'<section\b[^>]*\bid="{area}"[^>]*>.*?</section>'
        html, matches = re.subn(pattern, lambda _: fragment, html, flags=re.S)
        if matches != 1:
            raise ValueError(f'Expected one section named {area}')
        for asset in re.findall(r'assets/media/[a-zA-Z0-9._-]+\.webp', fragment):
            if not (output / asset).is_file():
                raise ValueError(f'Missing gallery or book image {asset}')

    payload = (root / 'data/gallery-payload.html').read_text().strip()
    html, matches = re.subn(r'<script\b[^>]*\bid="gallery-data"[^>]*>.*?</script>',
                            lambda _: payload, html, flags=re.S)
    if matches != 1:
        raise ValueError('Expected one gallery data element')
    for asset in re.findall(r'assets/media/[a-zA-Z0-9._-]+\.webp', payload):
        if not (output / asset).is_file():
            raise ValueError(f'Missing gallery image {asset}')
    homepage.write_text(html)
