# House Framing Atlas

Done Right Roofing’s interactive guide to residential framing and roofing. Rotate the house and select a piece to learn its purpose, placement, and importance. [Open the customer atlas](https://mr-doneright.github.io/house-framing-atlas/).

## Saved checkpoint

**v1.0.0** captures the November 22, 2026 working version with 161 terms across eight building systems and ten 3D views. The checkpoint includes the editable model, the customer page, the sharing QR code, and the files needed to rebuild the offline edition.

The `main` branch serves the customer link. Use the `development` branch for updates. The `v1.0.0` tag names a specific saved version and stays at that version as either branch moves.

## Open the checkpoint on Windows

1. [Download the v1.0.0 ZIP](https://github.com/MR-DoneRight/house-framing-atlas/archive/refs/tags/v1.0.0.zip).
2. In File Explorer, right-click the ZIP and select **Extract All**.
3. Open the extracted folder and double-click **index.html**. The saved atlas runs in your browser.

To restore the customer site later, tell Codex **“Restore the public House Framing Atlas to checkpoint v1.0.0. Preserve my newer work on its branch and verify the live customer link.”** A restoration can copy the tagged customer files into a new commit on `main`, preserving the history of both versions.

## Work on an update

The geometry, terminology, controls, and page styles are in `src/`. The customer QR code and optional Windows Wi-Fi launcher are in `share/`.

1. Open a checkout of the `development` branch.
2. Edit the relevant source files. If the term count changes, update the sharing description in `src/share-head.html`.
3. With Node.js installed, run `node scripts/build.cjs` from the repository root. It rebuilds `index.html` and puts the standalone and inline editions in `build/`.
4. Open `index.html` to review the change. For the automated desktop and phone-emulation checks, use Node.js 22 or later and Chrome or Edge on Windows. Run `node scripts/browser-test.cjs index.html`. Add `--software` to test the graphics fallback.
5. Save and review the update on `development`. Move the approved customer files to `main` when ready to publish.
