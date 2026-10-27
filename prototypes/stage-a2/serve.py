"""Serve this isolated POC as / and /games/; never serves the repository root."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--port', type=int, default=8766)
args = parser.parse_args()
handler = partial(SimpleHTTPRequestHandler, directory=str(Path(__file__).resolve().parent))
server = ThreadingHTTPServer(('127.0.0.1', args.port), handler)
print(f'Stage A.2 local POC on port {args.port}; Ctrl+C stops it.', flush=True)
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.server_close()
