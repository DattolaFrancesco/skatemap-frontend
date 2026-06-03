'use client'

import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useRef, useEffect, useState, useCallback } from 'react'

export default function MiniGlobe({ lat, lng }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const [windowWidthCustom, setWindowWidthCustom] = useState(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return
    mapInstance.current = new maplibregl.Map({
      container: mapRef.current,
      style: `https://api.maptiler.com/maps/backdrop/style.json?key=WvVUBxCG2IWaZflw6QsZ`,
      center: [lng, lat],
      zoom: getZoom(),
      minZoom: 0.1,
      attributionControl: false,
      //interactive: false,
    })

    mapInstance.current.on('load', () => {
       const style = mapInstance.current.getStyle()
        style.layers.forEach(layer => {
            if (layer.type === 'symbol' || layer.type === 'line') {
            if (mapInstance.current.getLayer(layer.id)) {
                mapInstance.current.removeLayer(layer.id)
            }
            }
        })
      mapInstance.current.setProjection({ type: 'globe' })
        mapInstance.current.setPaintProperty('Background', 'background-color', '#000000')
        mapInstance.current.setPaintProperty('Water', 'fill-color', '#303030')
        mapInstance.current.setPaintProperty('Water shadow', 'fill-color', '#1a1a1a')
      

        const el = document.createElement('div')
        el.className = 'relative flex items-center justify-center bg-primary-500 w-2.5 h-2.5 rounded-full animate-pulse'
        new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([lng, lat])
        .addTo(mapInstance.current)
    })

    return () => {
      mapInstance.current?.remove()
      mapInstance.current = null
    }
  }, [])
   const getZoom = useCallback(() => {
      if(!windowWidthCustom){
        if (window.innerWidth < 480) return 0.1   
        if (window.innerWidth < 1024) return 0.5   
        if (window.innerWidth < 1280) return 0.8   
        if (window.innerWidth < 1480) return 1   
        return 0.1
      }
      if (windowWidthCustom < 480) return 0.1  
      if (windowWidthCustom < 1024) return 0.5  
      if (windowWidthCustom < 1280) return 0.8  
      if (windowWidthCustom < 1480) return 1   
      return 0.1
    },[windowWidthCustom])

  return( 
     <div className="aspect-square w_custom_globe rounded-full overflow-hidden">
        <div ref={mapRef} className="w-full h-full" />
    </div>
)
}