 'use client'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'

 export default function Checkoutpage({amount}){
    const stripe = useStripe()
    const elements = useElements()

    async function handleSubmit(e){
        e.preventDefault()
        await stripe.confirmPayment({
            elements,confirmParams:{return_url:`${window.location.origin}/donate/success`}
        })
    }
  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
       <button type='submit' className="button--glass button w-full py-3 text-2xl md:text-3xl font-bold mt-3">PAY €{amount}</button>
    </form>
  )
}