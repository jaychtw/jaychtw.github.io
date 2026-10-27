"""Local preview of the production build only; no deployment or source serving."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse, json
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--port',type=int,default=4173)
args=parser.parse_args()
root=Path(__file__).resolve().parents[1]/'dist'
if not (root/'build-info.json').is_file() or json.loads((root/'build-info.json').read_text()).get('name')!='Possibility': parser.error('Run npm run build first.')
class Handler(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
    def send_error(self,code,message=None,explain=None):
        if code==404:
            data=(root/'404.html').read_bytes()
            self.send_response(404);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Content-Length',str(len(data)));self.end_headers()
            if self.command!='HEAD': self.wfile.write(data)
        else: super().send_error(code,message,explain)
server=ThreadingHTTPServer(('127.0.0.1',args.port),partial(Handler,directory=str(root)))
print(f'Production preview: http://localhost:{args.port}/ and http://localhost:{args.port}/games/ (local only)',flush=True)
try: server.serve_forever()
except KeyboardInterrupt: pass
finally: server.server_close()
