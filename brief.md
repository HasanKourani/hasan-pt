# Brief: Hasan Kourani, personal trainer

## Brand

- **Name:** Hasan Kourani (personal brand, monogram "HK")
- **What:** personal trainer, online coaching and 1-on-1 training
- **Languages:** English only (the Arabic version was removed at the owner's request, 2026-11-01)
- **Audience:** mostly on phones; people starting out or restarting, who want a coach who answers
- **Voice:** direct, honest, a bit of gym grit. No hype, no fake numbers.
- **Palette:** charcoal wall `#0c0c0e`, page background a slate-to-aqua gradient `#64828a → #d2e3e3` (from the owner's Spur-Fit reference, 2026-11-01), accent blue `#36515c` (owner's pick, 2026-11-01), with a light tint `#85a8b7` for text on dark
- **Type:** Big Shoulders Display (headlines), Instrument Serif italic (accent words),
  Manrope (body)
- **Design references:** Pinterest board "UI designs" (10 pins, analysed 2026-11-01): annotated
  hero (Spur-Fit), word-spelling photo cards (Nature/WEST), program cards that take over the
  background (Patagonia, Timed Card Opening), counters and stacked type (DIO), exploded product
  (Keychron), 3D cover-flow (Voyage), glass dashboard (Juice Lab).

## Facts (from the owner, chat 2026-11-01)

| Fact | Value | Source |
| --- | --- | --- |
| Name | Hasan Kourani | owner |
| Training experience | 3 years of lifting (corrected from 2 on 2026-11-01) | owner |
| Coaching experience | coached 3 friends one-on-one, and all 3 saw results; no paying clients yet | owner (2026-11-01) |
| Booking | WhatsApp only, +961 70 089 237 (`96170089237`) | owner |
| Languages | English only (Arabic dropped 2026-11-01) | owner |
| Photos | `D:\Gym pics` (23 photos of Hasan training) | owner |

## Positioning: a professional launching something new (owner's direction, 2026-11-01)

The first draft read like a beginner asking for a chance; the owner asked for "professional starting
something new" instead. The site states what is true, confidently, and never apologises for it:

- **Tested first, launched second:** the method was tested on his own training (3 years) and on the
  3 friends he coached, who all saw results. Now it opens to a small roster of clients.
- **Proof that is real:** his physique and photos. The site says he "coached others one-on-one, and
  every one of them saw results", with no number and never "friends" (owner removed the "3 people"
  wording and the 3/3 counter, 2026-11-01). No invented testimonials, transformation photos, client counts or specific results (kilos lost,
  etc.) until he provides them.
- **Founding clients as a launch:** 10 founding spots with launch pricing kept for as long as they
  stay, framed as an opening, not a favour.
- **Process over promises:** a clear 4-step "how it works" and an FAQ on his coaching background.

## PLACEHOLDERS: confirm or change before launch

Everything here was invented at the owner's request ("add placeholder programs and prices").
All prices live in `PRICES` in `build.mjs`.

| Item | Placeholder | Where |
| --- | --- | --- |
| Online Coaching | `$50` / month | `PRICES.online` |
| 1-on-1 Training | no listed price: "Price agreed on WhatsApp" (owner, 2026-11-01); 12 sessions a month is still a placeholder | program copy, WhatsApp template |
| Custom Plan | `$25` one time, 8-week plan | `PRICES.plan`, program copy |
| Free consultation | free, ~15 min chat on WhatsApp | hero, method, composer |
| Founding spots | 10 spots, prices locked while you stay | founding section, FAQ |
| Reply time | "usually within a day" | stats, composer header |
| Plan delivery | within 48 hours of the assessment | method step 3 |
| Check-ins | weekly, on WhatsApp | programs, method, FAQ |
| Cancel | month to month, no contract | FAQ |
| Payment | arranged on WhatsApp | FAQ |
| In-person location | "agreed on WhatsApp" (gym not named) | 1-on-1 program, FAQ |
| Dashboard numbers | example data, labelled as an example | "What we track" section |

## Gaps (ask the owner)

- Instagram handle (footer link left out until known)
- Where 1-on-1 sessions happen (gym name / area)
- Certifications, if any are planned
- Real prices and which programs to keep
- A logo, if he wants more than the HK monogram

## Copy we wrote (owner to approve)

Hero "Built, not born." and intro, the "Tested first, launched second" statement, program taglines,
method step text, FAQ answers, founding-client copy (including "first say in how the coaching
grows") and all WhatsApp message templates.

## Photos

The GRIT cards, the 1-on-1 and Custom Plan photos and the slideshow come from `D:\Gym pics\Use`,
the owner's chosen set (2026-11-01). Crops are in `photos.json`.

| File in site | Source | What it shows | Used in |
| --- | --- | --- | --- |
| `hero.webp` | IMG_2078 (1)(1).jpg | dark edit, side-on, shoulder and arm (owner's pick) | hero |
| `og-image.jpg` | IMG_2077.heic | Hasan, black tank, arm flexed, looking at camera | link preview |
| `grit-g.webp` | Use/IMG_1931.jpg | hammer curl, blue tank (darker edit, 2026-11-01) | honest part, G |
| `grit-r.webp` | Use/IMG_2078 (1)(1).jpg | dark side portrait (same as hero; owner kept it) | honest part, R |
| `grit-i.webp` | Use/IMG_1906.jpg | cable machine, grey tank | honest part, I |
| `grit-t.webp` | Use/IMG_2118.jpg | preacher curl, second take | honest part, T |
| `prog-online.webp` | IMG_2078 (1).jpg | dark edit, arm and shoulder | programs: online |
| `prog-one.webp` | Use/IMG_2118(1).jpg | preacher curl, first take | programs: 1-on-1 |
| `prog-plan.webp` | Use/IMG-20261009-WA0196 (1).jpg | shirtless mirror selfie | programs: plan |
| `gal-1.webp` | Use/IMG_1906.jpg | cable machine | slideshow 1 |
| `gal-3.webp` | Use/IMG_2078.jpg | dark edit, half face and arm | slideshow 2 |
| `gal-2.webp` | Use/IMG_1931.jpg | hammer curl, blue tank (darker edit) | slideshow 3 |
| `gal-5.webp` | Use/IMG_2118(1).jpg | preacher curl | slideshow 4 |
| `gal-4.webp` | Use/IMG-20261009-WA0196 (1).jpg | mirror selfie | slideshow 5 |
| `gal-6.webp` | Use/IMG_2077.jpg | dark arm close-up | slideshow 6 |
| `track-bg.webp` | IMG_2078.jpg | dark edit | "What we track" background |
| `avatar.webp` | IMG_2077.heic | face crop | composer avatar, founding card |
