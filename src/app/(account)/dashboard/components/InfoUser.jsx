'use client'
import { useEffect, useRef, useState } from "react";
import useUserStore from "./UserStore";
import useSpotStore from "@/app/(main)/store/SpotStore";
import { useRouter } from 'next/navigation';
import useThemeStore from "./ThemesStore";
import TransitionLink from "@/app/(main)/components/TransitionLink";
import { Settings, X } from 'lucide-react';
import useNavigationStore from "@/app/(main)/store/NavigationStore";
import { usePathname } from "next/navigation";
import gsap from "gsap";

const INIT_H = 32
const TARGET_W = 100

export default function InfoUser({ searchParams }) {
    const setUser = useUserStore((data) => data.setUser)
    const user = useUserStore((data) => data.user)
    const refresh = useUserStore((data) => data.refresh)
    const bgTheme = useThemeStore((data) => data.bgTheme)
    const statusHref = useNavigationStore((state) => state.statusHref)
    const setAllSpots = useSpotStore((s) => s.setAllSpots)
    const setFilteredSpot = useSpotStore((s) => s.setFilteredSpot)
    const setSpot = useSpotStore((s) => s.setSpot)
    const router = useRouter()
    const pathname = usePathname()
    const [menuOpen, setMenuOpen] = useState(false)
    const panelRef = useRef(null)
    const role = user?.authorities?.[0]
    const isAdmin = role === "admin" || role === "super_admin"
    const isSuperAdmin = role === "super_admin"

    async function getUser() {
        const token = localStorage.getItem('token')
        const url = `${process.env.NEXT_PUBLIC_API_URL}/account/minimal`
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            setUser(data)
        } catch (err) {
            router.push("/login")
            console.log(err.message)
        }
    }

    useEffect(() => { getUser() }, [refresh])
    useEffect(() => {}, [bgTheme])

    useEffect(() => {
        if (!panelRef.current) return
        close()
    }, [pathname])

    function open() {
        setMenuOpen(true)
        gsap.to(panelRef.current, {
            width: TARGET_W,
            duration: 0.35,
            ease: "power3.out",
            onComplete: () => {
                gsap.to(panelRef.current, {
                    height: panelRef.current.scrollHeight,
                    duration: 0.4,
                    ease: "power3.out"
                })
            }
        })
    }

    function close(cb) {
        if (!panelRef.current) return
        gsap.to(panelRef.current, {
            height: INIT_H,
            duration: 0.25,
            ease: "power3.in",
            onComplete: () => {
                gsap.to(panelRef.current, {
                    width: 0,
                    duration: 0.3,
                    ease: "power3.in",
                    onComplete: () => {
                        setMenuOpen(false)
                        cb && cb()
                    }
                })
            }
        })
    }

    const links = [
        { href: "/dashboard", label: "My spots", always: true },
        { href: "/dashboard/allSpot", label: "All spots", show: isAdmin },
        { href: "/dashboard/favourites", label: "Fav", always: true },
        { href: "/dashboard/requests", label: "Requests", show: isAdmin, badge: user?.existPending > 0 },
        { href: "/dashboard/users", label: "Users", show: isSuperAdmin },
        { href: "/dashboard/settings", label: "Settings", always: true },
        { href: "/spot/registration", label: "Add spot", always: true },
        { href: "/", label: "Home", always: true },
    ].filter(l => l.always || l.show)

    if (!user) return (
        <div className="w-full flex items-center gap-2 py-2">
            <div className="h-4 w-24 bg-black/20 animate-pulse rounded-[5px]" />
            <div className="h-4 w-12 bg-black/20 animate-pulse rounded-[5px]" />
            <div className="h-4 w-12 bg-black/20 animate-pulse rounded-[5px]" />
            <div className="h-[18px] w-8 bg-black/20 animate-pulse rounded-[5px] ms-auto" />
        </div>
    )

    return (
        <div className="w-full flex items-center gap-3 pt-1.5 z-999">
            <div className="button--glass button p-1.5 flex gap-1.5">
                <div className="bg_login rounded-[5px]">
                    <p className="font-bold whitespace-nowrap px-1">{user.username}</p>
                </div>
                <div className="bg_login rounded-[5px] bg_activated_light color_login">
                    <p className="whitespace-nowrap px-1">[{user.nOfSpots}] spots</p>
                </div>
                <div className="bg_login rounded-[5px] bg_activated_light color_login">
                    <p className="whitespace-nowrap px-1">[{user.nOfFav}] fav</p>
                </div>
            </div>

            <div className="ms-auto relative flex items-center">
                <div
                    ref={panelRef}
                    className="absolute right-0 top-0 overflow-hidden button--glass button rounded-[5px]"
                    style={{ width: 0, height: INIT_H }}
                >
                    <div className="flex flex-col p-1 gap-1.5">
                        {links.map(l => {
                            const isActive = pathname === l.href
                            return (
                                <div key={l.href} className="relative flex items-center">
                                    {isActive ? (
                                        <span
                                            aria-current="page"
                                            className="w-full rounded-[5px] text-center text-[12px] whitespace-nowrap cursor-default bg_activated_light color_login font-bold"
                                        >
                                            {l.label}
                                        </span>
                                    ) : (
                                        <TransitionLink
                                            href={l.href}
                                            className="w-full rounded-[5px] text-[12px] whitespace-nowrap transition-colors duration-150 hover:bg-black/10"
                                        >
                                            {l.label}
                                        </TransitionLink>
                                    )}
                                    {l.badge && <div className="absolute w-2 h-2 rounded-full bg-red-500 top-0 right-0 animate-pulse" />}
                                </div>
                            )
                        })}
                        <TransitionLink
                            href="/login"
                            className="w-full rounded-[5px] text-[12px] whitespace-nowrap transition-colors duration-150 hover:bg-black/10"
                        >
                            Log out
                        </TransitionLink>
                        <button
                            onClick={() => close()}
                            className="w-fit rounded-[5px] text-[12px] whitespace-nowrap text-left hover:bg-black/10 transition-colors duration-150"
                        >
                            <p>Close</p>
                        </button>
                    </div>
                </div>

                <div className={`relative z-10 p-1.5 ${menuOpen ? "" : "button--glass button"} bg-transparent rounded-[5px] flex flex-col gap-[5px] justify-center items-center`}>
                    <button
                        onClick={() => menuOpen ? close() : open()}
                        className={`${menuOpen ? "invisible" : "bg_login"} aspect-square rounded-[5px]`}
                    >
                        {!menuOpen ? <Settings size={10} /> : <X size={10} />}
                    </button>
                </div>
            </div>
        </div>
    )
}