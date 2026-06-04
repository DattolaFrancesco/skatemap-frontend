'use client'
import { useEffect, useState, useRef } from "react";
import { Elements} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Checkoutpage from "./components/CheckoutPage";
import { useRouter } from "next/navigation";
import useNavigationStore from "../store/NavigationStore";
import gsap from "gsap";
import { RxCross2 } from "react-icons/rx"
import { useGSAP } from "@gsap/react";
import TransitionLink from "../components/TransitionLink";


let stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function Donate(){
    const [amount, setAmount] = useState(5)
    const [openCustom, setOpenCustom] = useState(false)
    const [clientSecret, setClientSecret] = useState(null)
    const router = useRouter();
    const clearPendingHref = useNavigationStore((state) => state.clearPendingHref);
    const setStatusHref = useNavigationStore((state) => state.setStatusHref);
    const pendingHref = useNavigationStore((state) => state.pendingHref);
    const containerRef = useRef(null)
    const scopeContainerRef = useRef(null)
    const appearance = {
        theme: 'none',
        variables: {
            colorPrimary: '#000000',
            colorBackground: '#ffffff',
            colorText: '#000000',
            colorDanger: '#ff0000',
            fontFamily: 'monospace',
            borderRadius: '0px',
            spacingUnit: '4px',
        },
        rules: {
            '.Input': {
            border: '2px solid #000000',
            padding: '12px',
            fontSize: '16px',
            },
            '.Input:focus': {
            outline: '2px solid #000000',
            boxShadow: 'none',
            },
            '.Label': {
            fontWeight: 'bold',
            fontSize: '12px',
            letterSpacing: '0.1em',
            },
            '.Tab': {
            border: '2px solid #000000',
            borderRadius: '0px',
            },
            '.Tab--selected': {
            backgroundColor: '#000000',
            color: '#ffffff',
            },
        }
        }
    setStatusHref(false)

    async function handleCreatePaymentIntent(){
         const url = `${process.env.NEXT_PUBLIC_API_URL}/donations`
         try {
             const res = await fetch(url, {
                 method: "POST",
                 headers: { "Content-Type": "application/json" },
                 body: JSON.stringify({amount : amount})
             })
             const data = await res.json()
             if (!res.ok) throw new Error(data.message)
                setClientSecret(data.clientSecret)
         } catch (error) {
             console.log(error.message)
         }
     }

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
    return(
        <main ref={scopeContainerRef} className="flex justify-start items-start ps-2 flex flex-col">
           <div ref={containerRef} className="w-5/6 md:w-1/2">
               {!clientSecret 
               ?
            <div className="bg_login p-3">
                <div className="flex justify-between">
                    <h1 className="text-4xl font-bold">DONATE</h1>
                    <TransitionLink className="nav-link" href="/"><RxCross2 size={38}/></TransitionLink>
                </div>
                <p className="text-base text-gray-600font-bold mb-3">SKATE SPOT MAP</p>
                <p className="leading-tight">A community-built, open map of the best skate spots in town
                     — ledges, rails, and more. No ads, no paywalls.
                      Every donation keeps the servers running and helps local skaters add new spots, photos and clips.
                </p>
                <p  className="text-xl font-bold my-5">CHOOSE AN AMOUNT</p>
                <article className="flex gap-3">
                    <button onClick={()=>setAmount(5)} className="w-1/3 aspect-video bg-white ">
                        <p className="bg-transparent text-4xl">€5</p><p className="bg-transparent text-xs md:text-sm text-gray-600">A COFFEE</p></button>
                    <button onClick={()=>setAmount(15)} className="w-1/3 bg-white ">
                        <p className="bg-transparent text-4xl">€15</p><p className="bg-transparent text-xs md:text-sm text-gray-600">NEW WAX</p></button>
                    <button onClick={()=>setAmount(30)} className="w-1/3 bg-white ">
                        <p className="bg-transparent text-4xl">€30</p><p className="bg-transparent text-xs md:text-sm text-gray-600">FUND A DIY SPOT</p></button>
                </article>
                <button onClick={()=>setOpenCustom(!openCustom)} className="mt-3 w-full text-start bg-white text-xl py-3 font-bold">{openCustom ? "-": "+"} CUSTOM AMOUNT</button>
                <input type="number" onChange={(e)=>setAmount(e.currentTarget.valueAsNumber)} value={amount}
                  className={` ${openCustom ? "h-[50px] opacity-100" : "h-0 opacity-0"} bg-white w-full mt-1 transition-all duration-300 mb-5`}/>
                <p className="mb-5 text-sm md:text-base">100% GOES TO KEEP THE PROJECT LIVE AND ADS FREE</p>
                <button onClick={handleCreatePaymentIntent} className="bg-primary-500 w-full py-3 text-3xl font-bold">DONATE €{ isNaN(amount)  ? 0 : Math.floor(amount)}</button>
            </div>
               : 
              <div>
                    
                   <div className="bg_login p-3">
                        <div className="flex justify-between mb-3">
                            <h1 className="text-2xl md:text-4xl font-bold">SELECT A PAYMENT METHOD</h1>
                            <button onClick={()=>setClientSecret(null)} className="text-xl md:text-2xl font-bold"> BACK</button>
                        </div>
                       <Elements stripe={stripePromise} options={{clientSecret, appearance}}>
                            <Checkoutpage amount={amount}/>
                        </Elements>
                   </div>
              </div>
                }
           </div>
        </main>
    )

}