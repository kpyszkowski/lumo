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

The filter-builder resolves this via a `sourceId → catalogKey` map built during catalog indexing. Always use that map — never match directly by `id`.

### Key `data` fields

| German field | Meaning | Example |
|---|---|---|
| `Marke_Name` | Make name | `"BMW"` |
| `Baureihe_Name` | Series/model name (German) | `"5er"` |
| `Modell_Name` | Engine trim variant | `"520d"` |
| `Hubraum` | Displacement (cm³) | `1995` |
| `Ps` | Power (HP) | `197` |
| `Kw` | Power (kW) | `145` |
| `Karobauart` | Body type (German) | `"Limousine"` |
| `Antriebstyp_ID` | Drive type: 1=petrol/hybrid, 2=diesel, 3=electric | `2` |
| `ReichweiteReinElektrisch` | Electric-only range km; >0 means hybrid when ID=1 | `0` |
| `Getriebe` | Transmission: `"manuell"` / `"automatisch"` | `"automatisch"` |
| `Baujahr_Jahr` | Production year start | `2023` |
| `Schadstoffklasse` | Emissions standard | `"Euro 6e"` |

---

## Feature: `filter-builder`

Combines catalog + tech sheets into a typed TypeScript module.

### `build-filter-data.ts` — core logic

Returns `FilterDataGenerated`. Steps:
1. Load `out/data.json` → build `sourceId → catalogKey` resolution map for generations
2. Iterate all `out/tech-sheets/*.json` — extract trim name, capacity, power, fuel type, body type, transmission
3. Deduplicate engine trims by `Modell_Name` within each generation (first occurrence wins)
4. Apply translations; sort makes alphabetically
5. Return structured object

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
| 6 Mercedes AMG GT 4-door variants skipped | `sourceIds.generation = "x290"` has no match in catalog |
| `mercedes-220-s.json` skipped | Typo in scraped data: `potnon` instead of `ponton` |
| `honda-e.json` — body type `"4"` | Corrupt field in source; treated as unknown body type |
| 4 vintage Mercedes race cars | `Karobauart = "Rennwagen"` — not a real filter category, skipped |

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

Index keys use catalog `id` (not sourceId), colon-separated: `"bmw"`, `"bmw:5er"`, `"bmw:5er:g60-g61"`.

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
