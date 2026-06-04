'use client'
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useNavigationStore from "../../store/NavigationStore";
import gsap from "gsap";
import { RxCross2 } from "react-icons/rx"
import { useGSAP } from "@gsap/react";
import TransitionLink from "../../components/TransitionLink";

export default function DonationSuccess() {
    const router = useRouter();
    const clearPendingHref = useNavigationStore((state) => state.clearPendingHref);
    const setStatusHref = useNavigationStore((state) => state.setStatusHref);
    const pendingHref = useNavigationStore((state) => state.pendingHref);
    const containerRef = useRef(null)
    const scopeContainerRef = useRef(null)

    setStatusHref(false)

    useGSAP(() => {
        if (!containerRef.current) return
        gsap.killTweensOf(containerRef.current)
        gsap.set(containerRef.current, { xPercent: -150 })
        gsap.to(containerRef.current, {
            xPercent: 0,
            duration: 0.75,
            ease: "power3.inOut",
            onComplete: () => { setStatusHref(false) }
        })
    }, { dependencies: [scopeContainerRef] })

    useEffect(() => {
        if (!pendingHref) return
        setStatusHref(true)
        gsap.killTweensOf(containerRef.current)
        gsap.to(containerRef.current, {
            xPercent: -150,
            duration: 0.75,
            ease: "power3.inOut",
            onComplete: () => {
                clearPendingHref()
                router.push(pendingHref)
            }
        })
    }, [pendingHref])

    return (
        <main ref={scopeContainerRef} className="flex justify-start items-start ps-2 flex flex-col">
            <div ref={containerRef} className="w-5/6 md:w-1/2">
                <div className="bg_login p-3">
                    <div className="flex justify-between">
                        <h1 className="text-4xl font-bold">THANK YOU</h1>
                        <TransitionLink className="nav-link" href="/"><RxCross2 size={38} /></TransitionLink>
                    </div>
                    <p className="text-base text-gray-600 font-bold mb-3">SKATE SPOT MAP</p>
                    <p className="leading-tight mt-5">
                        YOUR DONATION MEANS A LOT TO US.
                    </p>
                    <p className="leading-tight mt-3 text-gray-600">
                        EVERY CENT GOES DIRECTLY TO KEEPING THE SERVERS RUNNING AND THE MAP FREE FOR EVERY SKATER OUT THERE.
                        NO ADS, NO PAYWALLS — JUST SPOTS.
                    </p>
                    <div className="flex flex-col gap-2 mt-8">
                        <p className="text-xl font-bold">WHAT YOUR DONATION HELPS WITH</p>
                        <p className="text-sm text-gray-600">— UPGRADING THE SERVERS ONLINE</p>
                        <p className="text-sm text-gray-600">— FUTURE CHANCE TO ADD MORE PHOTOS AND CLIPS</p>
                        <p className="text-sm text-gray-600">— KEEPING THE MAP FREE AND AD-FREE</p>
                    </div>
                    <TransitionLink href="/" className="block bg-primary-500 w-full py-3 text-3xl font-bold text-center mt-8">
                        BACK TO THE MAP
                    </TransitionLink>
                </div>
            </div>
        </main>
    )
}