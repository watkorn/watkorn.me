#!/usr/bin/env python3
"""Rebuild brand/lab.html from brand/yeti.svg + brand/palettes.json.

Run from the repo root:  python3 brand/build_lab.py
"""
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent
svg = (ROOT / "yeti.svg").read_text()
palettes = json.loads((ROOT / "palettes.json").read_text())

# layer order and paths come straight from the master SVG
paths = re.findall(r'<path style="fill:var\(--yeti-([a-z-]+),[^)]*\)" d="([^"]+)"', svg)
data = {"paths": {name: d for name, d in paths}, "palettes": palettes["palettes"]}

template = (ROOT / "lab.template.html").read_text()
(ROOT / "lab.html").write_text(template.replace("__DATA__", json.dumps(data)))
print(f"brand/lab.html written ({len(paths)} layers, {len(data['palettes'])} palettes)")
