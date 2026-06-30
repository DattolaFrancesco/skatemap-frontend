'use client'
import { useRef, useEffect, useState, useLayoutEffect } from "react";
import SpotCard from "../components/SpotCard";
import useSpotStore from "../store/SpotStore";
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import Details from "./Details";
import { usePathname } from "next/navigation";

gsap.registerPlugin(Draggable, InertiaPlugin)

export default function ListGrid({ position, openList }) {
    const pathname = usePathname()
    const filteredSpot = useSpotStore((data) => data.filteredSpot)
    const listRef = useRef(null)
    const dragAreaRef = useRef(null)
    const savedY = useRef(0)
    const [windowSize, setWindowSize] = useState({ w: 0, h: 0 })
    const activeSpot = useSpotStore((data) => data.spot)

    useLayoutEffect(() => {
        if (position !== "absolute" || !listRef.current) return
        gsap.set(listRef.current, { y: window.innerHeight })
    }, [])

    useGSAP(() => {
        if (position !== "absolute") return
        if (!listRef.current || !dragAreaRef.current) return

        const existing = Draggable.get(listRef.current)
        if (existing) existing.kill()

        const minY = -(window.innerHeight - window.innerHeight * 0.4)
        const maxY = 0

        Draggable.create(listRef.current, {
            type: "y",
            trigger: dragAreaRef.current,
            bounds: { minY, maxY },
            inertia: true,
            onDragEnd: function () {
                savedY.current = this.y
            },
            snap: {
                y: (endValue) => {
                    const mid = (minY + maxY) / 2
                    const snapped = endValue < mid ? minY : maxY
                    savedY.current = snapped
                    return snapped
                }
            }
        })
    }, { scope: listRef, dependencies: [windowSize] })

    useEffect(() => {
        if (position !== "absolute" || !listRef.current) return
        if (openList) {
            gsap.to(listRef.current, {
                y: savedY.current,
                duration: 0.45,
                ease: "power3.out"
            })
        } else {
            gsap.to(listRef.current, {
                y: window.innerHeight,
                duration: 0.3,
                ease: "power3.in"
            })
        }
    }, [openList])

    useEffect(() => {
        if (position !== "absolute") return
        const handleResize = () => {
            savedY.current = 0
            gsap.set(listRef.current, { y: openList ? 0 : window.innerHeight })
            setWindowSize({ w: window.innerWidth, h: window.innerHeight })
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [openList])

    if (position === "absolute") {
        return (
            <div
                ref={listRef}
                className="z-10 button--glass button absolute top-[70%] left-0 right-0 mx-auto p-1.5 mt-1 flex flex-col h-[calc(100vh-75px)] w-[95%]"
            >
                <div
                    ref={dragAreaRef}
                    className="shrink-0 w-full flex items-center justify-center py-3 cursor-grab active:cursor-grabbing"
                >
                    <div className="w-[50px] h-[4px] bg-black/20 rounded-2xl" />
                </div>
                <div className="flex flex-col w-full overflow-y-scroll gap-1.5 rounded-[5px] pb-24">
                    {filteredSpot?.length > 0 && !activeSpot && filteredSpot.map((s) => (
                        <SpotCard key={s.id} spot={s} />
                    ))}
                    <Details postion={"mobile"} />
                </div>
            </div>
        )
    }

    if (filteredSpot?.length == 0) return null

    return (
        <div className={`z-10 button--glass button p-1.5 mt-1 flex flex-col gap-1.5 overflow-y-scroll ${pathname.includes("/dashboard") ? "max-h-[calc(100vh-100px)]" : "max-h-[calc(100vh-70px)]"} relative`}>
            {filteredSpot?.map((s) => (
                <SpotCard key={s.id} spot={s} />
            ))}
        </div>
    )
}