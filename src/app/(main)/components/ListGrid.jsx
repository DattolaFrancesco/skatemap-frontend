'use client'
import { useRef, useEffect, useState } from "react";
import SpotCard from "../components/SpotCard";
import useSpotStore from "../store/SpotStore";
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import Details from "./Details";
import { usePathname } from "next/navigation";

gsap.registerPlugin(Draggable, InertiaPlugin)

const HIDDEN_PATHS = ["/donate", "/login", "/register"]

export default function ListGrid({ position, openList, onClose }) {
    const pathname = usePathname()
    const filteredSpot = useSpotStore((data) => data.filteredSpot)
    const listRef = useRef(null)
    const dragAreaRef = useRef(null)
    const savedY = useRef(0)
    const [windowSize, setWindowSize] = useState({ w: 0, h: 0 })
    const activeSpot = useSpotStore((data) => data.spot)
    const lastWidth = useRef(typeof window !== "undefined" ? window.innerWidth : 0)

    const isHiddenRoute = HIDDEN_PATHS.includes(pathname)

    useGSAP(() => {
        if (position !== "absolute") return
        if (isHiddenRoute) return
        if (!listRef.current || !dragAreaRef.current) return

        const existing = Draggable.get(listRef.current)
        if (existing) existing.kill()

        const minY = -(window.innerHeight - window.innerHeight * 0.4)
        const maxY = 0
        const CLOSE_THRESHOLD = 80
        const dragMaxY = maxY + CLOSE_THRESHOLD

        Draggable.create(listRef.current, {
            type: "y",
            trigger: dragAreaRef.current,
            bounds: { minY, maxY: dragMaxY },
            inertia: true,
            onDragEnd: function () {
                if (this.y >= dragMaxY - 5) {
                    savedY.current = maxY
                    this.disable()
                    gsap.to(listRef.current, {
                        y: window.innerHeight,
                        duration: 0.3,
                        ease: "power3.in",
                        onComplete: () => onClose && onClose()
                    })
                    return
                }
                savedY.current = this.y
            },
            snap: {
                y: (endValue) => {
                    if (endValue >= dragMaxY - 5) return endValue
                    const mid = (minY + maxY) / 2
                    const snapped = endValue < mid ? minY : maxY
                    savedY.current = snapped
                    return snapped
                }
            }
        })
    }, { scope: listRef, dependencies: [windowSize, isHiddenRoute] })

    useEffect(() => {
        if (position !== "absolute" || isHiddenRoute || !listRef.current) return

        const d = Draggable.get(listRef.current)
        if (openList) {
            if (d) d.enable()
            gsap.to(listRef.current, { y: savedY.current, duration: 0.45, ease: "power3.out" })
        } else {
            gsap.to(listRef.current, { y: window.innerHeight, duration: 0.3, ease: "power3.in" })
        }
    }, [openList, isHiddenRoute])

    useEffect(() => {
        if (position !== "absolute" || isHiddenRoute) return

        let resizeTimeout = null

        const handleResize = () => {
            clearTimeout(resizeTimeout)
            resizeTimeout = setTimeout(() => {
                const widthChanged = window.innerWidth !== lastWidth.current
                if (!widthChanged) return

                lastWidth.current = window.innerWidth
                savedY.current = 0
                gsap.set(listRef.current, { y: openList ? 0 : window.innerHeight })
                setWindowSize({ w: window.innerWidth, h: window.innerHeight })
            }, 150)
        }

        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
            clearTimeout(resizeTimeout)
        }
    }, [openList, isHiddenRoute])

    if (isHiddenRoute) return null

    if (position === "absolute") {
        return (
            <div
                ref={listRef}
                className="z-10 button--glass button fixed top-[70%] left-0 right-0 mx-auto p-1.5 mt-1 flex flex-col h-[calc(100dvh-75px)] w-[95%]"
                style={{ touchAction: "none" }}
            >
                <div
                    ref={dragAreaRef}
                    className="shrink-0 w-full flex items-center justify-center py-3 cursor-grab active:cursor-grabbing"
                    style={{ touchAction: "none" }}
                >
                    <div className="w-[50px] h-[4px] bg-black/20 rounded-2xl" />
                </div>
                <div
                    className="flex flex-col w-full overflow-y-scroll gap-1.5 rounded-[5px] pb-3"
                    style={{ touchAction: "pan-y" }}
                >
                    {filteredSpot?.length > 0 && !activeSpot && filteredSpot.map((s) => (
                        <SpotCard key={s.id} spot={s} />
                    ))}
                    {filteredSpot?.length === 0 && !activeSpot && (
                        <div className="w-full flex flex-col items-center justify-center gap-1 py-10 text-center color_p_gray">
                            <p className="text-sm">No spots found</p>
                            <p className="text-xs opacity-70">Try adjusting your search or filters</p>
                        </div>
                    )}
                    <Details postion={"mobile"} />
                </div>
            </div>
        )
    }

    if (filteredSpot?.length == 0) {
        return (
            <div className={`z-10 button--glass button p-1.5 mt-1 flex flex-col items-center justify-center gap-1 py-10 text-center color_p_gray ${pathname.includes("/dashboard") ? "max-h-[calc(100vh-100px)]" : "max-h-[calc(100vh-70px)]"} relative`}>
                <p className="text-sm">No spots found</p>
                <p className="text-xs opacity-70">Try adjusting your search or filters</p>
            </div>
        )
    }

    return (
        <div className={`z-10 button--glass button p-1.5 mt-1 flex flex-col gap-1.5 overflow-y-scroll ${pathname.includes("/dashboard") ? "max-h-[calc(100vh-100px)]" : "max-h-[calc(100vh-70px)]"} relative`}>
            {filteredSpot?.map((s) => (
                <SpotCard key={s.id} spot={s} />
            ))}
        </div>
    )
}