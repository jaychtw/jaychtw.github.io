"""Make the revision-2 local review bundle; never builds or deploys a public site."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib, json
root = Path(__file__).resolve().parent
output = root.parents[1] / 'docs/stage-a2/revision-2'
target = output / 'Possibility-Stage-A2-Revision-2.zip'
paths = ['index.html','style.css','site.js','catalog.json','games/index.html','games/gallery.js','serve.py']
paths += [str(p.relative_to(root)) for p in sorted((root/'assets').glob('*.webp'))]
start = '''# Possibility — Stage A.2 revision 2

Local interactive art-direction prototype only. No installation or build is needed to run it; use Python 3 (`py` on Windows).

1. Extract the entire ZIP.
2. In the extracted Possibility-Stage-A2-Revision-2 folder, run: python3 serve.py
3. Open http://localhost:8766/ in your local browser. The first full-viewport section is the living sunlight scene. Scroll normally to discover the white portfolio below it; no click or scroll snapping is required.
4. Open http://localhost:8766/games/ for the direct portfolio. Its wordmark returns to the landing.
5. Watch the normal animation for 20–30 seconds: broad window edges gently distort, the shadow drifts, and the illumination fluctuates slowly. The title never animates.
6. Enable OS/browser Reduce Motion and reload for a stable still scene; ordinary scrolling continues to work.
7. Stop with Ctrl+C. If port 8766 is occupied, run python3 serve.py --port 8767 and replace 8766 in the URLs.

Optional comparisons:
http://localhost:8766/?light=diffuse&pattern=drift
http://localhost:8766/?light=window&pattern=cadence
http://localhost:8766/games/?pattern=cadence

Default: Window light + Drift. The only landing text is Possibility and jay.yc.chen@gmail.com. A small static downward arrow is an optional accessible in-page shortcut, not a navigation requirement. The white portfolio contains only four genuine square gameplay screenshots and their linked titles. No invented work, descriptions, menus, controls, external visual services, API keys or deployment scripts.

Asset origins/crop/checksum records are in asset-provenance.json. The original source images are not required to run the ZIP. Gallery links leave this local prototype for independently hosted public games.

Visual approval is pending. This is not full Stage B, release approval, or permission to deploy the site or modify another repository.
'''
with ZipFile(target,'w',ZIP_DEFLATED) as archive:
    archive.writestr('Possibility-Stage-A2-Revision-2/START-HERE.md', start)
    archive.write(output.parent/'asset-provenance.json','Possibility-Stage-A2-Revision-2/asset-provenance.json')
    for name in paths: archive.write(root/name,'Possibility-Stage-A2-Revision-2/'+name)
    assert archive.testzip() is None
info={'file':target.name,'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'runtimeFiles':paths,'scope':'Local revision-2 review only; no dependencies or deployment scripts.'}
(output/'evidence/bundle-manifest.json').write_text(json.dumps(info,indent=2)+'\n')
print(json.dumps(info,indent=2))
