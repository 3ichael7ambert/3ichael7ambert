"""Refresh public metadata, cache small covers, audit links, then rebuild static HTML.

python scripts/update_catalog.py --refresh --assets --check
No credentials, browser scraping, auto-commits, or deletion of curated entries.
"""
import argparse, json, re, io, urllib.request, urllib.parse, urllib.error
from pathlib import Path
from datetime import datetime, timezone
from concurrent.futures import ThreadPoolExecutor
from bs4 import BeautifulSoup
from PIL import Image, ImageOps

ROOT=Path(__file__).resolve().parents[1]
UA='3ichael7ambert-PortfolioUpdater/1.0 (+https://3ichael7ambert.com)'

def fetch(url, limit=3_000_000):
    parsed=urllib.parse.urlparse(url)
    if parsed.scheme!='https' or not parsed.hostname or parsed.hostname in {'localhost','127.0.0.1','::1'}:
        raise ValueError('Only public HTTPS source URLs are accepted')
    req=urllib.request.Request(url,headers={'User-Agent':UA})
    with urllib.request.urlopen(req,timeout=15) as r:
        body=r.read(limit+1)
        if len(body)>limit:raise ValueError('Response exceeds size budget')
        return body,r.geturl(),r.status

def metadata(url):
    body,final,status=fetch(url)
    soup=BeautifulSoup(body,'html.parser')
    def meta(name):
        tag=soup.find('meta',property=name) or soup.find('meta',attrs={'name':name})
        return tag.get('content','') if tag else ''
    return {'url':url,'final_url':final,'status':status,'title':meta('og:title') or (soup.title.get_text(strip=True) if soup.title else ''),'image':meta('og:image'),'description':meta('og:description') or meta('description')}

def refresh():
    """Fetch BOTH catalogs; preserve the old snapshot on partial/empty failures."""
    results=[]
    for url in ['https://drunkyeti.itch.io/','https://3ichael7ambert.itch.io/']:
        body,_,_=fetch(url)
        soup=BeautifulSoup(body,'html.parser'); found=[]
        for cell in soup.select('.game_cell'):
            a=cell.select_one('.game_title a') or cell.select_one('a.title')
            if not a:continue
            link=urllib.parse.urljoin(url,a.get('href',''))
            if urllib.parse.urlparse(link).hostname!=urllib.parse.urlparse(url).hostname:continue
            text=a.get_text(' ',strip=True);desc=cell.select_one('.game_text')
            # Only classify an explicit keyword; mixed downloads are not called games.
            low=text.lower()
            kind='Soundtrack' if 'soundtrack' in low else 'Tools & assets' if any(w in low for w in ['maker','generator','asset','pack','mod','forge','brush','soundfont']) else 'Project'
            found.append({'title':text,'url':link,'description':desc.get_text(' ',strip=True)[:220] if desc else '', 'category':kind,'source':url})
        if not found:raise ValueError(f'No catalog cells parsed from {url}; existing snapshot preserved')
        results.extend(found)
    result={'checked_at':datetime.now(timezone.utc).isoformat(),'items':list({x['url']:x for x in results}.values())}
    (ROOT/'data/discovered.json').write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n')
    print(f'Refreshed {len(result["items"])} public projects.')

def cache_image(url,name):
    body,_,_=fetch(url,8_000_000)
    with Image.open(io.BytesIO(body)) as im:
        im=ImageOps.exif_transpose(im).convert('RGB'); im.thumbnail((900,900))
        dest=ROOT/'assets/sources'/f'{name}.jpg';dest.parent.mkdir(parents=True,exist_ok=True)
        im.save(dest,'JPEG',quality=86,optimize=True)
        return str(dest.relative_to(ROOT))

def assets():
    books=json.loads((ROOT/'data/books.json').read_text())
    featured=json.loads((ROOT/'data/featured.json').read_text())
    jobs=[(b,b['id'],b['links'][0]['url']) for b in books]+[(x,f'{group}-{i}',x['url']) for group,items in featured.items() for i,x in enumerate(items) if group in ['games','music']]
    reports=[]
    for item,name,url in jobs:
        if item.get('image_local') and (ROOT/item['image_local']).is_file():continue
        try:
            image_url=item.get('image_source')
            if not image_url:
                info=metadata(url);image_url=info['image']
            if not image_url:raise ValueError('No publisher cover image supplied')
            item['image_local']=cache_image(image_url,name)
            reports.append({'id':name,'status':'cached'})
        except Exception as e: reports.append({'id':name,'status':'unavailable','detail':str(e)[:160]})
    (ROOT/'data/books.json').write_text(json.dumps(books,indent=2,ensure_ascii=False)+'\n')
    (ROOT/'data/featured.json').write_text(json.dumps(featured,indent=2,ensure_ascii=False)+'\n')
    (ROOT/'docs/asset-fetch-report.json').write_text(json.dumps(reports,indent=2)+'\n')
    print('Covers:',sum(r['status']=='cached' for r in reports),'cached;',sum(r['status']=='unavailable' for r in reports),'unavailable.')

def redact_results(results):
    """Keep diagnostic statuses without republishing document or recipient IDs."""
    for row in results:
        host=urllib.parse.urlparse(row['url']).hostname or ''
        if host in {'docs.google.com','drive.google.com'} or 'badgr' in host:
            row['url']='[redacted document or credential link]'
            row['host']=host
            row.pop('final_url',None)
            row.pop('note',None)
    return results

def check():
    soup=BeautifulSoup((ROOT/'index.html').read_text(),'html.parser')
    urls=sorted({a['href'] for a in soup.select('a[href]') if a['href'].startswith('https://')})
    def one(url):
        try:
            _,final,status=fetch(url,5_000_000)
            return {'url':url,'status':status,'final_url':final}
        except urllib.error.HTTPError as e:return {'url':url,'status':e.code,'note':'Blocked/unverified' if e.code in [401,403,429] else 'Needs review'}
        except Exception as e:return {'url':url,'status':'unverified','note':str(e)[:140]}
    with ThreadPoolExecutor(max_workers=3) as pool:results=list(pool.map(one,urls))
    (ROOT/'docs/link-check.json').write_text(json.dumps({'checked_at':datetime.now(timezone.utc).isoformat(),'results':redact_results(results)},indent=2)+'\n')
    print(f'Checked {len(urls)} public URLs; results in docs/link-check.json. Non-200 responses do not prove a link is dead.')

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    for name in ['refresh','assets','check']:parser.add_argument('--'+name,action='store_true')
    args=parser.parse_args();(ROOT/'docs').mkdir(exist_ok=True)
    if args.refresh:
        try:refresh()
        except Exception as e:print('Catalog refresh skipped:',e)
    if args.assets:assets()
    from optimize_images import main as optimize
    from build_site import main as build
    optimize();build()
    if args.check:check()

if __name__=='__main__':main()
