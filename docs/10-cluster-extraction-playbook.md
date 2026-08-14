# DOC 10 — CLUSTER EXTRACTION PLAYBOOK

**Version:** 1.0 · 13 August 2026  
**Written by:** Ray (from the NARA run) · filed by the agent  
**Decided by:** Ray — this is the mechanical per-plot units pipeline; Doc 9 covers staging shape and promotion gates  
**Read with:** Doc 9 (what to stage) · Doc 7 (batch format) · this cluster’s `staging.md` / `reference.md`

How to take a folder of developer PDFs for a townhouse cluster and produce a complete, per-plot unit dataset.

Written from the NARA (The Valley, Emaar) run, which resolved **372 of 372 plots** with zero blanks and matched published 3BR/4BR counts exactly. Every rule below is here because it was needed — most of them because something failed first.

**Relationship to Doc 9:** Doc 9 is intake → staging. This playbook is how you build the CSV / master arrays that a townhouse Batch then stages. Output still goes through `docs/clusters/<slug>/staging.md` before promote.

---

## The core idea

Two sources, doing two different jobs:

| Source | Answers |
|---|---|
| **Floorplans PDF** | *What* a layout is, which plex types it appears in, and at which TH position |
| **Cluster map** | *Where* each plot is, and which way each plex faces |

The floorplans give you a **master array per plex type** — an ordered list of layouts, TH01→THn. The cluster map gives you plots grouped into plexes, plus orientation. Lay the array onto the oriented plex and every plot resolves.

Everything else is validation.

---

## Phase 0 — Inventory and triage

```
For each PDF: page count, page size, per-page rotation, text-layer word count,
embedded image count + native pixel dimensions, PDF metadata (dates, Producer, Title)
```

**Check page rotation per page, not per document.** In NARA's floorplans PDF, 13 pages were `rotation=0` with mirrored text and 3 were `rotation=90` with upright text. Assuming one convention silently corrupted three pages and cost several failed passes.

**Check metadata for provenance.** NARA's floorplans PDF was a browser print of a broker mirror, not an Emaar original. That belongs in the provenance record.

**Ask for a high-resolution cluster map before starting.** The brochure page was a 1857×915 raster; a separate "sharp" PDF had the same map at 4032×1987 — 4.7× the pixels — and made the difference between orientation detection failing and working. **Ask early. It changes what's possible.**

---

## Phase 1 — Build the master arrays from the floorplans

### 1.1 Normalise orientation, then read

Don't assume a reading direction. For each page, build the text both ways and pick whichever produces real words:

```python
def flatten(words, mode):
    if mode == 'rot':   # rotated page: reverse each word, order by x then -top
        ws = sorted(words, key=lambda w: (round(w['x0'],1), -w['top']))
        axis, key, txt = 'x0', lambda w: -w['top'], lambda w: w['text'][::-1]
    else:               # upright: order by top then x, no reversal
        ws = sorted(words, key=lambda w: (round(w['top'],1), w['x0']))
        axis, key, txt = 'top', lambda w: w['x0'], lambda w: w['text']
    # group into lines on `axis`, join each line by `key`, concatenate
    ...

mode = max(('rot','fwd'), key=lambda m: sum(
    tok in flatten(words, m) for tok in ('BEDROOM','PLEX','NARA','SQFT')))
```

Scoring on known tokens is self-correcting and needs no per-page configuration.

### 1.2 Read the header and the area block

Each floorplan page carries everything you need as text:

```
C H A R M
3 BEDROOM I A          ← style + bedrooms + variant letter
TOTAL AREA
4 PLEX - TH 02         ← which plex type, which position
2097.67 SQFT 194.88 SQM
```

Regex the flattened text:

```python
style   = next(s for s in ('CHARM','PALMA','ASTON') if s in flat)
variant = re.search(r'([34])BEDROOMI?([A-E])', flat)          # bedrooms + letter
occurs  = re.findall(r'(\d+)PLEX([AB]?)-TH(\d+)(\d{4}\.\d{2})SQFT(\d{3}\.\d{2})SQM', flat)
```

A page may list **many** occurrences — PALMA 3BR-A appeared at 8 different plex positions, each with its own BUA.

### 1.3 Ignore the grey highlights

Key-plan diagrams highlight the position(s) that layout occupies. **This is the same information the area block already gives you in text.** Detecting them is fragile — they're vector `rects` on some pages and `curves` on others, in inconsistent coordinate frames — and it answers nothing new. Skip it.

Use the diagrams for one thing only: confirming **street side is at the bottom and TH01 is leftmost**. Verify that visually once per developer.

### 1.4 Validate before continuing

```
For every plex type: every position 1..N filled, exactly once, no gaps, no duplicates.
Total occurrences = sum of plex sizes.
```

NARA: 6 plex types, 38 positions, complete. If this doesn't close, **stop** — everything downstream inherits the error.

**⚠️ BUA is a property of the plex position, not the layout.** `ASTON 3BR-A` was 187.98 sqm at 5A-TH04 and 194.03 at 10-TH06 — identical room dimensions, 6 sqm apart. Store per-position; a single `bua` per unit type will be wrong.

---

## Phase 2 — Extract plot numbers

**Use the text layer. Never OCR when a text layer exists.**

Plot labels are a distinct font size — find it by histogram, then take every numeric word at that size.

```python
sizes = Counter(round(w['size'],1) for w in words if re.fullmatch(r'\d{1,3}', w['text']))
# NARA: {16.0: 372} — one dominant size, exactly the plot count
```

Some labels render **vertically** (one digit per glyph). If word extraction comes up short, drop to char level and cluster:

```
same baseline & horizontally adjacent → horizontal number
same x & vertically adjacent          → vertical number
```

**Validate:** contiguous `1..N`, no missing, no duplicates. NARA gave 1,008 digit glyphs → 372 numbers, clean.

---

## Phase 3 — Split plots into plexes

Measure the distance between consecutively-numbered plots. The distribution is strongly bimodal — within-plex spacing versus the gap between plexes.

**Find the threshold from the data; don't carry one over between documents.**

```python
gaps = sorted(dist(plot[n], plot[n+1]) for n in range(1, N))
# widest empty band in the plausible range → threshold at its midpoint
```

NARA sharp map: within-plex maxed at 42.0, breaks started at 63.7 — a 21.7pt empty band, threshold 52.9. The same cluster on the low-res brochure needed 22. Scaling a constant between sources will bite you.

### The validation that makes this trustworthy

**Every run must have a size in the allowed set** (from Phase 1's plex types). NARA: 57 runs, all in {4,5,6,8,10}, zero anomalies. Fifty-seven independent splits all landing on legal sizes is not something a wrong threshold produces.

If any run is an illegal size, the threshold is wrong. **Do not hand-adjust individual plexes.**

**Cross-check against a second source if you have one.** NARA's brochure and sharp map produced identical splits, plot-for-plot.

---

## Phase 4 — Orientation

The hardest step, and where two approaches failed before one worked.

### The rule

Key plans are drawn **street side down, TH01 leftmost**. So:

| Street side | Rotation to normalise | TH01 is |
|---|---|---|
| bottom | none | **leftmost** (lowest x) |
| top | 180° | **rightmost** |
| left | 90° CCW | **topmost** (lowest y) |
| right | 90° CW | **bottommost** |

**Derive this by actually rotating a rectangle.** The vertical cases are counter-intuitive — a 90° CCW rotation sends the original *top* edge to the *left*, so a left-facing street puts TH01 at the top. Filling this table by apparent symmetry produces two wrong rows.

### What works: style-fill depth adjacent to the plex

Plot fill (the façade-style colour) runs deep behind the houses and thin in front. Sample perpendicular from the plex centreline on both sides; the side with fill **immediately adjacent** is the back.

```python
def near_score(plex, side):
    # sample offsets ~0.7–1.5× unit pitch, spread along the plex length
    # hit = pixel within RGB distance ~35 of ANY style reference colour
    return max(hit_fraction(offset) for offset in range(24, 57, 4))

back   = side with the higher score
street = the opposite side
```

Take reference colours from the sheet's **own legend swatches**, not hardcoded values.

**This is a boolean test — "is this plot fill" — never "which style".** It reads colour without assigning style, which keeps the key plans as the sole authority for layout.

### Two failure modes, both real

**Counting green pixels to find tree rows: 1 of 5 correct.** Street trees look obvious to a human, but "amount of green" also matches parks and lawns. A landscaped park behind one plex outscored the actual tree-lined street in front (0.647 vs 0.250). Tree rows are *periodic circular canopies*, not green area — if you want to detect them, detect the periodicity.

**A fixed sampling window: 7 of 57 inconclusive.** At 45–78pt the band sometimes landed in the road gap, sometimes on the *neighbouring plex's* fill. Both sides then scored low and near-equal. Sampling **near** the plex and taking the max fixed all seven — worst-case margin went from 0.002 to 0.451.

### Validate

Hand-check 4–5 plexes across all orientations before running the batch. Require a minimum margin; anything below it goes to human review rather than a guess. NARA's final minimum was 0.451, so nothing needed review.

---

## Phase 5 — Assign layouts

Lay the master array onto each oriented plex. Done — **unless the developer has mirror-pair plex types.**

### The mirror problem

NARA had `5 PLEX A` and `5 PLEX B`: same envelope, reversed. Style sequences were exact mirrors (`A,P,P,A,A` vs `A,A,P,P,A`), BUAs matched within 0.08 sqm at every position.

**Consequence:** a five-unit row is a 5A read one way or a 5B read the other. Orientation alone cannot separate them, because both run TH01→TH05.

Under a 5-element reversal, positions 1↔5, 2↔4, and 3 maps to itself. So:

- TH01, TH03, TH05 are **style-invariant** — resolvable from the key plans alone
- TH02 and TH04 **swap** — genuinely ambiguous

In NARA that left 28 of 372 units undecidable. Everything else came from the key plans.

**Silhouette matching does not rescue this.** The 6-plex diagram is nearly symmetric end-to-end (its two end units differ by 0.3 sqm), so shape matching can't resolve orientation there either. Test symmetry before investing in a matcher.

### Per-unit colour classification, for ambiguous positions only

Where the key plans genuinely can't decide, classify the fill behind the individual unit.

```
1. Start at the unit's own plot-label centre
2. Expand ONLY toward the known back direction (from Phase 4)
3. Cap lateral spread at ~±0.4 × unit pitch  → can't cross a party wall
4. Reject pixels: max(RGB) - min(RGB) < 16   → white, grey, black
                  distance to nearest ref > 35 → trees, roads, everything else
5. VOTE: each surviving pixel picks its nearest reference; count votes
6. Stop once you have ~250 qualifying pixels; require winner ≥ 70% and reject below
```

**Vote, never average.** Averaging assumes one colour with noise, but a contaminated sample contains *two*, and their mean is a colour that is neither — which then classifies confidently and wrongly. With voting, contamination shows up as a 60/40 split you can detect and reject. This matters most when two style colours are close: NARA's PALMA and ASTON were only 55 apart in RGB.

**Directional constraint plus lateral cap is what prevents contamination in the first place.** Omnidirectional expansion from a unit sitting between two differently-styled neighbours will pull in both.

### Validate on units you already know

You have a free labelled set: every unit the key plans resolved. Run the classifier on those first.

> NARA: **295 correct, 0 wrong, 7 no-call** out of 302. On the PALMA/ASTON subset — the only pair close enough to fail — **248 correct, 0 wrong.** Mean confidence 0.977.

If it doesn't score clean there, don't apply it to the unknowns.

**Look for an independent invariant too.** Each NARA five-plex had three positions whose style is identical in both 5A and 5B. The classifier called all 42 correctly without being told — confirmation that didn't come from the same reasoning chain.

---

## Phase 6 — Cross-checks before delivery

**Layout counts should be exact multiples of plex-type counts.** CHARM's four layouts each came out at exactly 13 across 13 four-plexes; PALMA 4BR-A/B at 11 each across 11 eight-plexes. Ragged counts mean a misoriented plex. This caught three orientation errors in an earlier NARA pass.

**Compare totals against published marketing figures.** NARA's derived 258 × 3BR and 114 × 4BR matched the developer's published breakdown exactly — a number that depends on both the plex split and the master arrays being right.

**Check the "from / up to" areas.** Published ranges are usually the true min and max of the whole product, split across bedroom rows. NARA's published "from 1,866 sqft" sat against a derived minimum of 1,864.52 — close enough to confirm, different enough to note.

---

## Phase 7 — Media extraction

**Render pages; do not extract embedded rasters.**

In NARA's floorplans, the plan artwork was a shared raster and the **room dimensions were vector text drawn on top**. Two pages returned byte-identical images. Extracting rasters would have produced plans with no dimension labels at all.

```python
page = doc[i].render(scale=7.5).to_pil()      # ≥ native raster resolution
crop = page.crop(image_rect_padded)
if page_rotation == 0: crop = crop.rotate(-90, expand=True)
```

Identify Ground vs First floor by **proximity to the caption text**, not by position. Include a positional fallback — one NARA page had a corrupted caption (`FFIIRRSSTT`) that matched neither label.

**Compare every image source before choosing.** NARA's brochure façade renders had marketing copy burned into the pixels; the same renders appeared clean, and larger, on the cluster map sheet.

---

## Anti-patterns

| Don't | Because |
|---|---|
| Assume one page rotation per document | 3 of 16 NARA pages differed |
| OCR when a text layer exists | Text layer is exact; OCR is not |
| Carry a distance threshold between documents | Scale differs; derive per source |
| Hand-adjust an individual plex to fix a size | The threshold is wrong, not the plex |
| Count green pixels to find streets | Parks outscore streets |
| Use a fixed perpendicular sampling window | Lands in road gaps and on neighbours |
| Average colours | The mean of two styles is a confident wrong answer |
| Detect grey highlights | Redundant with the text, and fragile |
| Build a silhouette matcher before testing symmetry | Symmetric diagrams can't resolve orientation |
| Extract embedded rasters for floorplans | Loses vector text overlays |
| Fill an unknown value with a plausible guess | A wrong value that looks right passes review |

---

## Stopping rules

Stop and ask rather than pushing through when:

- A validation gate fails (illegal plex size, missing plot numbers, incomplete master array)
- An approach fails twice — report what failed and the options, don't try a third variation
- You'd substitute a proxy for the source that was specified
- You need a value you weren't given — check the artifact itself first, then ask

Every one of these was learned the expensive way on NARA.

---

## Output contract

```
data/
  {cluster}-units.csv             one row per plot: style, bedrooms, layout, bua,
                                  plex_range, plex_size, street_side, th_position
  {cluster}-unit-types.csv        one row per layout: counts, BUA min/max, plex types
  {cluster}-plexes.csv            one row per plex: type, street side, TH order, margin
  {cluster}-plex-composition.csv  the master arrays as data
  {cluster}-units-detection.csv   per-plot provenance: style_source, confidence
media/
  floorplans/   one GF+FF composite per layout
  facades/      one clean exterior per style
  maps/         cluster map, context maps
docs/
  extracted-info.md   everything readable from the sources
  gap-analysis.md     what's present, what's missing, what's inferred
```

For Valley Hub, land the CSVs under `docs/clusters/<slug>/floorplans/` (same folder as staged images) and stage the Batch in `docs/clusters/<slug>/staging.md` per Doc 7 / Doc 9. Do not invent columns beyond what `src/types/database.ts` allows — put `style_source` and other provenance in the detection CSV / staging Notes.

**Record provenance per field.** NARA's styles came from two different methods — key plans for 302 units, colour classification for 70. Carry a `style_source` column so the distinction survives into staging.

---

*End of Doc 10. Update when Ray amends the extraction pipeline from a later cluster run.*
