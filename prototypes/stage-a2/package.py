"""Make a standalone review bundle; no build or deployment action."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib, json
root = Path(__file__).resolve().parent
output = root.parents[1] / 'docs/stage-a2'
target = output / 'Possibility-Stage-A2.zip'
paths = ['index.html','style.css','site.js','catalog.json','games/index.html','games/gallery.js','serve.py']
paths += [str(p.relative_to(root)) for p in sorted((root/'assets').glob('*.webp'))]
start = '''# Possibility — Stage A.2 review POC

This is a local art-direction prototype, not a released portal. No install or build is needed to run it. Use Python 3, or `py` on Windows.

1. Extract this entire ZIP.
2. In the extracted Possibility-Stage-A2 folder, run: python3 serve.py
3. In your local browser, open the server on port 8766.
4. Compare /?light=diffuse&pattern=drift and /?light=window&pattern=drift.
5. Use Explore, or open /games/?light=window&pattern=cadence to compare the other gallery pattern.
6. Observe the background for 30–60 seconds. Motion periods are 80/120/160 seconds. Enable your OS/browser Reduce Motion setting and reload for a static scene.
7. Stop the server with Ctrl+C. Use --port 8767 if port 8766 is occupied.

The title, exact email link, and Explore are the landing’s only functional text. All four gallery works use local authentic gameplay crops and canonical game destinations. Gallery links leave this local POC for existing public games. There are no fake projects, trackers, API keys, remote visual services or deployment scripts.

Window light + Drift is recommended for review, not approved. Stage B, portal deployment and other-repository changes remain separate approval decisions. Screenshot origins and crop/checksum records are in asset-provenance.json. No new license is assigned to project art. Original repository screenshot files referenced in that provenance document are not required at runtime.
'''
with ZipFile(target,'w',ZIP_DEFLATED) as archive:
    archive.writestr('Possibility-Stage-A2/START-HERE.md',start)
    archive.write(output/'asset-provenance.json','Possibility-Stage-A2/asset-provenance.json')
    for path in paths: archive.write(root/path,'Possibility-Stage-A2/'+path)
    assert archive.testzip() is None
info={'file':target.name,'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'runtimeFiles':paths,'scope':'Standalone local review only; no dependencies or deployment scripts.'}
(output/'evidence/bundle-manifest.json').write_text(json.dumps(info,indent=2)+'\n')
print(json.dumps(info,indent=2))
