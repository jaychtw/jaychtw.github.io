"""Read-only, TLS-verified release/asset requests; never deploys or changes a game."""
from datetime import datetime, timezone
from hashlib import sha256
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit
from urllib.request import Request, urlopen
import json

root = Path(__file__).resolve().parents[1]
evidence = root / '.artifacts'
evidence.mkdir(parents=True, exist_ok=True)
class Assets(HTMLParser):
    def __init__(self): super().__init__(); self.paths = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'script' and attrs.get('src'): self.paths.append(attrs['src'])
        if tag == 'link' and attrs.get('href') and attrs.get('rel') in ['stylesheet', 'modulepreload']: self.paths.append(attrs['href'])

def fetch(url):
    with urlopen(Request(url, headers={'User-Agent':'Possibility-Stage-A2-Read-Only'}), timeout=40) as response:
        return response.status, response.url, response.read(), response.headers.get('Content-Type')

results = {'checkedAt': datetime.now(timezone.utc).isoformat(), 'method':'Python urllib HTTPS with default system CA/TLS verification; not a live-browser gameplay run.', 'projects':[]}
for item in json.loads((root/'content/projects.json').read_text()):
    if item['status'] != 'published': continue
    status, final, content, mime = fetch(item['destination']['url'])
    assert status == 200 and final == item['destination']['url'] and b'<html' in content.lower()
    parser = Assets(); parser.feed(content.decode())
    is_game=item['category']=='games' and item['destination']['action']=='play'
    if is_game: assert parser.paths, 'No runtime resources in public game'
    else: parser.paths=[]
    game = {'id':item['id'],'url':final,'status':status,'htmlSha256':sha256(content).hexdigest(),'assets':[]}
    for path in sorted(set(parser.paths)):
        url = urljoin(final, path)
        assert urlsplit(url).scheme == 'https' and urlsplit(url).hostname == urlsplit(final).hostname
        code, resolved, data, kind = fetch(url)
        assert code == 200 and len(data)>0 and 'text/html' not in (kind or ''), (url,kind)
        game['assets'].append({'url':resolved,'status':code,'bytes':len(data),'sha256':sha256(data).hexdigest()})
    if item['id']=='squirrel-control':
        code, resolved, data, kind = fetch(urljoin(final,'release.json'))
        game['releaseManifest']=json.loads(data)
        declared=game['releaseManifest']['javascript']
        matching=next(a for a in game['assets'] if a['url']==urljoin(final,declared['path']))
        assert matching['sha256']==declared['sha256'], 'Published JavaScript does not match release manifest'
        game['releaseManifestHashMatched']=True
    results['projects'].append(game)
    print(item['title'],status,len(game['assets']),'runtime assets passed')
status, final, content, mime = fetch('https://jaychtw.github.io/')
results['existingRoot']={'url':final,'status':status,'sha256':sha256(content).hexdigest(),'placeholderPresent':b'Portal of jaychtw' in content,'scope':'Current public root, read only; this verifier does not deploy or modify it.'}
# Host-settings inspection is an operator preflight, not a public-link check.
# Public Pages configuration APIs can require authentication; CI needs no extra token.
if '--inspect-host' in __import__('sys').argv:
    status, final, content, mime = fetch('https://api.github.com/repos/jaychtw/jaychtw.github.io/pages')
    config = json.loads(content)
    results['pagesSettings']={key:config.get(key) for key in ['status','cname','html_url','build_type','source','https_enforced']}
(evidence/'live-links.json').write_text(json.dumps(results,indent=2)+'\n')

assert results['projects'], 'No verified published work: release is incomplete'
if '--record' in __import__('sys').argv:
    records=[{'id':g['id'],'url':g['url'],'finalUrl':g['url'],'status':g['status'],'checkedAt':results['checkedAt'],'method':results['method']} for g in results['projects']]
    (root/'content/link-verification.json').write_text(json.dumps(records,indent=2)+'\n')
