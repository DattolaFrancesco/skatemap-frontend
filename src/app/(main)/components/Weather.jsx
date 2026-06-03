'use client'
import { useEffect, useState } from 'react'

export default function Weather({ city }) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  async function getWeather() {
    try {
      const res = await fetch(`/api/weather?city=${city}`)
      const data = await res.json()
      if (!res.ok) throw new Error("weather not available")
      setWeather(data)
    } catch(err) {
      console.log(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { getWeather() }, [city])

  if (loading) return <h1 className=" animate-pulse">Loading...</h1>
  if (!weather) return <p className='bg-transparent ms-2'>NOT AVAILABLE</p>
  return (
     <div className='flex flex-col '>
        <h1 className='text-3xl md:text-5xl font-bold ms-2'>{ weather.list[0].main.temp + "°"}</h1>
        <h1 className='text-md md:text-2xl ms-2'>{weather.list[0].weather[0].main.toUpperCase()}</h1>
     </div>
  )
}