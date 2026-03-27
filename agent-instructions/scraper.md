# Scraper & Filter Data Pipeline

## Overview

`apps/scraper/` is a standalone Node.js CLI (`@lumo/scraper`) that scrapes a German automotive encyclopedia, stores raw data, and produces a typed TypeScript module consumed by `apps/web/` at build time.

```
apps/scraper/
├── src/
│   ├── cli.ts                        # Entry point — registers all CLI commands
│   ├── types.ts                      # Shared types: Make, Model, Generation, OutputTree, PageData*, TechSheet
│   ├── lib/
│   │   ├── paths.ts                  # PATHS constants — single source of truth for all default I/O paths
│   │   ├── save-to-file.ts           # writeFile wrapper that mkdir -p's the dir
│   │   ├── get-browser.ts            # Puppeteer browser init with stealth plugin
│   │   ├── get-app-metadata.ts       # Reads package.json name/version
│   │   └── create-json-array-writer.ts / create-output-aggregator.ts
│   ├── utils/
│   │   ├── slugify.ts                # Diacritic-safe URL slug (used as entity IDs)
│   │   └── get-path-from-url.ts
│   ├── generated/
│   │   └── filter-data.ts            # AUTO-GENERATED — do not edit; compiled by tsdown
│   └── features/
│       ├── scraper/                  # Scrapes make/model/generation hierarchy
│       ├── tech-sheets-scraper/      # Scrapes per-generation technical data sheets
│       ├── filter-builder/           # Parses tech sheets → typed filter data module
│       │   └── lib/
│       │       ├── types.ts          # FilterDataGenerated, EngineTrim, FuelTypeId, TransmissionId
│       │       ├── translations.ts   # DE→PL maps + LOCALE const
│       │       ├── derive-fuel-type.ts
│       │       ├── build-filter-data.ts   # Core logic — returns FilterDataGenerated
│       │       ├── serialize-to-ts.ts     # Serializes data to a typed .ts module string
│       │       └── index.ts          # Public SDK barrel
│       └── pipeline/                 # Orchestrates all steps end-to-end
└── out/
    ├── data.json                     # Vehicle catalog (~735 KB)
    └── tech-sheets/                  # ~8,400+ JSON files (one per variant)
```

## Default Paths — `src/lib/paths.ts`

All commands share these constants. Override via CLI flags.

```ts
export const PATHS = {
  catalogOutput:    'out/data.json',
  techSheetsDir:    'out/tech-sheets',
  filterDataOutput: 'src/generated/filter-data.ts',
} as const
```

---

## CLI Commands

Run with `pnpm start:dev <command>` (tsx) or `pnpm start <command>` (compiled).

| Command | Flags | Default output | Purpose |
|---------|-------|----------------|---------|
| `scrape` | `-o` | `out/data.json` | Scrape make→model→generation hierarchy |
| `scrape-tech-sheets` | `-i`, `-o` | `out/tech-sheets/` | Scrape 461-field spec sheets per variant |
| `build-filter-data` | `-c`, `-t`, `-o` | `src/generated/filter-data.ts` | Parse tech sheets → typed TS module |
| `generate` | `-c`, `-t`, `-o`, `--skip-catalog`, `--skip-tech-sheets` | all of the above | Full pipeline in one command |

### `generate` — pipeline command

Chains all three steps. Useful flags:

```bash
# Full pipeline (scrape catalog + tech sheets + build filter data)
pnpm start:dev generate

# Just rebuild filter data from existing scraped files
pnpm start:dev generate --skip-catalog --skip-tech-sheets

# Custom output path
pnpm start:dev generate --output path/to/filter-data.ts
```

---

## Feature: `scraper`

Puppeteer-based scraper targeting `https://www.auto-motor-und-sport.de/marken-modelle/`.

Extracts JSON from `#__NEXT_DATA__` script tags (Next.js server data). Three levels:

1. **Makes** — from `brandtree.overview` → `allBrands[]`
2. **Models** — from `brandtree.listSeries`
3. **Generations** — from `brandtree.listGenerationsBySeriesOverview`

Each entity gets an `id` (slugified name), `sourceId` (from URL path), and `name`. Generations also have `production.start/end` and optional `type` (e.g. `"G60, G61"`).

### Output: `out/data.json`

```json
[
  {
    "make": { "id": "bmw", "sourceId": "bmw", "name": "BMW" },
    "models": [
      {
        "id": "5er", "sourceId": "5er", "name": "5er",
        "generations": [
          {
            "id": "g60-g61", "sourceId": "g60-g61",
            "name": "5er", "type": "G60, G61",
            "production": { "start": 2023, "end": null }
          }
        ]
      }
    ]
  }
]
```

**Key type:** `OutputTree[]` (from `src/types.ts`)

---

## Feature: `tech-sheets-scraper`

For each generation in `data.json`, scrapes the tech data tab of that generation's page. Each result is a `TechSheet` object (defined in `src/features/tech-sheets-scraper/lib/scrape-tech-sheets.ts`):

```ts
interface TechSheet {
  data: Record<string, unknown>   // 461 German-named fields
  metadata: {
    id: string                    // slug: "bmw-520d"
    sourceIds: {
      make: string                // "bmw"
      model: string               // "5er"       ← matches generation.sourceId, NOT id
      generation: string          // "g60-g61"   ← matches generation.sourceId, NOT id
    }
    createdAt: string
  }
}
```

One generation produces **multiple** tech sheets (one per engine variant): `bmw-520d.json`, `bmw-520d-touring.json`, `bmw-520d-xdrive.json`, etc.

### Critical: sourceId vs id mismatch

Tech sheet `metadata.sourceIds.*` stores the **sourceId** (URL slug), not the catalog `id`. For most entities these are identical, but for generations they can differ:

| Catalog field | Alfa Romeo 155 example |
|---|---|
| `generation.id` | `"1"` |
| `generation.sourceId` | `"1-generation"` |
| `techSheet.metadata.sourceIds.generation` | `"1-generation"` ← uses sourceId |

The filter-builder indexes the catalog by `make.sourceId:model.sourceId:gen.sourceId` and looks up entries via `metadata.sourceIds` directly. Never match by `id` — always use `sourceId`.

### Key `data` fields

Fields actually used by the filter-builder (out of ~461 total):

| German field | Used for | Notes |
|---|---|---|
| `HerstellerNameJATO` | Make display name | Full name (`"Mercedes-Benz"`, `"Volkswagen"`); only populated for a subset of cars — propagated across all sheets of that make via Pass 1 |
| `Modell_Name` | Engine trim name | Primary trim dedup key |
| `Hubraum` | Displacement (cm³) | `0` for pure electric |
| `Ps` | Power (HP) | |
| `Antriebstyp_ID` | Fuel type derivation | 1=petrol/hybrid · 2=diesel · 3=electric |
| `ReichweiteReinElektrisch` | Hybrid detection | >0 when `Antriebstyp_ID=1` means plug-in hybrid |
| `Karobauart` | Body type | German string mapped in `translations.ts` |
| `Getriebe` | Transmission | `"manuell"` / `"automatisch"` substring match |
| `BaujahrJATO` | Production start year | `"MM/YYYY"` format; only in JATO-populated sheets — catalog fallback used otherwise |
| `BauendeJATO` | Production end year | Same format; `null` → still in production |
| `Schadstoffklasse` | Age filter | Empty = pre-Euro era → sheet is skipped |
| `TypBezeichnungGeneration` | Generation name (priority 3) | Fallback when catalog has no usable name/type |
| `GenerationNummerJATO` | Generation name (priority 4) | Last resort → `"Gen. N"` |

Fields **not** used for structural names/IDs (kept for reference only):
- `Marke_Name` — short alias (`"VW"`, `"Mercedes"`); display name comes from JATO propagation instead
- `Baureihe_Name` / `BaureiheNameJATO` — varies between sheets for the same model; catalog name used instead
- `TypBezeichnungJATO` — only populated for some VW sheets; catalog `gen.type` is more complete

---

## Feature: `filter-builder`

Combines catalog + tech sheets into a typed TypeScript module.

### `build-filter-data.ts` — core logic

Accepts `{ techSheetsDir, catalogPath }`. Returns `FilterDataGenerated`.

#### Step 1 — Load catalog

Reads `catalogPath` (`out/data.json`) and indexes every generation into a `Map<string, CatalogEntry>` keyed by `make_sourceId:model_sourceId:gen_sourceId`. The catalog is the **single authoritative source** for structural names and IDs (make, model, generation). Tech sheet text fields (`BaureiheNameJATO`, `Baureihe_Name`, etc.) are intentionally not used for names or IDs because they vary between sheets and create duplicates (e.g. `"5er"` vs `"5er Reihe"` for the same model).

#### Step 2 — Pass 1: propagate full make names

Scans all tech sheets cheaply for `HerstellerNameJATO`. This JATO field gives the **full brand name** (`"Mercedes-Benz"`, `"Volkswagen"`) when populated, typically for newer cars. The result is a `Map<catalogMakeSourceId, fullBrandName>` that covers all makes where at least one sheet has a JATO name. This propagates the full name to *all* sheets of that make, including older ones where the field is empty.

#### Step 3 — Pass 2: full processing

For each tech sheet:

1. Parse **both** `sheet.metadata` and `sheet.data` (metadata carries the catalog link)
2. Look up catalog entry via `metadata.sourceIds` (`make:model:generation` key)
3. **Skip** if no catalog entry — logs `[WARN]`
4. **Age filter** — skip if `Schadstoffklasse` is empty/missing. Pre-Euro-era vehicles have no emissions standard; its absence is a data-driven signal that the car predates standardised measurements. No year constant is hardcoded.
5. **Make name** — `HerstellerNameJATO` (current sheet) → propagated JATO name (Pass 1 map) → catalog make name
6. **Model name** — `catalogEntry.modelName` (always from catalog — prevents variation-driven duplicates)
7. **Generation display name** — see *Generation naming* below
8. **IDs** — `makeId = slugify(makeName)`, `modelId = slugify(catalogEntry.modelSourceId)`, `genId = slugify(catalogEntry.genSourceId)`. Model and gen IDs are derived from the catalog's canonical sourceId slugs, not from text fields.
9. **Production years** — `BaujahrJATO`/`BauendeJATO` (JATO `"MM/YYYY"` format) → fallback to `catalogEntry.production`
10. Extract engine trim: `Modell_Name`, `Hubraum`, `Ps`, `Antriebstyp_ID`, `ReichweiteReinElektrisch`
11. Extract body type (`Karobauart`) and transmission (`Getriebe`)

After the loop: deduplicate engine trims by `Modell_Name` within each generation (first occurrence wins), sort makes alphabetically, apply translations.

### Generation naming

The catalog's `generation.name` and `generation.type` fields are the primary sources. Priority:

| Priority | Source | Example |
|---|---|---|
| 1 | `catalogGen.name` **when it differs from the model name** | VW: `"Passat B8"`, `"Golf VII"` |
| 2 | `catalogGen.type` | BMW: `"G60, G61"` · Mercedes: `"W221, V221"` |
| 3 | `TypBezeichnungGeneration` from tech sheet | any remaining gaps |
| 4 | `"Gen. N"` from `GenerationNummerJATO` | single-generation niche models |

**Why this works per brand:**
- **VW** — the catalog stores the marketing designation in `gen.name` (`"Passat B8"`, `"Golf VII"`). Its `gen.type` holds internal codes (`"Typ 3G"`, `"AU"`) which are *not* shown.
- **BMW / Mercedes** — `gen.name` repeats the model name (`"5er"`, `"S-Klasse"`), so priority 1 is skipped and `gen.type` is used (`"G60, G61"`, `"W221, V221"`).
- **Single-generation models** — no type designation; falls back to `"Gen. 1"`.

### Make ID stability

Make IDs are derived from the resolved display name, **not** from the catalog make sourceId. This preserves the existing IDs consumers depend on:

| Catalog `make.sourceId` | Resolved display name | Make ID in output |
|---|---|---|
| `"mercedes"` | `"Mercedes-Benz"` | `"mercedes-benz"` |
| `"vw"` | `"Volkswagen"` | `"volkswagen"` |
| `"bmw"` | `"BMW"` | `"bmw"` |

### `serialize-to-ts.ts`

Converts `FilterDataGenerated` → a `.ts` module string:

```ts
// Auto-generated by build-filter-data. Do not edit manually.
import type { FilterDataGenerated } from '../features/filter-builder/lib/types'

export const filterData = { ... } satisfies FilterDataGenerated
```

`satisfies` gives consumers the inferred (narrow) type without needing a cast.

### Fuel type derivation

```ts
driveTypeId === 3                         → 'electric'
driveTypeId === 1 && electricRangeKm > 0  → 'hybrid'
driveTypeId === 2                         → 'diesel'
default                                   → 'petrol'
```

### Body type translations (German → Polish/ID)

Hardcoded in `translations.ts`. Known values:
`Limousine` → sedan, `Kombi` / `Kombi-Limousine` → kombi, `Coupe` / `Coupé` → coupe,
`Cabriolet` / `Cabrio` → kabriolet, `SUV` / `Geländewagen` → suv, `Van` → van, `Pickup` → pickup, `Hatchback` → hatchback.

Unknown values log `[WARN]` and are skipped.

### Known data issues

| Issue | Detail |
|---|---|
| Some tech sheets have no catalog entry | Logged as `[WARN] No catalog entry for …` and skipped |
| `mercedes-220-s.json` skipped | Typo in scraped data: `potnon` instead of `ponton` |
| `honda-e.json` — body type `"4"` | Corrupt field in source; treated as unknown → `[WARN]` |
| Race/concept cars | `Karobauart = "Rennwagen"` etc. — unknown body type, skipped with `[WARN]` |
| Pre-Euro-era vintage cars | `Schadstoffklasse` empty → automatically excluded by age filter |

---

## Output: `src/generated/filter-data.ts`

Auto-generated TypeScript module. **Committed to repo** — regenerate when source data changes.

```bash
cd apps/scraper
pnpm start:dev build-filter-data        # just filter data
pnpm start:dev generate --skip-catalog --skip-tech-sheets  # same
```

Exposed via package export `@lumo/scraper/filter-data` (see `exports` in `package.json`). The compiled output (`dist/generated/filter-data.mjs`) is what consumers get at runtime; TypeScript resolves via the `types` field pointing to the source `.ts`.

### Shape (`FilterDataGenerated`)

```ts
type FilterDataGenerated = {
  locale: 'pl'
  makes: Array<{ id: string; name: string }>
  bodyTypes: Array<{ id: string; label: string }>
  fuelTypes: Array<{ id: string; label: string }>
  transmissions: Array<{ id: string; label: string }>
  indexes: {
    makes: Record<string, { name: string; modelIds: string[] }>
    models: Record<string, { name: string; generationIds: string[] }>
    generations: Record<string, {
      name: string
      production: { start: number; end: number | null }
      engineTrims: EngineTrim[]
    }>
  }
}

type EngineTrim = {
  name: string      // "520d" — not translated
  capacity: number  // cm³ (0 for pure electric)
  power: number     // HP
  fuelType: FuelTypeId
}
```

Index keys are colon-separated: `"bmw"`, `"bmw:5er"`, `"bmw:5er:g60-g61"`.
- Make key: `slugify(resolvedMakeName)` — e.g. `"mercedes-benz"`, `"volkswagen"`
- Model key: `makeKey + ":" + slugify(catalog.model.sourceId)`
- Generation key: `modelKey + ":" + slugify(catalog.gen.sourceId)`

Model and generation segments use the catalog `sourceId` slug (not `id`), matching the `metadata.sourceIds` in tech sheets.

---

## Web App Entrypoint

**Single import point:** `apps/web/src/features/ads/lib/filter-data.ts`

```ts
import { filterData, makes, bodyTypes, fuelTypes, transmissions, indexes } from '~/features/ads/lib/filter-data'
```

No cast needed — type is inferred from the `satisfies FilterDataGenerated` in the generated file.

---

## i18n Approach

- `locale: 'pl'` is hardcoded as `LOCALE` const in `translations.ts` — widen to union when more locales are added.
- Body types, fuel types, transmissions: translated via hardcoded maps in `translations.ts`.
- **Model names** (`"5er"`, `"3er"`) are **not translated** — source language kept. Full translation via Cloudflare AI is a future task.
- Make names are largely international and need no translation.
- Engine trim codes (`"520d"`, `"530e"`) are universal identifiers — never translated.

---

## Package Exports (`@lumo/scraper`)

```json
"./filter-data":  { "types": "./src/generated/filter-data.ts",            "default": "./dist/generated/filter-data.mjs" }
"./filter-types": { "types": "./src/features/filter-builder/lib/types.ts", "default": "./dist/features/filter-builder/lib/types.mjs" }
```

`apps/web` declares `@lumo/scraper` as a `devDependency` (workspace protocol). Types are resolved via the `types` field at dev time; compiled output is used at build time.
