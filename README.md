# Kshitij Sharma — Portfolio

Personal portfolio site. Static HTML / CSS / JS, no build step — deploys to GitHub Pages at `sharma-prayash.github.io`.

## Design

Visual language referenced from [ArtCraft](https://getartcraft.com/): monochrome grayscale, **Archivo** display headlines with **Instrument Serif** italic accent words, **Geist Mono** technical labels, hairline grid, and a right-edge measurement ruler that tracks scroll progress. Dark by default with a light-theme toggle.

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
