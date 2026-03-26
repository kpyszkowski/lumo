# @lumo/data-scraper

CLI tool for scraping vehicle catalog data from Auto Motor und Sport.

## Setup

Chrome is installed automatically on `pnpm install` via a `postinstall` hook. No
manual setup needed.

## Usage

### Development (TypeScript source)

```bash
pnpm --filter @lumo/data-scraper start:dev <command> [options]
```

### Production (compiled)

```bash
pnpm --filter @lumo/data-scraper build
node apps/data-scraper/dist/cli.mjs <command> [options]
```

All options are interactive — if you omit a flag, the CLI will prompt you.

---

## Commands

### `scrape`

Scrapes vehicle makes, models, and generations. Streams results and writes them
to a JSON array incrementally, so you can interrupt with `Ctrl+C` and keep
partial output.

```bash
pnpm --filter @lumo/data-scraper start:dev scrape -o out/vehicles.json
```

| Flag                  | Description           |
| --------------------- | --------------------- |
| `-o, --output <file>` | Output JSON file path |

**Output shape:**

```json
[
  {
    "make": { "id": "bmw", "sourceId": "...", "name": "BMW" },
    "models": [
      {
        "id": "3-series",
        "sourceId": "...",
        "name": "3 Series",
        "generations": [
          {
            "id": "e90",
            "sourceId": "...",
            "name": "E90",
            "type": "Sedan",
            "production": { "start": 2005, "end": 2012 }
          }
        ]
      }
    ]
  }
]
```

---

### `scrape-tech-sheets`

Takes the output of `scrape` and fetches detailed technical data sheets for each
vehicle generation. Each sheet is saved as an individual JSON file named by its
ID.

```bash
pnpm --filter @lumo/data-scraper start:dev scrape-tech-sheets \
  -i out/vehicles.json \
  -o out/tech-sheets/
```

| Flag                 | Description                                |
| -------------------- | ------------------------------------------ |
| `-i, --input <file>` | Input JSON file (output from `scrape`)     |
| `-o, --output <dir>` | Output directory for tech sheet JSON files |

Each file is saved as `<id>.json` inside the output directory.

---

### `build-indexes`

Processes the vehicle catalog JSON and produces a flat, keyed index optimised
for fast lookup. Keys use a colon-separated hierarchy: `make`, `make:model`, or
`make:model:generation`.

```bash
pnpm --filter @lumo/data-scraper start:dev build-indexes \
  -i out/vehicles.json \
  -o out/indexes.json
```

| Flag                  | Description                            |
| --------------------- | -------------------------------------- |
| `-i, --input <file>`  | Input JSON file (output from `scrape`) |
| `-o, --output <file>` | Output JSON file                       |

**Output shape:**

```json
{
  "bmw": { "name": "BMW" },
  "bmw:3-series": { "name": "3 Series" },
  "bmw:3-series:e90": {
    "name": "E90",
    "type": "Sedan",
    "production": { "start": 2005, "end": 2012 }
  }
}
```

---

## Full Pipeline

```bash
# 1. Scrape vehicle catalog
pnpm --filter @lumo/data-scraper start:dev scrape -o out/vehicles.json

# 2. Build search indexes
pnpm --filter @lumo/data-scraper start:dev build-indexes \
  -i out/vehicles.json \
  -o out/indexes.json

# 3. Scrape tech sheets (slow — one request per generation)
pnpm --filter @lumo/data-scraper start:dev scrape-tech-sheets \
  -i out/vehicles.json \
  -o out/tech-sheets/
```

## Scripts

| Script        | Description                        |
| ------------- | ---------------------------------- |
| `start`       | Run compiled CLI (`dist/cli.mjs`)  |
| `start:dev`   | Run from TypeScript source via tsx |
| `build`       | Compile to ESM (`dist/`)           |
| `clean`       | Remove build artifacts             |
| `check-types` | Type-check without emitting        |
| `lint`        | Lint (strict, no warnings)         |
| `format`      | Auto-fix lint issues               |
