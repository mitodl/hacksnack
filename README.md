# hacksnack

Hack Snack — a daily MIT OpenCourseWare puzzle game, packaged as a React
component you can drop into any React app.

## Install

```sh
npm install hacksnack
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
  () => import("hacksnack").then((m) => m.HackSnackGame),
  { ssr: false },
)

export default function Page() {
  return <HackSnackGame />
}
```

In a plain React app you can import it directly:

```tsx
import { HackSnackGame } from "hacksnack"

export default () => <HackSnackGame />
```

## Static assets

The game fetches images, the puzzle data JSON, the OCW course CSV and the pdf.js
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
