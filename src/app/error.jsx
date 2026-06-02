'use client'

export default function Error({ error, reset }) {
  return (
    <div>
      <h1>Qualcosa è andato storto</h1>
      <p>{error.message}</p>
      <button onClick={reset}>Riprova</button>
    </div>
  )
}