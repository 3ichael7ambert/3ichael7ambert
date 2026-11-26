"""Package runtime assets only; originals and authoring data stay in Git."""
from pathlib import Path
import shutil
from publish_reader_media import install_reader_media

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'dist'
# This exact directory contains only reproducible build output.
if OUT.is_symlink(): raise SystemExit('Refusing a symlinked output directory')
if OUT.exists(): shutil.rmtree(OUT)
OUT.mkdir(exist_ok=True)
for item in ('index.html', 'CNAME', 'assets/site.css', 'assets/site.js',
             'assets/theme-init.js', 'assets/desk.js', 'files/vcard.vcf'):
    destination = OUT / item
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(ROOT / item, destination)
shutil.copytree(ROOT / 'assets/media', OUT / 'assets/media', dirs_exist_ok=True)
install_reader_media(ROOT, OUT)

TRACKER = '''<script>
(() => {
  const tracker = document.createElement('script');
  tracker.src = 'https://tracker.metricool.com/resources/be.js';
  tracker.async = true;
  tracker.addEventListener('load', () => {
    window.beTracker.t({ hash: '96608b6f6112badf8313c252be90bc31' });
  }, { once: true });
  document.head.appendChild(tracker);
})();
</script>'''
for page in sorted(OUT.rglob('*.html')):
    markup = page.read_text(encoding='utf-8')
    if '</head>' not in markup:
        raise ValueError(f'Missing head element in {page.relative_to(OUT)}')
    page.write_text(markup.replace('</head>', TRACKER + '\n</head>', 1), encoding='utf-8')

(OUT / '.nojekyll').touch()
print(f'Packaged {sum(p.stat().st_size for p in OUT.rglob("*") if p.is_file()):,} bytes into dist/')
