#!/usr/bin/env python3
"""Post-build verification: run `npm run build` first, then `python3 scripts/verify.py`.

Checks _site for: broken internal href/src refs, invalid JSON-LD, em dashes,
banned honesty phrases, and steel imagery missing its FSS credit.
Exits non-zero if anything fails.
"""
import json
import pathlib
import re
import sys

site = pathlib.Path(__file__).resolve().parent.parent / "_site"
if not site.exists():
    sys.exit("no _site/ - run `npm run build` first")

pages = [p for p in site.rglob("*.html") if "admin" not in str(p)]
problems = []

attr_re = re.compile(r'(?:href|src)="(/[^"#?]*)')
ld_re = re.compile(r'<script type="application/ld\+json">(.*?)</script>', re.S)
# "family owned"/"family-owned" banned: owner bought the 1970 business ~2023.
# "Ian" banned per phase-1 honesty rules. Em dashes banned site-wide (CLAUDE.md).
banned = [r"—", r"[Ff]amily[ -]owned", r"\bIan\b", r"unprecedented", r"seamless",
          r"results-driven", r"nestled", r"state-of-the-art", r"isn't just"]

for p in pages:
    rel = p.relative_to(site)
    txt = p.read_text(encoding="utf8", errors="replace")

    for url in attr_re.findall(txt):
        t = site / url.lstrip("/")
        if not (t.exists() or (t / "index.html").exists()):
            problems.append(f"broken ref {url} in {rel}")

    for block in ld_re.findall(txt):
        try:
            json.loads(block)
        except Exception as e:
            problems.append(f"bad JSON-LD in {rel}: {e}")

    body = re.sub(r"<script.*?</script>|<style.*?</style>", "", txt, flags=re.S)
    for pat in banned:
        if re.search(pat, body):
            problems.append(f"banned pattern {pat!r} in {rel}")

    if "/images/steel/" in txt and "Federal Steel Systems" not in txt:
        problems.append(f"steel image without FSS credit in {rel}")

print(f"{len(pages)} pages checked")
if problems:
    print("\n".join(sorted(set(problems))))
    sys.exit(1)
print("verify: clean")
