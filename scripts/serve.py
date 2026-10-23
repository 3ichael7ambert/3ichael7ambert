"""Local static preview; accepts the managed preview supervisor's flags."""
import argparse
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--host', default='127.0.0.1')
parser.add_argument('--port', type=int, default=4173)
parser.add_argument('--strictPort', action='store_true')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
ThreadingHTTPServer((args.host, args.port), partial(SimpleHTTPRequestHandler, directory=str(root))).serve_forever()
