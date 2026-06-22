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
  if (!weather) return <p className='bg-transparent ms-2'></p>
  return (
     <div className=' flex gap-1 w-fit color_p_gray'>
        <h1 className='text-sm'>{ weather.list[0].main.temp + "°"}</h1>
        <h1 className='text-sm'>{weather.list[0].weather[0].main}</h1>
     </div>
  )
}