"""Verify a deployed (or explicitly local) build against every reviewed file."""
from pathlib import Path
from urllib.request import urlopen
from urllib.parse import urlparse, urljoin
from hashlib import sha256
import argparse, json, time
root=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--url',default=json.loads((root/'content/site.json').read_text())['canonicalOrigin']+'/')
parser.add_argument('--local',action='store_true')
args=parser.parse_args();target=urlparse(args.url)
if args.local:
    assert target.scheme=='http' and target.hostname in ['localhost','127.0.0.1'], 'Local mode only permits loopback HTTP'
else:
    assert target.scheme=='https' and target.netloc==urlparse(json.loads((root/'content/site.json').read_text())['canonicalOrigin']).netloc
expected_commit=json.loads((root/'dist/build-info.json').read_text())['sourceCommit']
if not args.local:
    # Deployment can precede CDN propagation. Wait only for the exact approved
    # build identity, then verify every file normally; never accept a stale site.
    for attempt in range(41):
        try:
            with urlopen(urljoin(args.url,'build-info.json'),timeout=20) as r: remote=json.load(r)
            if remote.get('sourceCommit')==expected_commit and remote.get('sourceDirty') is False: break
        except Exception as error:
            if attempt==40: raise error
        if attempt==40: raise AssertionError('Approved build did not reach the public CDN')
        time.sleep(3)
files=sorted(p for p in (root/'dist').rglob('*') if p.is_file() and not p.name.startswith('.'))
assert files, 'Build the reviewed commit first'
results=[]
for p in files:
    route=p.relative_to(root/'dist').as_posix()
    url=urljoin(args.url,route)
    with urlopen(url,timeout=40) as response:
        data=response.read();assert response.status==200
    assert sha256(data).digest()==sha256(p.read_bytes()).digest(), 'Public content differs from reviewed build: '+route
    results.append({'path':route,'sha256':sha256(data).hexdigest()})
output={'url':args.url,'local':args.local,'sourceCommit':json.loads((root/'dist/build-info.json').read_text())['sourceCommit'],'files':results}
(root/'.artifacts').mkdir(exist_ok=True)
(root/'.artifacts/published-integrity.json').write_text(json.dumps(output,indent=2)+'\n')
print('Local' if args.local else 'Public','build integrity passed:',len(results),'files. TLS verification is unchanged.')
