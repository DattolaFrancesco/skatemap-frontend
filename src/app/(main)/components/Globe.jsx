'use client'
import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export default function Globe({ searchParams }) {
  const [spot,setSpot] = useState(null)
  const [windowWidthCustom, setWindowWidthCustom] = useState(null)
  const mapInstance = useRef(null)
  const mapRef = useRef(null)
   async function getSpot(){
    const params = await searchParams
    const query = new URLSearchParams(params)  
    const url = `http://localhost:3003/spots/all?${query.toString()}`;
    try
    { const res = await fetch(url,{
        method:"GET",
         headers: {
            "Content-Type": "application/json",
    }
    })
    const data = await res.json();
    console.log(data)
    setSpot(data.content)
    if (!res.ok) throw new Error(data.message);
    }
    catch(error){
        console.log(error.message)
    }
   }
  const getZoom = () => {
    if (window.innerWidth < 480) return 0.8   
    if (window.innerWidth < 1024) return 1   
    if (window.innerWidth < 1280) return 1.2   
    if (window.innerWidth < 1480) return 1.3   
    return 1.8
}
   useEffect(()=>{
    getSpot()
    console.log(".")
   },[])
   useEffect(() => {
    setWindowWidthCustom(window.innerWidth)
    const handleResize = () => setWindowWidthCustom(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
}, [])
useEffect(() => {
    if (!mapInstance.current) return
    if (!mapInstance.current.isStyleLoaded()) return
    mapInstance.current.jumpTo({ zoom: getZoom() })
}, [windowWidthCustom])
  useEffect(() => {
    if (!mapRef.current) return
    mapInstance.current = new maplibregl.Map({
      container: mapRef.current,
      style: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=WvVUBxCG2IWaZflw6QsZ`,
      zoom: getZoom(),
      minZoom: 0.8,
      center: [10, 40],
      attributionControl: false,
    })

    mapInstance.current.on('style.load', () => {
      mapInstance.current.setProjection({ type: 'globe' })
      mapInstance.current.setPaintProperty('background', 'background-color', '#0c0c0c')
      mapInstance.current.setPaintProperty('countries-fill', 'fill-color', '#1c1c1c')
      mapInstance.current.setPaintProperty('countries-boundary', 'line-color', '#2a2a2a')
    })
    return () => mapInstance.current.remove()
  }, [spot])

  return (
    <div className="aspect-square w_custom_globe rounded-full overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}