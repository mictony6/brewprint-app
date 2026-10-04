# Brewprint

Brewprint is a career-matching quiz. Visitors answer a short set of questions, get matched to a career path, and are pointed to a free career kit and related resources. After the results, they can explore an interactive "desk" whose items link to further resources.

The app is a React single-page widget that mounts into `#brewprint-root`, so it can be embedded in a host page (a Webflow site). Content for career kits and resources comes from the Webflow CMS, and usage is tracked with PostHog.

## Features

- **Quiz flow:** intro, questions with a progress bar, results, then the interactive desk. Progress is kept in `sessionStorage`, so a refresh doesn't lose your place.
- **Scoring:** each answer option adds weighted points to one or more careers. Results are normalised against each career's maximum possible score (`src/lib/scoring.ts`).
- **Career kits and resources:** fetched from Webflow through Cloudflare Pages Functions. The matched career's kit is shown on the results card.
- **Interactive desk:** desk items are positioned from `src/data/deskPositions.json`.
- **Analytics:** PostHog events for the quiz funnel, desk views, resource and career-kit clicks, and optional demographics (age bracket, employment status, region). Each run gets a `quiz_attempt_id`.

## Tech stack

- React 19, TypeScript, Vite
- Cloudflare Pages and Pages Functions (Wrangler for local dev)
- Webflow CMS (`webflow-api`)
- PostHog (`posthog-js`, `@posthog/react`)
- lucide-react icons

## Getting started

Requires Node.js and npm.

```bash
npm install
```

### Environment variables

Create a `.env` file in the project root:

```
VITE_POSTHOG_PROJECT_TOKEN=<your PostHog project token>
VITE_POSTHOG_HOST=<PostHog API host, e.g. /ingest to use the built-in proxy>
```

The Pages Functions need a server-side secret, set in the Cloudflare Pages dashboard (or a `.dev.vars` file for local use):

```
WEBFLOW_CMS=<Webflow API access token>
```

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server only. Webflow-backed endpoints (`/api/*`) are not available. |
| `npm run dev:full` | Runs Vite behind `wrangler pages dev`, so the Pages Functions work locally. |
| `npm run build` | Type-checks (`tsc -b`) and builds to `dist/`. |
| `npm run lint` | Runs ESLint. |
| `npm run preview` | Serves the production build locally. |

## Project structure

```
functions/
  api/                 Pages Functions that read from the Webflow CMS
                       (collections, resources, career-kits, career-kit-item)
  ingest/[[path]].ts   Reverse proxy to PostHog, to avoid ad blockers
src/
  components/          Quiz, question/results cards, desk, demographics panel, debug tools
  data/                questions.json, careers.json, deskPositions.json
  lib/                 scoring, analytics, Webflow fetch helpers, desk item logic
  styles/ and *.css    Styling
  types/               Shared TypeScript types
```

## Editing quiz content

- **Questions:** edit `src/data/questions.json`. Each option has a `label`, an `icon`, and a `scores` map of career slug to points.
- **Careers:** edit `src/data/careers.json`. Each entry has a `name`, a `slug` (which must match the career kit's slug in Webflow), and a `blurb` for the results card. Any career used in a `scores` map must exist here.

## Dev-only tools

These only appear under `npm run dev` and are not included in production builds.

- **Debug career switch:** previews the results for any career without taking the quiz.
- **Desk position editor:** drag and resize desk items, and save the layout directly to `src/data/deskPositions.json` (via a dev-only Vite middleware at `/api/desk-positions`).

## Deployment

Deployed on Cloudflare Pages at `https://brewprint-app.pages.dev/`. `vite.config.ts` sets `base` to that URL so assets resolve when the build is embedded elsewhere. The build also emits `head-links.json`, a manifest of external `<link>` tags from `index.html` (such as Google Fonts), so the host page's loader can inject them into its own `<head>`.

## Styling notes

Base styles are scoped with `:where(#brewprint-root)`, so they don't out-rank plain class overrides, and the widget's styles stay isolated from the host page.
