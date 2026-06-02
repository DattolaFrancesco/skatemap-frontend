 'use client'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'

 export default function Checkoutpage(){
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
      <button type="submit">Paga</button>
    </form>
  )
}