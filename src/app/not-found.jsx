'use client'

import { useRef } from "react"
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const route = useRouter()
  const mainRef = useRef(null)
  const tl = useRef()
  useGSAP(()=>{
    gsap.set(mainRef.current,{perspective:650, y:-window.innerHeight})
    gsap.set(".btn",{opacity:0})
    tl.current = gsap.timeline({paused:true,
        onReverseComplete: () => {
               route.push("/")
            }})
    tl.current.to(mainRef.current,{
      y:0,
      duration: 0.5,
      ease: "power2.out",
      onComplete: ()=>{
        gsap.to(".btn",{opacity:1})
      }
    })
    tl.current.play()
    const outerRX = gsap.quickTo(".logo", "rotationX", { ease: "power3" });
    const outerRY = gsap.quickTo(".logo", "rotationY", { ease: "power3" });
    mainRef.current.addEventListener("pointermove", (e) => {
      mainRef.current.addEventListener("pointermove", (e) => {
      outerRX(gsap.utils.interpolate(30, -30, e.y / window.innerHeight));
      outerRY(gsap.utils.interpolate(-30, 30, e.x / window.innerWidth));
    });

    mainRef.current.addEventListener("pointerleave", () => {
      outerRX(0);
      outerRY(0);
    });
    });
    },{scope:mainRef})
  return (
    <div ref={mainRef} className="w-screen h-screen flex justify-center items-center flex-col relative">
        <h1  className="text-5xl md:text-8xl font-sans logo bg-black/30 px-5 pt-1 pb-3 rounded-xl">404 — Page not found</h1>
        <button onClick={()=>tl.current.reverse()} className="absolute bottom-10 right-1/2 translate-x-1/2 p-2 md:py-2 md:px-5 btn">Return to Home</button>
    </div>
  )
}