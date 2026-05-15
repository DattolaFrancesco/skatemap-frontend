
import * as THREE from 'three'

export const INITIAL_ROTATION = new THREE.Euler(0.6, -3.2, 0)

export function coordinatesConvertor(lat, lon) {
  const latRad = (lat * Math.PI) / 180
  const lonRad = ((lon - 180) * Math.PI) / 180
  return {
    x: Math.cos(latRad) * Math.sin(lonRad),
    y: Math.sin(latRad),
    z: Math.cos(latRad) * Math.cos(lonRad),
  }
}