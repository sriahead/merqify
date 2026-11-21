import { describe, expect, it } from "vitest";
import {
  classifyStorageResponse,
  importExitCode,
  isSupportedHubImageKey,
} from "@/scripts/import-images-to-hub";

/**
 * #1705 R7, R9, R11: the two pure rules that decide whether a nightly hub sync
 * turns red. A 403 from a bad S3 key used to be counted as "missing" and the
 * run still exited 0.
 */

describe("classifyStorageResponse (R7)", () => {
  it.each([
    [200, "ok"],
    [204, "ok"],
    [404, "missing"],
    [403, "error"],
    [500, "error"],
    [0, "error"],
  ] as const)("status %i is %s", (status, expected) => {
    expect(classifyStorageResponse(status)).toBe(expected);
  });
});

describe("importExitCode (R9)", () => {
  it("exits 1 only for an apply run with failures", () => {
    expect(importExitCode({ apply: true, failed: 1 })).toBe(1);
    expect(importExitCode({ apply: true, failed: 0 })).toBe(0);
    expect(importExitCode({ apply: false, failed: 3 })).toBe(0);
    expect(importExitCode({ apply: false, failed: 0 })).toBe(0);
  });
});

describe("isSupportedHubImageKey (#1711)", () => {
  it.each([
    ["products/apple.jpg", true],
    ["products/apple.jpeg", true],
    ["products/apple.png", true],
    ["products/apple.webp", true],
    ["products/apple.JPG", true],
    ["products/apple.PNG", true],
    ["products/apple.WEBP", true],
    ["products/apple.svg", false],
    ["products/gen-fresh-fruit/main.svg", false],
    ["categories/placeholder.svg", false],
    ["products/apple.gif", false],
    ["products/apple.bmp", false],
    ["products/apple", false],
  ] as const)("%s is recognized as %s", (key, expected) => {
    expect(isSupportedHubImageKey(key)).toBe(expected);
  });
});
