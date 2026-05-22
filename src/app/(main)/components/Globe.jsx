'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import useInsetStore from "@/app/(main)/store/InsetStore"
import SpotDetails from './SpotDetails'


export default function Globe({ searchParams }) {
  // const 
  const [spot,setSpot] = useState(null)
  const [windowWidthCustom, setWindowWidthCustom] = useState(null)
  const mapInstance = useRef(null)
  const mapRef = useRef(null)
  const [mapReady, setMapReady] = useState(false)
  // store spot
  const setSpotOpen = useInsetStore((state)=>state.setSpotOpen)

  //fetch get spot come funziona usecallback?
   const getSpot = useCallback(async()=>{
    const params = await searchParams
    const query = new URLSearchParams(params)  
    const url = `${process.env.NEXT_PUBLIC_API_URL}/spots/globe/all?${query.toString()}`;
    try
    { const res = await fetch(url,{
        method:"GET",
         headers: {
            "Content-Type": "application/json",
    }
    })
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
     setSpot(data.content)
     console.log(data)
    }
    catch(error){
        console.log(error.message)
    }
   },[searchParams])
  // function usecallback thanks to that is not going to re rendere every time
  const getZoom = useCallback(() => {
    if(!windowWidthCustom){
    if (window.innerWidth < 480) return 0.8   
    if (window.innerWidth < 1024) return 1   
    if (window.innerWidth < 1280) return 1.2   
    if (window.innerWidth < 1480) return 1.5   
    return 2
    }
    if (windowWidthCustom < 480) return 0.8   
    if (windowWidthCustom < 1024) return 1   
    if (windowWidthCustom < 1280) return 1.2   
    if (windowWidthCustom < 1480) return 1.5   
    return 2
  },[windowWidthCustom])
   useEffect(() => {
      getSpot()
      setWindowWidthCustom(window.innerWidth)
      const handleResize = () => setWindowWidthCustom(window.innerWidth)
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [getSpot])
   useEffect(() => {
      if (!mapInstance.current) return
      if (!mapInstance.current.isStyleLoaded()) return
      mapInstance.current.jumpTo({ zoom: getZoom() })
    } , [windowWidthCustom])
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

    mapInstance.current.on('load', () => {
      mapInstance.current.setProjection({ type: 'globe' })
      mapInstance.current.setPaintProperty('Background', 'background-color', '#1a1a1a')
      mapInstance.current.setPaintProperty('Country border', 'line-color', '#2a2a2a')
      setMapReady(true)
    })
    return () => mapInstance.current.remove()
    }, [])
   useEffect(()=>{
    if(!spot || !mapReady) return
    if(mapInstance.current.getSource('spots')){
      mapInstance.current.getSource('spots').setData({
        type: 'FeatureCollection',
        features: spot.map(s => ({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [s.longitude, s.latitude]
        },
        properties: { spot: s }
    }))
    })
    }else{
          mapInstance.current.addSource('spots', {
          type: 'geojson',
          data: {
          type: 'FeatureCollection',
          features: spot.map(s => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [s.longitude, s.latitude]
            },
            properties: { spot: s }
            }))
    }
    })
        mapInstance.current.addLayer({  
    id: 'spots-layer',
    type: 'circle',
    source: 'spots',
    paint: {
        'circle-radius': 4,
        'circle-color': '#ffffff'
    }
    })
    //on click del marker
    mapInstance.current.on('click', 'spots-layer', (e) => {
    const feature = e.features[0]
    setSpotOpen(JSON.parse(feature.properties.spot))
    })
    // cursor pointer
    let popUp;
    mapInstance.current.on('mouseenter', 'spots-layer', (e) => {
    mapInstance.current.getCanvas().style.cursor = 'pointer'
    const params = JSON.parse(e.features[0].properties.spot);
       popUp = new maplibregl.Popup({ closeButton: false, closeOnClick: false })
        .setLngLat([params.longitude,params.latitude])
        .setHTML(`<img src="${params?.image[0]?.link}" class="popup-image"/>`)
        .addTo(mapInstance.current)
    })
    mapInstance.current.on('mouseleave', 'spots-layer', () => {
    mapInstance.current.getCanvas().style.cursor = ''
    popUp?.remove()
    })
    }

   },[mapReady,spot])
  return (
    <div className=' w-full flex justify-center items-center'>
      <SpotDetails/>
      <div className="aspect-square w_custom_globe rounded-full overflow-hidden">
        <div ref={mapRef} className="w-full h-full" />
      </div>
    </div>
  )
}