// The game loads several static assets at runtime (images, the puzzle data
// JSON and the pdf.js worker). When published as a library
// we can't serve those ourselves, so the consuming app hosts them and tells us
// where via the `assetBasePath` prop on <HackSnackGame>.
//
// That base path flows to components through React context (see
// AssetContext.tsx) and is passed explicitly to the plain data modules
// (lib/gameData.ts). Nothing reads a mutable global, so multiple instances and
// server rendering stay correct. Defaults to the path used by MIT Learn.

export const DEFAULT_ASSET_BASE_PATH = "/games/hacksnack"

/** Strip trailing slashes so `joinAssetPath` always emits a single separator. */
export const normalizeAssetBasePath = (path: string): string =>
  path.replace(/\/+$/, "")

/** Build a fully-qualified URL for a packaged asset by file name. */
export const joinAssetPath = (basePath: string, fileName: string): string =>
  `${basePath}/${fileName.replace(/^\/+/, "")}`
