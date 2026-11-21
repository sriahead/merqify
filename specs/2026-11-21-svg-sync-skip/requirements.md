# Image Hub sync: Skip non-raster images (requirements)

Part of #1711, follow-up to #1705.

## Problem
The nightly Image Hub sync job (`.github/workflows/image-hub-sync.yml`) runs `scripts/import-images-to-hub.ts --apply`.
The Image Hub API strictly accepts raster formats (`image/jpeg`, `image/png`, `image/webp`).
When encountering a vector image or unsupported file extension (such as `.svg`), the hub API returns `422 unsupported_type`.
Because #1705 configured the script to exit 1 on any `[FAILED]` item, encountering an SVG product image turns the nightly sync red in both production cells, every night, and prevents the job from completing cleanly.

## Requirements

- **R1: Supported format check**: `scripts/import-images-to-hub.ts` exposes a pure helper `isSupportedHubImageKey(key: string): boolean` that returns `true` only for `.jpg`, `.jpeg`, `.png`, and `.webp` (case-insensitive), and `false` for `.svg` and all other extensions.
- **R2: Product image skipping**: When `!isSupportedHubImageKey(img.storageKey)`, the script logs `[WARN] Skipping non-raster storage object: <storageKey> (only JPEG, PNG and WebP are supported by Image Hub)`, increments `skippedCount`, and continues without attempting to upload to the hub.
- **R3: Category asset skipping**: When `!isSupportedHubImageKey(cat.storageKey)`, the script logs a matching `[WARN]`, increments `skippedCount`, and continues.
- **R4: Hub unsupported_type guard**: If `importAsset` returns `unsupported_type`, the script logs a warning, increments `skippedCount` instead of `failedCount`, and continues.
- **R5: Unit tests**: `tests/import-images-to-hub.test.ts` includes unit tests verifying `isSupportedHubImageKey` across supported and unsupported extensions.
- **R6: Clean exit code**: When only supported images, 404s, and unsupported vector formats are encountered, the script exits `0` (`Failed: 0`).
