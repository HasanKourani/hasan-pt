# Hasan Kourani, personal trainer website

A one-page animated landing site, built for phones first. Plain HTML, CSS
and JavaScript with a tiny Node build script and no other dependencies.

## Editing

`index.html` in the root is generated. Edit these instead, then rebuild:

- `src/pages/index.html`: the page content.
- `src/layout.html`: shared head, nav, footer and the phone booking bar.
- `assets/js/site.js`: WhatsApp number and the WhatsApp message templates (`UI.msg`).
- `assets/css/site.css`: colours and fonts are at the top.
- `build.mjs`: **all prices** (`PRICES`), the published address (`SITE`) and `VERSION`.

```bash
node build.mjs
```

After changing anything in `assets/css` or `assets/js`, bump `VERSION` in `build.mjs` first so
browsers fetch the new files.

The programs, prices, founding-spot offer, reply time and FAQ policies are **placeholders**.
`brief.md` lists every one of them so they can be checked before launch.

## Photos

Source photos are in `D:\Gym pics` (HEIC ones converted into `photos-src/`). `photos.json` says
how each one is cropped. To re-encode after swapping a photo:

```bash
python C:/Users/acer/.claude/skills/local-business-website/scripts/encode_photos.py --spec photos.json
```

## Running locally

```bash
python -m http.server 5520
```

Then open http://127.0.0.1:5520/.

## Hosting

GitHub Pages works as is (all links are relative). Set `SITE` in `build.mjs` to the real address
and rebuild, so WhatsApp link previews show `assets/img/og-image.jpg`.
