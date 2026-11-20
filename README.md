# hacksnack

Hack Snack — a daily MIT OpenCourseWare puzzle game, packaged as a React
component you can drop into any React app.

## Install

```sh
npm install @mitodl/hacksnack
# peer dependencies (you very likely already have these):
npm install react react-dom @emotion/react @emotion/styled
```

## Usage

The game is **client-only** (it uses `window` and loads the pdf.js worker in the
browser). In Next.js, load it without SSR:

```tsx
"use client"
import dynamic from "next/dynamic"

const HackSnackGame = dynamic(
  () => import("@mitodl/hacksnack").then((m) => m.HackSnackGame),
  { ssr: false },
)

export default function Page() {
  return <HackSnackGame />
}
```

In a plain React app you can import it directly:

```tsx
import { HackSnackGame } from "@mitodl/hacksnack"

export default () => <HackSnackGame />
```

## Static assets

The game fetches images, the puzzle data JSON and the pdf.js
worker at runtime. Copy the bundled asset files into your app's public
directory and they'll be served at `/games/hacksnack/...` by default:

```sh
npx hacksnack-copy-assets ./public/games/hacksnack
```

If you host them somewhere else, point the game at that location:

```tsx
<HackSnackGame assetBasePath="/static/hacksnack" />
```

## Props

| Prop               | Type     | Default              | Description                                                                    |
| ------------------ | -------- | -------------------- | ------------------------------------------------------------------------------ |
| `assetBasePath`    | `string` | `"/games/hacksnack"` | Base URL path where the static assets live.                                    |
| `googleMapsApiKey` | `string` | `""`                 | Google Maps JS API key for Street View ("map") puzzles. Omit to disable them.  |

## Development

Use Node 24.14.1 or later (`.nvmrc`), which ships npm 11.10 or later. `.npmrc` sets `min-release-age=7`, so npm only installs package versions published at least 7 days ago. npm before 11.10 ignores that setting: `devEngines` in `package.json` makes npm 10.9 to 11.9 refuse to install (`EBADDEVENGINES`), but npm before 10.9 checks neither, so don't use Node 20. Publishing needs npm 11.10 or later too.

Asking for an exact version less than 7 days old fails with `ETARGET` ("No matching version found ... with a date before ..."). If an installed package has a peer dependency on it, npm can loop instead of failing. Either way, use `@latest` or a version range, which picks the newest version old enough, or wait until it is 7 days old.
