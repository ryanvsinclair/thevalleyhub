#!/usr/bin/env python3
"""Orania Doc 10 Phases 4–5: orientation, style vote, master-array laydown."""

from __future__ import annotations

import colorsys
import csv
import json
import math
from collections import Counter, defaultdict
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
OUT = Path(__file__).resolve().parent
im = Image.open(OUT / "orania-cluster-map-page.png").convert("RGB")
W, H = im.size
arr = np.asarray(im).astype(np.float32)

plots = {
    int(k): v
    for k, v in json.loads((OUT / "_phase2_plots.json").read_text())["plots"].items()
}
plexes = [
    (p["start"], p["end"], p["size"])
    for p in json.loads((OUT / "_phase3_plexes.json").read_text())["plexes"]
]
layouts = json.loads((OUT / "_phase1_layouts.json").read_text())["layouts"]

arrays: dict[str, dict[int, dict[int, dict]]] = defaultdict(lambda: defaultdict(dict))
for lay in layouts:
    style = lay["facade_style"]
    for occ in lay["occurrences"]:
        psz, th, bua = int(occ[0]), int(occ[1]), float(occ[2])
        arrays[style][psz][th] = {
            "bedrooms": lay["bedrooms"],
            "label": lay["label"],
            "layout": lay["layout"],
            "bua": bua,
            "bathrooms": lay["bathrooms"],
            "maids_room": lay["maids_room"],
            "ground_floor_bedroom": lay["ground_floor_bedroom"],
        }


def sample_disk(x: float, y: float, r: int = 8) -> np.ndarray | None:
    x0, x1 = max(0, int(x - r)), min(W, int(x + r + 1))
    y0, y1 = max(0, int(y - r)), min(H, int(y + r + 1))
    patch = arr[y0:y1, x0:x1]
    if patch.size == 0:
        return None
    return patch.reshape(-1, 3).mean(axis=0)


def rgb_to_hsv(rgb) -> tuple[float, float, float]:
    r, g, b = [float(c) / 255 for c in rgb]
    return colorsys.rgb_to_hsv(r, g, b)


def is_style_like(rgb) -> bool:
    h, s, v = rgb_to_hsv(rgb)
    if v < 0.35 or v > 0.97:
        return False
    if s < 0.12:
        return False
    if 0.20 < h < 0.45 and s > 0.18:
        return False
    return True


# Map plot-fill references (legend dots sit on cream paper and read poorly;
# ring samples around known tan vs pink rows are stable).
# Seeded from plexes 1–10 (tan) and 11–20 (pink) after visual check.
styles: dict[str, np.ndarray] = {
    "bold": np.array([231.0, 194.0, 174.0], dtype=np.float32),
    "sleek": np.array([218.0, 100.0, 112.0], dtype=np.float32),
}
print("styles", {k: v.tolist() for k, v in styles.items()})


def classify_rgb(rgb) -> tuple[str | None, float, float]:
    db = float(np.linalg.norm(rgb - styles["bold"]))
    ds = float(np.linalg.norm(rgb - styles["sleek"]))
    if abs(db - ds) < 12:
        return None, db, ds
    return ("bold" if db < ds else "sleek"), db, ds


def plex_axis(s: int, e: int):
    pts = np.array([[plots[n]["x"], plots[n]["y"]] for n in range(s, e + 1)])
    v = pts[-1] - pts[0]
    nrm = float(np.linalg.norm(v))
    if nrm < 1e-6:
        v = np.array([1.0, 0.0])
        nrm = 1.0
    tang = v / nrm
    perp = np.array([-tang[1], tang[0]])
    return pts, tang, perp


def near_score(s: int, e: int, side_sign: int, pitch: float) -> float:
    pts, tang, perp = plex_axis(s, e)
    hits = 0
    total = 0
    for t in np.linspace(0.1, 0.9, max(3, e - s + 1)):
        base = pts[0] + t * (pts[-1] - pts[0])
        for mul in (0.55, 0.85, 1.15, 1.45):
            x = base[0] + side_sign * mul * pitch * perp[0]
            y = base[1] + side_sign * mul * pitch * perp[1]
            rgb = sample_disk(x, y, r=6)
            total += 1
            if rgb is None:
                continue
            if (
                min(
                    float(np.linalg.norm(rgb - styles["bold"])),
                    float(np.linalg.norm(rgb - styles["sleek"])),
                )
                < 55
            ):
                hits += 1
    return hits / max(total, 1)


# North arrow tip points top-right on this page render.
NORTH = np.array([0.707, -0.707])
DIRS = {
    "N": NORTH,
    "S": -NORTH,
    "E": np.array([0.707, 0.707]),
    "W": np.array([-0.707, -0.707]),
}

results = []
for s, e, sz in plexes:
    pts, tang, perp = plex_axis(s, e)
    pitch = float(
        np.median(
            [
                math.hypot(
                    plots[n]["x"] - plots[n + 1]["x"], plots[n]["y"] - plots[n + 1]["y"]
                )
                for n in range(s, e)
            ]
        )
    )
    votes: list[str] = []
    unit_styles: dict[int, tuple[str | None, float, int]] = {}
    for n in range(s, e + 1):
        p = plots[n]
        samples: list[str] = []
        for mul in (0.6, 0.9, 1.2):
            for sign in (+1, -1):
                x = p["x"] + sign * mul * pitch * perp[0]
                y = p["y"] + sign * mul * pitch * perp[1]
                for lat in (-0.15, 0.0, 0.15):
                    xx = x + lat * pitch * tang[0]
                    yy = y + lat * pitch * tang[1]
                    rgb = sample_disk(xx, yy, r=5)
                    if rgb is None or not is_style_like(rgb):
                        continue
                    lab, _, _ = classify_rgb(rgb)
                    if lab:
                        samples.append(lab)
        if samples:
            lab, cnt = Counter(samples).most_common(1)[0]
            conf = cnt / len(samples)
            unit_styles[n] = (lab, conf, len(samples))
            votes.append(lab)
        else:
            unit_styles[n] = (None, 0.0, 0)

    plex_style = Counter(votes).most_common(1)[0][0] if votes else None
    vote_frac = (Counter(votes)[plex_style] / len(votes)) if votes else 0.0

    sc_pos = near_score(s, e, +1, pitch)
    sc_neg = near_score(s, e, -1, pitch)
    if sc_pos >= sc_neg:
        back_sign = +1
        margin = sc_pos - sc_neg
    else:
        back_sign = -1
        margin = sc_neg - sc_pos
    street_vec = -back_sign * perp
    best_dir = max(
        DIRS,
        key=lambda k: float(
            np.dot(street_vec, DIRS[k])
            / (np.linalg.norm(street_vec) * np.linalg.norm(DIRS[k]) + 1e-9)
        ),
    )
    results.append(
        {
            "start": s,
            "end": e,
            "size": sz,
            "style": plex_style,
            "vote_frac": vote_frac,
            "street_side": best_dir,
            "margin": margin,
            "sc_pos": sc_pos,
            "sc_neg": sc_neg,
            "pitch": pitch,
            "unit_styles": unit_styles,
            "street_vec": street_vec.tolist(),
            "back_sign": back_sign,
        }
    )

print("plex styles", Counter(r["style"] for r in results))
print("street sides", Counter(r["street_side"] for r in results))
print(
    "low margin <0.08",
    [
        (r["start"], r["end"], round(r["margin"], 3), r["street_side"])
        for r in results
        if r["margin"] < 0.08
    ],
)
print(
    "style vote weak <0.7",
    [
        (r["start"], r["end"], r["style"], round(r["vote_frac"], 2))
        for r in results
        if r["vote_frac"] < 0.7
    ],
)

# Visual: colour plexes by style
vis = im.copy()
draw = ImageDraw.Draw(vis)
for r in results:
    col = (210, 160, 90) if r["style"] == "bold" else (200, 90, 120)
    pts = [(plots[n]["x"], plots[n]["y"]) for n in range(r["start"], r["end"] + 1)]
    if len(pts) >= 2:
        draw.line(pts, fill=col, width=4)
    # arrow toward street
    mid = np.mean(pts, axis=0)
    sv = np.array(r["street_vec"])
    sv = sv / (np.linalg.norm(sv) + 1e-9) * 40
    draw.line(
        [tuple(mid), (mid[0] + sv[0], mid[1] + sv[1])],
        fill=(0, 0, 255),
        width=2,
    )
    draw.text((mid[0], mid[1] - 12), f"{r['start']}-{r['end']} {r['street_side']}", fill=(0, 0, 0))
vis.save(OUT / "_visual_check/phase4-orientation.png")

# Phase 5 — lay master arrays.
# TH01 is the end with lower plot number when numbering runs with the street on
# a consistent hand. Doc 10: for single-row townhouses without mirror pairs,
# TH order follows plot number order within the plex (ascending = TH01→THn)
# unless orientation requires flip. Orania has mirrored A/B and C/D pairs in
# the arrays already as distinct TH positions — no 5A/5B mirror-pair types.
# Use ascending plot numbers = TH01..THn (same as Elora/Nara default when
# street_side does not imply a reverse). Hand-check: 1-10 Bold 10-plex ends
# are gray 4BR — matches TH01/TH10.

units = []
detection = []
for r in results:
    style = r["style"]
    if style is None:
        raise SystemExit(f"no style for plex {r['start']}-{r['end']}")
    arr_map = arrays[style][r["size"]]
    for i, n in enumerate(range(r["start"], r["end"] + 1)):
        th = i + 1
        meta = arr_map[th]
        units.append(
            {
                "plot_number": n,
                "unit_number": n,
                "facade_style": style,
                "bedrooms": meta["bedrooms"],
                "layout": meta["layout"],
                "label": meta["label"],
                "bua": meta["bua"],
                "bathrooms": meta["bathrooms"],
                "maids_room": meta["maids_room"],
                "ground_floor_bedroom": meta["ground_floor_bedroom"],
                "plex_range": f"{r['start']}-{r['end']}",
                "plex_size": r["size"],
                "street_side": r["street_side"],
                "th_position": th,
                "orientation_margin": round(r["margin"], 4),
                "style_vote_frac": round(r["vote_frac"], 4),
            }
        )
        u_lab, u_conf, u_n = r["unit_styles"][n]
        detection.append(
            {
                "plot_number": n,
                "plex_range": f"{r['start']}-{r['end']}",
                "plex_style": style,
                "unit_style_vote": u_lab,
                "unit_style_conf": round(u_conf, 4),
                "unit_style_samples": u_n,
                "style_source": "colour_vote_plex",
                "street_side": r["street_side"],
                "orientation_margin": round(r["margin"], 4),
                "plot_source": plots[n].get("source"),
            }
        )

beds = Counter(u["bedrooms"] for u in units)
styles_c = Counter(u["facade_style"] for u in units)
layout_c = Counter((u["facade_style"], u["bedrooms"], u["layout"]) for u in units)
print("units", len(units), "beds", dict(beds), "styles", dict(styles_c))
print("layout counts:")
for k in sorted(layout_c):
    print(" ", k, layout_c[k])

# Gate: 236 / 72
assert len(units) == 308
assert beds[3] == 236 and beds[4] == 72, beds

# Layout counts should be multiples of plex-type counts for that style
plex_by_style_size = Counter((r["style"], r["size"]) for r in results)
print("plex_by_style_size", dict(plex_by_style_size))

with (OUT / "orania-units.csv").open("w", newline="") as f:
    w = csv.DictWriter(
        f,
        fieldnames=[
            "plot_number",
            "unit_number",
            "facade_style",
            "bedrooms",
            "layout",
            "label",
            "bua",
            "bathrooms",
            "maids_room",
            "ground_floor_bedroom",
            "plex_range",
            "plex_size",
            "street_side",
            "th_position",
            "orientation_margin",
            "style_vote_frac",
        ],
    )
    w.writeheader()
    w.writerows(units)

with (OUT / "orania-units-detection.csv").open("w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(detection[0].keys()))
    w.writeheader()
    w.writerows(detection)

with (OUT / "orania-plexes.csv").open("w", newline="") as f:
    w = csv.DictWriter(
        f,
        fieldnames=[
            "range_start",
            "range_end",
            "plex_size",
            "street_side",
            "facade_style",
            "vote_frac",
            "orientation_margin",
        ],
    )
    w.writeheader()
    for r in results:
        w.writerow(
            {
                "range_start": r["start"],
                "range_end": r["end"],
                "plex_size": r["size"],
                "street_side": r["street_side"],
                "facade_style": r["style"],
                "vote_frac": round(r["vote_frac"], 4),
                "orientation_margin": round(r["margin"], 4),
            }
        )

# composition CSV
with (OUT / "orania-plex-composition.csv").open("w", newline="") as f:
    w = csv.DictWriter(
        f,
        fieldnames=["facade_style", "plex_size", "th_position", "layout", "bedrooms", "bua"],
    )
    w.writeheader()
    for style in sorted(arrays):
        for psz in sorted(arrays[style]):
            for th in range(1, psz + 1):
                m = arrays[style][psz][th]
                w.writerow(
                    {
                        "facade_style": style,
                        "plex_size": psz,
                        "th_position": th,
                        "layout": m["layout"],
                        "bedrooms": m["bedrooms"],
                        "bua": m["bua"],
                    }
                )

summary = {
    "units": len(units),
    "beds": dict(beds),
    "styles": dict(styles_c),
    "plexes": len(results),
    "plex_sizes": dict(Counter(r["size"] for r in results)),
    "plex_by_style_size": {f"{a}-{b}": c for (a, b), c in plex_by_style_size.items()},
    "street_sides": dict(Counter(r["street_side"] for r in results)),
    "min_orientation_margin": min(r["margin"] for r in results),
    "min_style_vote_frac": min(r["vote_frac"] for r in results),
    "layout_counts": {f"{a}-{b}-{c}": n for (a, b, c), n in layout_c.items()},
}
(OUT / "_phase5_summary.json").write_text(json.dumps(summary, indent=2))
(OUT / "_phase4_orientation.json").write_text(
    json.dumps([{k: v for k, v in r.items() if k != "unit_styles"} for r in results], indent=2)
)
print("OK", summary)
