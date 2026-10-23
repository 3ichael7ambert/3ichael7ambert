"""One-time editorial migration, based on linked publisher/retailer listings."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
p=ROOT/'data/books.json';books=json.loads(p.read_text())
fixes={
'book-0':('Children','A little caterpillar faces first-day-of-school nerves, with a moonlit adventure and a new friend.'),
'book-1':('Memoir','A personal account of family, resilience, creativity, and the search for belonging.'),
'book-2':('Poetry','Poetry and reflection from the Memorandum in a Cruet collection.'),
'book-3':('Photography','Seattle seen through the Plastic Photography series.'),
'book-4':('Poetry','The deluxe edition of the Memorandum in a Cruet collection.'),
'book-5':('Art','Drawing studies and illustrations from the 2023 Inktober project.'),
'book-6':('Art','A collection of work from the Inktober 2023 project.'),
'book-7':('Art','An exploration of the female figure through ink and drawn line.'),
'book-9':('Photography','Photographic transformations from the In My Own World collection.'),
'book-10':('Music','Sheet music from Spread Love Like Wildfire.')}
for b in books:
    if b['id'] in fixes:b['category'],b['description']=fixes[b['id']]
    if b['id']=='book-7':b['title']='Portraitography: Ink’d Artistry'
    if b['id']=='book-10':b['title']='Spread Love Like Wildfire: Sheet Music'
    if b['id']=='book-0':b['links'].sort(key=lambda x:x['label']!='Barnes & Noble')
    if b['id']=='book-2':b['links']=[x for x in b['links'] if x['label']!='Google Play']
new=[
('portraitography-2026','Portraitography: Drawn in Many Ways','Art','Portraits and figure studies across graphite, ink, paint, and digital color.','https://books.apple.com/us/book/portraitography/id6822920533'),
('artist-statement','The Artwork of 3ichael 7ambert: Artist Statement','Art','A reflective look at nearly two decades of work across traditional, digital, and interactive media.','https://books.apple.com/us/book/the-artwork-of-3ichael-7ambert/id6822090618'),
('deadsexymikey','DeadSexyMikey: 1,001 Faces','Memoir','A personal story of changing identities, creative life, and reinvention.','https://books.apple.com/us/book/deadsexymikey/id6822102297'),
('three-esses','The Three Esses','Memoir','Childhood friendship in Aurora, and the distance and changes that follow.','https://books.apple.com/us/book/the-three-esses/id6822088361'),
('49-states','49 States & 18 Wheels','Memoir','A book by Michael Andrew Lambert, available through Apple Books.','https://books.apple.com/us/book/49-states-18-wheels/id6821455670')]
add=[{'id':i,'title':t,'category':c,'description':d,'links':[{'label':'Apple Books','url':u}]} for i,t,c,d,u in new if not any(b['id']==i for b in books)]
p.write_text(json.dumps(add+books,indent=2,ensure_ascii=False)+'\n')
print('Catalog:',len(add+books),'editions')
