'use client'
import { useEffect, useState } from "react";
import { Elements} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Checkoutpage from "./components/CheckoutPage";
import { useRouter } from "next/navigation";
import useNavigationStore from "../store/NavigationStore";


let stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function Donate(){
    const [amount, setAmount] = useState(5)
    const [customAmount, setCustomAmount] = useState(5)
    const [clientSecret, setClientSecret] = useState(null)
    const router = useRouter();
    const pendingHref = useNavigationStore((state) => state.pendingHref);
    const clearPendingHref = useNavigationStore((state) => state.clearPendingHref);
    //const setStatusHref = useNavigationStore((state) => state.setStatusHref);

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
     useEffect(()=>{
        if(!pendingHref) return
         clearPendingHref()
         router.push(pendingHref)
     },[pendingHref])
    return(
        <main className="flex justify-center items-center flex flex-col">
            <h1>DONATE</h1>
           <div className="w-1/2">
               {!clientSecret 
               ?
              <div>
                <div>
                    <button onClick={()=>setAmount(5)}>5</button>
                    <button onClick={()=>setAmount(10)}>10</button>
                    <button onClick={()=>setAmount(20)}>20</button>
                </div>
                    <button onClick={handleCreatePaymentIntent}>dona {amount}</button>
                </div>
               : 
              <div>
                    <button onClick={()=>setClientSecret(null)}>back</button>
                   <Elements stripe={stripePromise} options={{clientSecret}}>
                        <Checkoutpage/>
                    </Elements>
              </div>
                }
           </div>
        </main>
    )

}