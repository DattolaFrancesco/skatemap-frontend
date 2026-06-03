'use client'

import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useRef, useEffect, useState, useCallback } from 'react'

export default function MiniGlobe({ lat, lng }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const [windowWidthCustom, setWindowWidthCustom] = useState(null)
  const [loaded, setLoaded] = useState(false)

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
        setLoaded(true)
    })

    return () => {
      mapInstance.current?.remove()
      mapInstance.current = null
    }
  }, [])
  const getZoom = useCallback(() => {
     if(!windowWidthCustom){
       if (window.innerWidth < 480) return 0.1   
       if (window.innerWidth > 1024) return 1  
       if (window.innerWidth > 1280) return 0.8   
       if (window.innerWidth > 1480) return 1   
       return 0.1
     }
     if (windowWidthCustom < 480) return 0.1  
     if (windowWidthCustom > 1024) return 1  
     if (windowWidthCustom > 1280) return 0.8  
     if (windowWidthCustom > 1480) return 1   
     return 0.1
   },[windowWidthCustom])
      useEffect(() => {
        const handleResize = () => {
            setWindowWidthCustom(window.innerWidth)
            mapInstance.current?.resize()
            mapInstance.current?.setZoom(getZoom())
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [getZoom])

    return( 
    <div className="aspect-square w-2/3 rounded-full overflow-hidden relative">
        {!loaded && (
            <div className="absolute inset-0 rounded-full bg-black flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-zinc-800 to-black animate-pulse flex items-center justify-center">
                    <div className="w-2/3 h-2/3 rounded-full border border-zinc-700 flex items-center justify-center">
                        <div className="w-1/3 h-1/3 rounded-full border border-zinc-600"/>
                    </div>
                </div>
            </div>
        )}
        <div ref={mapRef} className="w-full h-full" />
    </div>
    )
}
