# Kshitij Sharma — Portfolio

Personal portfolio site. Static HTML / CSS / JS, no build step — deploys to GitHub Pages at `sharma-prayash.github.io`.

## Design — "Operator Console"

UI inspiration from [ArtCraft](https://getartcraft.com/), reimagined for a cyber + dev identity:

- **Monochrome base + electric-lime accent** (`--acc: #c6ff3d`); dark by default with a light-theme toggle.
- **Type:** **Archivo** display, **Instrument Serif** italic accent words, **Geist Mono** technical labels, **Inter** body.
- **HUD / instrument-panel chrome:** boot sequence, full-bleed blueprint grid, corner registration marks, a live clock (IST) + status readout, a right-edge measurement ruler with live scroll %, rotated edge labels, a left dot-index, and a cursor-following crosshair.
- **Scramble/decode** effect on every section headline.
- **Interactive terminal** in the hero: a real prompt that runs only predefined commands — `whoami`, `ls`, `cat <file>` (virtual filesystem), plus `help`/`clear` and a couple of easter eggs; command history on ↑/↓.
- **Steganographic background:** the identity/dossier data is hidden "in plain sight" inside a faint `strings`-style hex dump behind the hero (readable in the ASCII column if you look).
- **Photo collage** in the Identity section: two grayscale portraits (lime-tinted, color on hover) framed as `FIG_0x` evidence shots. Source photos are cropped (watermark removed), resized and re-encoded, which strips EXIF/GPS.
- **Cyber-framed sections:** Identity, Arsenal (skills), Field Log (experience as `LOG_00x`), Builds (projects), Credentials (recognition & certs), Off-Duty, Contact.

## Updating assets

The CSS/JS are loaded with a `?v=N` query for cache-busting — bump `N` in `index.html` whenever you change `styles.css` or `main.js` so visitors get the update.

## Structure

```
index.html            # all content / markup
assets/css/styles.css # design system + layout
assets/js/main.js     # terminal typing, ruler, reveal, nav, theme
assets/resume.pdf     # (add your résumé here — "Download Résumé" links to it)
assets/img/           # images (currently none)
```

## Run locally

Any static server works, e.g.:

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## To do / add later

- Drop the real `assets/resume.pdf` in place.
- Update the LinkedIn URL in the footer (currently a placeholder).
- Add project links / live demos once available.
