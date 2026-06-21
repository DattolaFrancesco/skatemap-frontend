'use client'
import { use, useCallback, useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import useInsetStore from "@/app/(main)/store/InsetStore"
import useNavigationStore from '../store/NavigationStore'
import useSpotStore from '../store/SpotStore'
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";


export default function Globe({ searchParams }) {
  const [windowWidthCustom, setWindowWidthCustom] = useState(null)
  const mapInstance = useRef(null)
  const mapRef = useRef(null)
  const containerRef = useRef(null)
  const [mapReady, setMapReady] = useState(false)
  const setSpotOpen = useInsetStore((state)=>state.setSpotOpen)
  const router = useRouter();
  const pendingHref = useNavigationStore((state) => state.pendingHref);
  const clearPendingHref = useNavigationStore((state) => state.clearPendingHref);
  const setStatusHref = useNavigationStore((state) => state.setStatusHref);
  const coordsRef = useRef({ lng: 10 });
  const animatedRef = useRef(false)
  const [delay, setDelay] = useState(null)
  const resolvedParams = use(searchParams)
  const reset = useSpotStore((data)=>data.reset)
  const setReset = useSpotStore((data)=>data.setReset)
  const allSpots = useSpotStore((data)=>data.allSpots)
  const setFilteredSpotStore = useSpotStore((data)=>data.setFilteredSpot)
  const setAllSpots = useSpotStore((data)=>data.setAllSpots)
  const [filteredSpots, setFilteredSpots] = useState([]);
  
  useEffect(()=>{
      async function getAllSpot(){
        if(allSpots) return
        const url = `${process.env.NEXT_PUBLIC_API_URL}/spots/all/approved`;
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
           setAllSpots(data)
        } catch(error) {
            console.log(error.message)
            clearPendingHref()
            setStatusHref(false)
        }
    }
    getAllSpot()
  },[])
  useEffect(()=>{
    if(!allSpots) return
      const {risk,type,search,structure,continent} = resolvedParams
      let result = allSpots
      if(continent) result = result.filter(s=>s.continent === continent)
      if(risk) result = result.filter(s=>s.risk === risk)
      if(structure) result = result.filter(s=>s.spotTypes.includes(structure))
      if (type) {
        const structureArray = Array.isArray(type) ? type : [type]
        result = result.filter(s =>
          structureArray.some(t => s.spotTypes.includes(t))
        )
      }
      if(search) result = result.filter(s=>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.country.toLowerCase().includes(search.toLowerCase()) ||
          s.continent.toLowerCase().includes(search.toLowerCase()) ||
          s.city.toLowerCase().includes(search.toLowerCase())
      )
        setFilteredSpots(result)
        setFilteredSpotStore(result)
  },[resolvedParams, allSpots])

  const getZoom = useCallback(() => {
    if(!windowWidthCustom){
      if (window.innerWidth < 480) return 1.2   
      if (window.innerWidth < 720) return 1.3  
      if (window.innerWidth < 1024) return 1.5 
      if (window.innerWidth < 1280) return 1.8
      if (window.innerWidth < 1480) return 2
      return 2.2
    }
    if (windowWidthCustom < 480) return 1.2  
    if (windowWidthCustom < 720) return 1.3
    if (windowWidthCustom < 1024) return 1.5 
    if (windowWidthCustom < 1280) return 1.8 
    if (windowWidthCustom < 1480) return 2
    return 2.2
  },[windowWidthCustom])
  useEffect(() => {
  const timer = setTimeout(() => {
    setDelay(true)
  }, 500)
  return () => clearTimeout(timer)
}, [])
useEffect(() => {
  if (mapReady) setDelay(false)
}, [mapReady])
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
      style: `https://api.maptiler.com/maps/dataviz-light/style.json?key=WvVUBxCG2IWaZflw6QsZ`,
      zoom: getZoom(),
      minZoom: 0.8,
      center: [10, 40],
      attributionControl: false,
    })
    mapInstance.current.on('load', () => {
      mapInstance.current.setProjection({ type: 'globe' })
      mapInstance.current.setPaintProperty('Background', 'background-color', '#1E222A')
      mapInstance.current.setPaintProperty('Water', 'fill-color', '#9b9da1')
      mapInstance.current.setPaintProperty('Country border', 'line-color', '#2a2a2a')
      mapInstance.current.removeLayer('Residential', 'fill-color', '#9b9b9b')
      mapInstance.current.setPaintProperty('Landcover', 'fill-color', '#9b9b9b')
      mapInstance.current.removeLayer('Forest', 'fill-color', '#f30000')
      mapInstance.current.removeLayer('Stadium', 'fill-color', '#f30000')
      mapInstance.current.removeLayer('Cemetery', 'fill-color', '#f30000')
      mapInstance.current.setPaintProperty('Road network outline', 'line-color', '#9b9b9b')
      mapInstance.current.setPaintProperty('Road network', 'line-color', '#9b9b9b')
      mapInstance.current.setPaintProperty('Country border', 'line-color', '#909090')
      setMapReady(true)
    })
    return () => mapInstance.current.remove()
  }, [])
useEffect(()=>{
    if(!filteredSpots || !mapReady) return
    
    if(mapInstance.current.getSource('spots')){
        mapInstance.current.getSource('spots').setData({
            type: 'FeatureCollection',
            features: filteredSpots.map(s => ({
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [s.longitude, s.latitude] },
                properties: { spot: s }
            }))
        })
    } else {
        mapInstance.current.addSource('spots', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: filteredSpots.map(s => ({
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [s.longitude, s.latitude] },
                    properties: { spot: s }
                }))
            }
        })
        mapInstance.current.addLayer({
            id: 'spots-layer',
            type: 'circle',
            source: 'spots',
            paint: { 'circle-radius': 4, 'circle-color': '#d7dbd4' }
        })
        if(windowWidthCustom >= 1024){
            mapInstance.current.on('click', 'spots-layer', (e) => {
                const feature = e.features[0]
                const parsed = JSON.parse(feature.properties.spot)
                setSpotOpen(parsed.id)
            })
            let popUp;
            mapInstance.current.on('mouseenter', 'spots-layer', (e) => {
                mapInstance.current.getCanvas().style.cursor = 'pointer'
                const params = JSON.parse(e.features[0].properties.spot);
                popUp = new maplibregl.Popup({ closeButton: false, closeOnClick: false })
                    .setLngLat([params.longitude, params.latitude])
                    .setHTML(`<img src="${params?.thumbnailUrl}" class="popup-image"/>`)
                    .addTo(mapInstance.current)
            })
            mapInstance.current.on('mouseleave', 'spots-layer', () => {
                mapInstance.current.getCanvas().style.cursor = ''
                popUp?.remove()
            })
        } else{
           mapInstance.current.on('click', 'spots-layer', (e) => {
                const feature = e.features[0]
                const parsed = JSON.parse(feature.properties.spot)
                setSpotOpen(parsed.id)
            })
        }

    }

    if(reset) setReset(false)  

},[mapReady, filteredSpots])
  useEffect(() => {

  if (!mapInstance.current || !mapReady) return;

  if (mapInstance.current.getLayer("spots-layer")) {
    mapInstance.current.setPaintProperty(
      "spots-layer",
      "circle-color",
      '#d7dbd4'
    );
  }

}, [ mapReady]);
useEffect(() => {
  if (!pendingHref) return
  setStatusHref(true)
  gsap.killTweensOf(coordsRef.current)
  gsap.killTweensOf(containerRef.current)
  gsap.to(coordsRef.current, {
    lng: -180,
    duration: 0.75,
    ease: "power1",
    onUpdate: () => {
      if (!mapInstance.current) return
      mapInstance.current.setCenter([
        coordsRef.current.lng % 360,
        40
      ])
    },
  })
  gsap.to(containerRef.current, {
    yPercent: 200,
    duration: 0.75,
    ease: "power3.inOut",

    onComplete: () => {
      clearPendingHref()
      router.push(pendingHref)
    }
  })
}, [pendingHref])

useGSAP(() => {
  if (!mapReady) return
  if (animatedRef.current) return
  animatedRef.current = true
  gsap.killTweensOf(coordsRef.current)
  gsap.set(containerRef.current, {
    yPercent: 200
  })
  gsap.to(coordsRef.current, {
    lng: 360,
    duration: 1.5,
    ease: "power1",
    onUpdate: () => {
      if (!mapInstance.current) return

      mapInstance.current.setCenter([
        coordsRef.current.lng % 360,
        40
      ])
    },
  })
  gsap.to(containerRef.current, {
    yPercent: 0,
    duration: 1.5,
    ease: "power3.inOut",
    onComplete:()=>{
        setStatusHref(false)
        coordsRef.current = { lng: 10 }
    }
  })
  gsap.to(mapRef.current, {
    opacity:1,
    ease: "power3.inOut",
  })

}, { dependencies: [mapReady] })
  return (
    <>
    <div  className={`absolute top-[-50%] translate-y-1/2 bg-image justify-center w-full h-full flex flex-col  items-center`}>
      <div ref={containerRef} className="aspect-square w_custom_globe rounded-full overflow-hidden relative ">
        {!mapReady && (
          <div className={`absolute inset-0 rounded-full bg-[#1a1a1a] flex items-center justify-center z-10 ${delay ? "animate-pulse": "opacity-0" }`}>
            <div className="w-3/4 h-3/4 rounded-full border border-white/5" />
            <div className="absolute w-1/2 h-px bg-white/5" />
            <div className="absolute w-px h-1/2 bg-white/5" />
          </div>
        )} 
        <div ref={mapRef} className="w-full h-full opacity-0" />
      </div>
    </div>
  </>
  )
}