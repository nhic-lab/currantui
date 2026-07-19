import { describe, expect, it } from "vitest"

import { isGeoMapRegistered, registerGeoMap } from "@nhic/currantui-charts/lib/geo"

import type { GeoMapJson } from "@nhic/currantui-charts/lib/geo"

const square = (name: string): GeoMapJson["features"][number] => ({
  type: "Feature",
  properties: { name },
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, 0],
      ],
    ],
  },
})

const map: GeoMapJson = { type: "FeatureCollection", features: [square("A")] }

describe("registerGeoMap", () => {
  it("registers once and reports availability", () => {
    expect(isGeoMapRegistered("unit-test-map")).toBe(false)
    registerGeoMap("unit-test-map", map)
    expect(isGeoMapRegistered("unit-test-map")).toBe(true)
  })

  it("is idempotent — re-registering the same name does not throw", () => {
    registerGeoMap("unit-test-map", map)
    expect(() => registerGeoMap("unit-test-map", map)).not.toThrow()
    expect(isGeoMapRegistered("unit-test-map")).toBe(true)
  })

  it("tracks names independently", () => {
    expect(isGeoMapRegistered("unit-test-other")).toBe(false)
  })
})
