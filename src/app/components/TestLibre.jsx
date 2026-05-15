'use client'
import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const CITIES = [
  { name: 'Tokyo',         lat: 35.6895,  lng: 139.6917 },
  { name: 'New York',      lat: 40.7128,  lng: -74.006  },
  { name: 'London',        lat: 51.5074,  lng: -0.1276  },
  { name: 'Dubai',         lat: 25.2048,  lng: 55.2708  },
  { name: 'Sydney',        lat: -33.868,  lng: 151.209  },
]

export default function Globe() {
  const mapRef = useRef(null)

  useEffect(() => {
    if (!mapRef.current) return

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=WvVUBxCG2IWaZflw6QsZ`,
      zoom: 1.8,
      minZoom: 1.6,
      center: [10, 40],
      attributionControl: false,
    })

    map.on('style.load', () => {
      map.setProjection({ type: 'globe' })
      map.setPaintProperty('background', 'background-color', '#0c0c0c')
      map.setPaintProperty('countries-fill', 'fill-color', '#1c1c1c')
      map.setPaintProperty('countries-boundary', 'line-color', '#2a2a2a')
      map.setFog({
        color: '#000000',
        'high-color': '#000000',
        'horizon-blend': 0.1,
        'space-color': '#000000',
        'star-intensity': 0.3,
      })
    })

    map.on('load', () => {
      const markers = CITIES.map(city => {
        const el = document.createElement('div')
        el.style.cssText = `
          width: 6px;
          height: 6px;
          background: #ffffff;
        `
        const tooltip = document.createElement('div')
tooltip.style.cssText = `
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 11px;
  opacity: 0;
`
tooltip.textContent = city.name
el.appendChild(tooltip)
el.addEventListener('mouseenter', () => {
  tooltip.style.opacity = '1'
})
el.addEventListener('mouseleave', () => {
  tooltip.style.opacity = '0'
})
        const marker = new maplibregl.Marker({ element: el, anchor: 'center',opacityWhenCovered: '0' })
          .setLngLat([city.lng, city.lat])
          .addTo(map)
        return marker
      })
    })

    return () => map.remove()
  }, [])

  return (
    <div className="aspect-square w-[45%] rounded-full overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}