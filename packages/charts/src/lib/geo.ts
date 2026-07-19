import { MapChart } from "echarts/charts"
import * as echarts from "echarts/core"

/*
 * registerMap is a no-op stub until a module providing the map implementation
 * is used — apps call registerGeoMap at startup, often before any chart
 * module has loaded, so this module must supply the implementation itself.
 */
echarts.use([MapChart])

/** Minimal structural GeoJSON type — a FeatureCollection with named features */
export interface GeoMapJson {
  type: "FeatureCollection"
  features: Array<{
    type: "Feature"
    properties: Record<string, unknown> & { name?: string }
    geometry: unknown
  }>
}

/*
 * echarts.getMap availability differs across builds, so this module owns
 * the registry truth in a local set.
 */
const registeredNames = new Set<string>()

/** Idempotent wrapper over echarts.registerMap — safe to call per render */
export function registerGeoMap(name: string, geoJson: GeoMapJson): void {
  if (registeredNames.has(name)) return
  echarts.registerMap(name, geoJson as Parameters<typeof echarts.registerMap>[1])
  registeredNames.add(name)
}

export function isGeoMapRegistered(name: string): boolean {
  return registeredNames.has(name)
}
