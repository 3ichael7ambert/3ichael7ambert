# Living Sketchbook handoff

The production site is [3ichael7ambert.com](https://3ichael7ambert.com/). This repository owns the personal portfolio and its [Characters & Worlds guide](https://3ichael7ambert.com/worlds/). GitHub Pages publishes the output of the `main` branch through [the Pages workflow](../.github/workflows/static.yml). The baseline for this handoff is commit `104c1ad1bcd0d96039683b0cff866c5453c4ff2e`.

## Rebuild and preview

From the repository root, use Python 3.12 and run the same build sequence as CI.

```sh
python -m venv .venv
source .venv/bin/activate
python -m pip install -r scripts/requirements.txt
python scripts/build_site.py
python scripts/check_site.py
python scripts/test_updater.py
python scripts/package_site.py
python -m http.server 4173 --bind 127.0.0.1 --directory dist
```

On Windows PowerShell, activate the environment with `.venv\Scripts\Activate.ps1`. Open http://127.0.0.1:4173/ after the build. Preview the packaged output to see the chapter controls, Worlds guide, and reader together. The package script recreates `dist/`. Make lasting edits to the source files and data.

## Where to work

| Area | Source |
| --- | --- |
| Homepage structure and base styles | [build_site.py](../scripts/build_site.py), [site.css](../assets/site.css) |
| Book controls, page turns, chapter links, and scroll mode | [publish_sketchbook.py](../scripts/publish_sketchbook.py), [sketchbook.js](../assets/sketchbook.js), [sketchbook.css](../assets/sketchbook.css) |
| Full-size rotating pencil, drawing, erasing, and movable objects | [desk.js](../assets/desk.js), [original pencil code](../js/pencilCursor.js), [pencil image](../assets/media/pencil-480.webp) |
| Sketchbook Run and controller input | [sketch-run.js](../assets/sketch-run.js) |
| Worlds, characters, design references, and project links | [worlds.json](../data/worlds.json), [publish_worlds.py](../scripts/publish_worlds.py), [world-art.js](../assets/world-art.js) |
| Personal book reader and packaged art | [reader](../reader), [media bundles](../data/media-bundles), [publish_reader_media.py](../scripts/publish_reader_media.py) |
| Routine catalog and asset refresh | [Maintenance guide](MAINTENANCE.md) |

The archived [Book of Life](https://github.com/3ichael7ambert/bookoflife) inspired the chapter index. [Divinity](https://github.com/3ichael7ambert/divinity-js) inspired movable objects and the hidden archive link. The back pocket lives on the Contact page. The Divinity link also appears when you move its ticket into the left quarter of the screen.

## Content and ownership

The Worlds guide contains 19 entries at this baseline. Keep Mosswake and Ortega Sauce outside the personal Worlds guide. Drunk Yeti and Moly, Bart & Skid were also removed from that guide at Michael’s request. The broader Games catalog is a separate part of the portfolio.

Use original drawings and documented designs when expanding character sheets. Existing plates point into *The Artwork of 3ichael 7ambert* and *Inktober 2023*. The illustrated Dillingham, Riggins, and PenPals references use the studio’s public comic reader. Several worlds still have written references only. Confirm art is public or cleared for public release before committing it. Verify game and book links and label in-development work accordingly.

## Release checks

- Open the cover and turn pages with the arrows, chapter picker, keyboard, and a mobile edge swipe. Test a direct link such as `/#games`, browser Back, Scroll view, and reduced motion.
- Move the mouse across the cover and check that the original pencil turns around its tip. Draw with mouse and touch. On the focused drawing surface, hold Space and use the arrow keys. Check erasing, Escape to Browse, and dragging loose objects.
- Return to a previous chapter and confirm it restores its own marks and object positions. These are held for the current page session, so a reload clears them.
- In Sketchbook Run, check movement, jumping, pausing, and restarting. Standard gamepad bumpers turn chapters, the stick or D-pad moves the player, the bottom face button jumps, and Start plays or pauses. Prior testing used a simulated standard gamepad. Use physical hardware to check device-specific mappings.
- Open the gallery, a personal book in the reader, and the Worlds guide on desktop and phone. Verify linked games, books, and illustrated references.

After merging, confirm the [Pages run](https://github.com/3ichael7ambert/3ichael7ambert/actions) and check the live homepage and Worlds guide. For rollback, revert the affected commit through Git and let Pages redeploy. `CNAME` identifies the production hostname.
