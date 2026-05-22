
'use client'
import { useEffect, useState } from 'react'

export default function Weather({ city }) {
    const [weather, setWeather] = useState(null)
    
    useEffect(() => {
        fetch(`/api/weather?city=${city}`)
            .then(res => res.json())
            .then(data => {setWeather(data)})
    }, [city])
    
    if (!weather) return <p>NOT AVAILABLE</p>
    return <p>{weather.list[0].weather[0].main.toUpperCase() + "/"+ weather.list[0].main.temp+"°" }</p>
}