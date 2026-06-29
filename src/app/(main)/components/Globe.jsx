'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import useNavigationStore from '../store/NavigationStore'
import useSpotStore from '../store/SpotStore'
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

export default function Globe() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [windowWidthCustom, setWindowWidthCustom] = useState(null)
    const mapInstance = useRef(null)
    const mapRef = useRef(null)
    const containerRef = useRef(null)
    const [mapReady, setMapReady] = useState(false)
    const router = useRouter()
    const pendingHref = useNavigationStore((state) => state.pendingHref)
    const clearPendingHref = useNavigationStore((state) => state.clearPendingHref)
    const setStatusHref = useNavigationStore((state) => state.setStatusHref)
    const coordsRef = useRef({ lng: 10 })
    const animatedRef = useRef(false)
    const [delay, setDelay] = useState(null)
    const reset = useSpotStore((data) => data.reset)
    const setReset = useSpotStore((data) => data.setReset)
    const allSpots = useSpotStore((data) => data.allSpots)
    const setActiveSpot = useSpotStore((data) => data.setSpot)
    const activeSpot = useSpotStore((data) => data.spot)
    const setAllSpots = useSpotStore((data) => data.setAllSpots)
    const setFilteredSpotStore = useSpotStore((data) => data.setFilteredSpot)
    const filteredSpotStore = useSpotStore((data) => data.filteredSpot)
    const setOpenList = useSpotStore((data) => data.setOpenList)
    const [filteredSpots, setFilteredSpots] = useState([])

  useEffect(() => {
      async function getAllSpot() {
          const url = `${process.env.NEXT_PUBLIC_API_URL}/spots/all/approved`
          try {
              const res = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } })
              const data = await res.json()
              if (!res.ok) throw new Error(data.message)
              setAllSpots(data)
              setFilteredSpotStore(data)
          } catch (error) {
              console.log(error.message)
              clearPendingHref()
              setStatusHref(false)
          }
      }
      if (!pathname.includes("/dashboard")) {
          setAllSpots(null)
          getAllSpot()
      }
  }, [])

    useEffect(() => {
        if (!Array.isArray(allSpots)) return
        const type = searchParams.getAll('type')
        const structure = searchParams.getAll('structure')
        const search = searchParams.get('search')
        const selectedSpot = searchParams.get('selectedSpot')
        const status = searchParams.getAll('status')
        if (selectedSpot) setActiveSpot(selectedSpot)
        let result = [...allSpots]
        if (status.length > 0) {
            result = result.filter(s => status.some(t => s.status.includes(t)))
        }
        if (structure.length > 0) {
            result = result.filter(s => structure.every(t => s.spotTypes.includes(t)))
        }
        if (type.length > 0) {
            result = result.filter(s => type.some(t => s.spotTypes.includes(t)))
        }
        if (search) {
            result = result.filter(s =>
                s.name.toLowerCase().includes(search.toLowerCase()) ||
                s.country.toLowerCase().includes(search.toLowerCase()) ||
                s.continent.toLowerCase().includes(search.toLowerCase()) ||
                s.city.toLowerCase().includes(search.toLowerCase())
            )
        }
        setFilteredSpots(result)
        setFilteredSpotStore(result)
    }, [searchParams, allSpots])

    const getZoom = useCallback(() => {
        const w = windowWidthCustom ?? (typeof window !== 'undefined' ? window.innerWidth : 1280)
        if (w < 480) return 1.2
        if (w < 720) return 1.3
        if (w < 1024) return 1.5
        if (w < 1280) return 1.8
        if (w < 1480) return 2
        return 2.2
    }, [windowWidthCustom])

    useEffect(() => {
        const timer = setTimeout(() => setDelay(true), 500)
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
        if (!mapInstance.current || !activeSpot) return
        const spot = filteredSpots.find(s => s.id === activeSpot)
        if (!spot) return
        mapInstance.current.flyTo({
            center: [spot.longitude, spot.latitude],
            duration: 1200,
            zoom: getZoom()
        })
    }, [activeSpot, filteredSpots])

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

    useEffect(() => {
        if (!mapReady || !mapInstance.current.getLayer("spots-layer")) return
        mapInstance.current.setPaintProperty("spots-layer", "circle-color", [
            "case",
            ["==", ["get", "id"], activeSpot],
            "#5eff00",
            "#d7dbd4"
        ])
    }, [activeSpot, mapReady])

    useEffect(() => {
        if (!filteredSpots || !mapReady) return
        if (mapInstance.current.getSource('spots')) {
            mapInstance.current.getSource('spots').setData({
                type: 'FeatureCollection',
                features: filteredSpots.map(s => ({
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [s.longitude, s.latitude] },
                    properties: { spot: s, id: s.id }
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
                        properties: { spot: s, id: s.id }
                    }))
                }
            })
            mapInstance.current.addLayer({
                id: 'spots-layer',
                type: 'circle',
                source: 'spots',
                paint: {
                    "circle-radius": 5,
                    "circle-color": [
                        "case",
                        ["==", ["get", "id"], activeSpot],
                        "#ff0000",
                        "#d7dbd4"
                    ]
                }
            })
            if (windowWidthCustom >= 1024) {
                mapInstance.current.on('click', 'spots-layer', (e) => {
                    const feature = e.features[0]
                    const parsed = JSON.parse(feature.properties.spot)
                    const p = new URLSearchParams(window.location.search)
                    p.set("selectedSpot", parsed.id)
                    router.push(`?${p.toString()}`, { scroll: false })
                    setOpenList(true)
                })
                mapInstance.current.on('mouseenter', 'spots-layer', () => {
                    mapInstance.current.getCanvas().style.cursor = 'pointer'
                })
                mapInstance.current.on('mouseleave', 'spots-layer', () => {
                    mapInstance.current.getCanvas().style.cursor = ''
                })
            } else {
                mapInstance.current.on('click', 'spots-layer', (e) => {
                    const feature = e.features[0]
                    const parsed = JSON.parse(feature.properties.spot)
                    const p = new URLSearchParams(window.location.search)
                    p.set("selectedSpot", parsed.id)
                    router.push(`?${p.toString()}`, { scroll: false })
                })
            }
        }
        if (reset) setReset(false)
    }, [mapReady, filteredSpots])

    useEffect(() => {
        if (!mapInstance.current || !mapReady) return
        if (mapInstance.current.getLayer("spots-layer")) {
            mapInstance.current.setPaintProperty("spots-layer", "circle-color", '#d7dbd4')
        }
    }, [mapReady])

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
                mapInstance.current.setCenter([coordsRef.current.lng % 360, 40])
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
        gsap.set(containerRef.current, { yPercent: 200 })
        gsap.to(coordsRef.current, {
            lng: 360,
            duration: 1.5,
            ease: "power1",
            onUpdate: () => {
                if (!mapInstance.current) return
                mapInstance.current.setCenter([coordsRef.current.lng % 360, 40])
            },
        })
        gsap.to(containerRef.current, {
            yPercent: 0,
            duration: 1.5,
            ease: "power3.inOut",
            onComplete: () => {
                setStatusHref(false)
                coordsRef.current = { lng: 10 }
            }
        })
        gsap.to(mapRef.current, { opacity: 1, ease: "power3.inOut" })
    }, { dependencies: [mapReady] })

    return (
        <>
            <div className="absolute top-[-50%] translate-y-1/2 bg-image justify-center w-full h-full flex flex-col items-center">
                <div ref={containerRef} className="aspect-square w_custom_globe rounded-full overflow-hidden relative">
                    {!mapReady && (
                        <div className={`absolute inset-0 rounded-full bg-[#1a1a1a] flex items-center justify-center z-10 ${delay ? "animate-pulse" : "opacity-0"}`}>
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