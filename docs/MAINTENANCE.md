# Maintaining the creative notebook

## Routine refresh

Use Python 3.12+ from the repository root:

```sh
python -m venv .venv
source .venv/bin/activate
pip install -r scripts/requirements.txt
python scripts/update_catalog.py --refresh --assets --check
python scripts/check_site.py
python scripts/test_updater.py
python scripts/package_site.py
```

On Windows use `.venv\Scripts\activate` instead. The updater refreshes both public itch.io catalogs, caches missing cover images, regenerates web derivatives and HTML, and optionally checks public links. It does **not** publish, commit, change prices, create store products or invent new curated descriptions. Review the diff and then commit/push when ready.

Without flags, `python scripts/update_catalog.py` rebuilds offline. `--refresh` requires HTTPS access and preserves the old catalog if either source fails or returns no parseable entries. `--assets` only fills missing covers; remove an individual `image_local` value deliberately if its cover needs refreshing. `--check` can take several minutes and writes diagnostic statuses, not a definitive dead-link verdict. Curated books/store cards are maintained manually so incomplete scraping cannot remove them.

## Where to edit

| File | Purpose |
| --- | --- |
| `data/gallery.json` | Ordered selection, source paths, category, descriptive title and alt text |
| `data/books.json` | Book editions, category, copy, retailer links and cover source |
| `data/featured.json` | Featured games/music/store cards |
| `data/career.json` | Preserved education, resumes, certificates and software HTML |
| `data/discovered.json` | Refreshable public project catalog |
| `data/media.json` | Generated derivative dimensions/paths/byte counts; do not hand-edit |
| `scripts/build_site.py` | Page template and content rendering |
| `assets/site.css` | Layout, responsive behavior and theme colors |
| `assets/theme-init.js` | Early theme selection and preference/query handling |
| `assets/site.js` | Gallery, filtering, effects and disclosure behavior |

`index.html` is generated. Change the template/data, then rebuild; editing only HTML will be overwritten. New artwork requires a real source file, unique stable ID, meaningful alt text and a category. Run the optimizer after changing the manifest. The two migration scripts (`seed_catalog.py`, `enrich_books.py`) document the initial migration and are **not routine update commands**.

## Preview and release

```sh
npm run dev
```

Open `http://127.0.0.1:4173`. There are no npm dependencies. In managed Work environments, use the supervised preview instead.

GitHub Pages retains the existing `.github/workflows/static.yml` release flow on `main`. CI builds, runs structural/updater checks and publishes only `dist/`. The package script recreates only that generated output directory. High-resolution originals, source tools and cached cover sources are excluded from deployment. The vCard is retained as an on-demand download.

Before release, run the checks, inspect the diff, and test desktop/phone widths and all five themes. Test gallery close, Escape/back, repeated next/previous, category filters, book links, shop links, catalog search and optional video removal. Test a real phone before claiming mobile crash resolution.

Rollback uses a normal Git revert of the rebuild commit followed by the existing Pages workflow; do not force-reset branch history. Original source art remains available in the repository.
