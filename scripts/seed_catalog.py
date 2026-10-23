"""One-time migration of the original site. Run only against the original index."""
from pathlib import Path
import json
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
soup = BeautifulSoup((ROOT/'index.html').read_text(), 'html.parser')
data = ROOT/'data'; data.mkdir(exist_ok=True)
if (data/'legacy-inventory.json').exists():
    raise SystemExit('Already migrated; refusing to overwrite the original inventory.')
inventory = {}
for ident in ['education','resume','certificates','software','games','music','design','book','clothing']:
    sec=soup.find(id=ident)
    inventory[ident]={'text':sec.get_text(' ',strip=True), 'links':[{'label':a.get_text(' ',strip=True),'url':a['href']} for a in sec.select('a[href]')], 'media':[dict(e.attrs) for e in sec.select('iframe,img')]}
(data/'legacy-inventory.json').write_text(json.dumps(inventory,indent=2,ensure_ascii=False)+'\n')
books=[]
for card in soup.select('#book .book-series'):
    title=card.select_one('.book-title')
    if not title or any(b['title']==title.get_text(strip=True) for b in books):continue
    desc=card.select_one('.book-description')
    links=[{'label':a.get_text(' ',strip=True),'url':a['href'].split(';jsessionid')[0]} for a in card.select('.buy-links a')]
    books.append({'id':f'book-{len(books)}','title':title.get_text(strip=True),'category':'Children' if 'Curly' in title.text else 'Memoir' if '37:' in title.text else 'Poetry','description':desc.get_text(' ',strip=True).removeprefix('EFrom').strip() if desc else '', 'links':links[:3]})
for card in soup.select('#book .book-grid > div'):
    im=card.find('img'); a=card.find('a'); texts=list(card.stripped_strings)
    if not im or not a:continue
    title=texts[0]
    match=next((b for b in books if b['title']==title),None)
    if match:
        match['image_source']=im['src']; match['links'].append({'label':'Publisher shop','url':a['href']});continue
    books.append({'id':f'book-{len(books)}','title':title,'category':'Photography' if 'Photography' in title else 'Art' if any(w in title for w in ['Art','Portrait']) else 'Poetry','description':'A visual collection by Michael Andrew Lambert Jr.' if any(w in title for w in ['Photography','Art','Portrait']) else 'From the writing of Michael Andrew Lambert Jr.','image_source':im['src'],'links':[{'label':'Publisher shop','url':a['href']}]})
(data/'books.json').write_text(json.dumps(books,indent=2,ensure_ascii=False)+'\n')
career={}
for ident in ['education','resume','certificates','software']:
    sec=soup.find(id=ident)
    for el in sec.select('iframe,script,img,style'):el.decompose()
    for el in sec.select('[style]'):del el['style']
    for el in sec.select('[onclick]'):del el['onclick']
    # Keep the underlying resume/certificate text and working links available.
    for a in sec.select('a[href]'):
        if a['href'].startswith('https:/www.'):a['href']=a['href'].replace('https:/','https://',1)
        if a['href']=='windy-trousers.surge.sh':a['href']='https://windy-trousers.surge.sh'
        if a['href']=='#' or 'dashboard.render.com' in a['href']:a.unwrap()
        else:a.attrs={'href':a['href']}
    for el in sec.find_all():
        if el.name!='a':el.attrs={}
    career[ident]=''.join(str(x) for x in sec.contents)
(data/'career.json').write_text(json.dumps(career,indent=2,ensure_ascii=False)+'\n')
print(f'Migrated {len(books)} books and {len(inventory)} sections.')
