# Kshitij Sharma — Portfolio

Personal portfolio site. Static HTML / CSS / JS, no build step — deploys to GitHub Pages at `sharma-prayash.github.io`.

## Design — "Operator Console"

UI inspiration from [ArtCraft](https://getartcraft.com/), reimagined for a cyber + dev identity:

- **Monochrome base + electric-lime accent** (`--acc: #c6ff3d`); dark by default with a light-theme toggle.
- **Type:** **Archivo** display, **Instrument Serif** italic accent words, **Geist Mono** technical labels, **Inter** body.
- **HUD / instrument-panel chrome:** boot sequence, full-bleed blueprint grid, corner registration marks, a live clock (IST) + status readout, a right-edge measurement ruler with live scroll %, rotated edge labels, a left dot-index, and a cursor-following crosshair.
- **Scramble/decode** effect on every section headline; an animated boot terminal.
- **Cyber-framed sections:** Identity (`whoami` + dossier), Arsenal (skills), Field Log (experience as `LOG_00x`), Builds (projects), Credentials (recognition & certs), Off-Duty, Contact.

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
