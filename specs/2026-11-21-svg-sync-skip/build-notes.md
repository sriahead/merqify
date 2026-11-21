# Image Hub sync: Skip non-raster images (build notes)

## Implementation Summary
- Added `isSupportedHubImageKey(key: string): boolean` helper to `scripts/import-images-to-hub.ts`.
- Integrated `isSupportedHubImageKey` checks into `productImages` and `categoryAssets` processing loops.
- Handled `unsupported_type` responses from `importAsset` gracefully as warnings rather than fatal failures.
- Added comprehensive unit tests in `tests/import-images-to-hub.test.ts`.
- Updated `CHANGELOG.md` under `[Unreleased] -> Fixed`.
