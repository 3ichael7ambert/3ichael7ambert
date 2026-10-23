"""Generate bounded web derivatives. Originals remain untouched and versioned."""
from pathlib import Path
import json, hashlib
from PIL import Image, ImageOps

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/media'
def optimize(source, name, sizes=(480,1600)):
    path=ROOT/source
    if not path.is_file(): return None
    OUT.mkdir(parents=True,exist_ok=True)
    with Image.open(path) as original:
        im=ImageOps.exif_transpose(original)
        if name in ('pencil','tear'):
            im=im.convert('RGBA')
        elif 'A' in im.getbands():
            background=Image.new('RGBA',im.size,(247,245,238,255));background.alpha_composite(im.convert('RGBA'));im=background.convert('RGB')
        else: im=im.convert('RGB')
        result={'width':im.width,'height':im.height,'source_bytes':path.stat().st_size}
        for size in sizes:
            dest=OUT/f'{name}-{size}.webp'
            thumb=im.copy();thumb.thumbnail((size,size),Image.Resampling.LANCZOS)
            thumb.save(dest,'WEBP',quality=80 if size>500 else 76,method=6)
            result[str(size)]=str(dest.relative_to(ROOT))
        result['web_bytes']=sum((ROOT/result[str(s)]).stat().st_size for s in sizes)
        return result

def main():
    manifest={}
    gallery=json.loads((ROOT/'data/gallery.json').read_text())
    for item in gallery:
        manifest[item['id']]=optimize(item['source'],item['id'])
    extras={'portrait':'imgs/MLambertJr.png','identity':'imgs/3ichael7ambert.JPG','paper':'imgs/sketchbook/lined-paper.png','tear':'imgs/sketchbook/PaperTear.png','pencil':'imgs/UI/pencil.png','alieno':'imgs/alieno.png'}
    for name,source in extras.items():
        manifest[name]=optimize(source,name,(960,) if name=='paper' else (480,))
    for group,items in json.loads((ROOT/'data/featured.json').read_text()).items():
        for i,item in enumerate(items):
            source=item.get('image_local')
            if source and (ROOT/source).is_file():manifest[f'{group}-{i}']=optimize(source,f'{group}-{i}',(640,))
    for b in json.loads((ROOT/'data/books.json').read_text()):
        if b.get('image_local'):manifest[b['id']]=optimize(b['image_local'],b['id'],(480,))
    (ROOT/'data/media.json').write_text(json.dumps(manifest,indent=2)+'\n')
    print(f'{len(manifest)} assets; {sum(x["source_bytes"] for x in manifest.values() if x):,} source bytes -> {sum(x["web_bytes"] for x in manifest.values() if x):,} web bytes')

if __name__=='__main__':main()
