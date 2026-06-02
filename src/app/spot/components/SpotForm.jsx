'use client'
import { useEffect, useState, useRef } from "react"
import useSpotForm from "./SpotFormStore"
import Link from "next/link"
import dynamic from 'next/dynamic'

const MapWithData = dynamic(() => import('@/app/googleMaps/MapWithData'), { ssr: false })

const OPTIONS = ['RAIL', 'LEDGE', 'STREET', 'SKATEPARK', 'STAIR']
const MAX_VIDEO_SIZE = 8 * 1024 * 1024
const MAX_IMAGE_SIZE = 1.5 * 1024 * 1024

function formatMB(bytes) {
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

function totalSize(files) {
  return files.reduce((acc, f) => acc + f.size, 0)
}

export default function SpotForm() {
  const latLng = useSpotForm((d) => d.latLng)
  const position = useSpotForm((d) => d.position)
  const [images, setImages] = useState([])
  const [videos, setVideos] = useState([])
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const imageInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const [form, setForm] = useState({
    name: '', latitude: '', longitude: '',
    description: '', risk: 'LOW', types: [],
    city: '', country: '', continent: '', street: '',
  })

  useEffect(() => {
    if (!latLng) return
    setForm((prev) => ({ ...prev, latitude: latLng.lat, longitude: latLng.lng }))
  }, [latLng])

  useEffect(() => {
    if (!position) return
    setForm((prev) => ({ ...prev, country: position.country, city: position.city, street: position.street }))
  }, [position])

  function handleChange(e) {
    const { name, value } = e.target
    if (name === 'description' && value.length > 500) return
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleAddImages(e) {
    const incoming = Array.from(e.target.files).filter(f => f.type.startsWith('image/'))
    const tooBig = incoming.filter(f => f.size > MAX_IMAGE_SIZE)
    if (tooBig.length > 0) {
      setError(`Images must be under 1.5MB each (${tooBig.map(f => f.name).join(', ')})`)
      return
    }
    const merged = [...images, ...incoming]
    if (merged.length > 5) { setError("Max 5 images"); return }
    setError(null)
    setImages(merged)
    e.target.value = ''
  }

  function handleAddVideos(e) {
    const incoming = Array.from(e.target.files).filter(f => f.type.startsWith('video/'))
    const tooBig = incoming.filter(f => f.size > MAX_VIDEO_SIZE)
    if (tooBig.length > 0) {
      setError(`Videos must be under 8MB each (${tooBig.map(f => f.name).join(', ')})`)
      return
    }
    const merged = [...videos, ...incoming]
    if (merged.length > 3) { setError("Max 3 videos"); return }
    setError(null)
    setVideos(merged)
    e.target.value = ''
  }

  function removeImage(index) {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  function removeVideo(index) {
    setVideos(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.latitude || !form.longitude) {
      setError("Click on the map to set the location")
      return
    }
    if (images.length === 0) {
      setError("At least 1 image is required")
      return
    }
    setLoading(true)
    const token = localStorage.getItem('token')
    try {
      const formData = new FormData()
      formData.append("spot", new Blob([JSON.stringify(form)], { type: "application/json" }))
      ;[...images, ...videos].forEach(f => formData.append("media", f))
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots/upload`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      })
      const data = await res.text()
      if (!res.ok) throw new Error(data.message)
      setError(null)
      setMessage("SPOT CREATED")
      setForm({
        name: '', latitude: '', longitude: '',
        description: '', risk: 'LOW', types: [],
        city: '', country: '', continent: '', street: '',
      })
      imageInputRef.current.value = ''
      videoInputRef.current.value = ''
      setImages([])
      setVideos([])
    } catch (err) {
      setError(err.message)
      setMessage(null)
    } finally {
      setLoading(false)
         setTimeout(() => {
       setMessage(null) 
      }, 2000);
    }
  }

  const imagesTotalMB = totalSize(images)
  const videosTotalMB = totalSize(videos)
  const imageOverLimit = imagesTotalMB > 5 * MAX_IMAGE_SIZE
  const videoOverLimit = videosTotalMB > 3 * MAX_VIDEO_SIZE

  return (
    <div className={`flex flex-col w-full h-full md:w-[80%] md:h-[80%] justify-center items-center ${loading ? "animate-pulse" : ""}`}>
      <div className="w-full h-full bg-black/30 px-2 py-1.5 md:px-3 md:py-2 flex flex-col overflow-y-auto">
        <section className="flex justify-between py-2">
          <h1 className="text-lg md:text-xl lg:text-2xl xl:text-4xl font-bold text-primary-500">ADD SPOT</h1>
          <Link href={"/"} className={`w-fit h-fit text-primary-500 ${loading ? "invisible" : ""}`}>BACK</Link>
        </section>

        <form autoComplete="off" onSubmit={handleSubmit} className="md:h-full flex flex-col gap-1.5 md:gap-2 lg:gap-3">

          <h2 className="py-1 px-2 text-sm md:text-xl font-bold bg-primary-700 w-fit mb-3 text-white">01/LOCATION</h2>
          <div className="flex flex-col md:flex-row h-full gap-1.5 md:gap-2 lg:gap-3">
            <div className="flex flex-col gap-1 w-full md:w-1/2 min-h-[300px] md:min-h-0 md:flex-1 border relative">
              <MapWithData />
              <div className="absolute flex gap-1 bottom-1 left-1">
                <div className="flex flex-col gap-0.5 w-[30%]">
                  <label className="text-sm font-semibold text-primary-700">LATITUDE</label>
                  <input className="bg-white text-sm w-full" readOnly name="latitude" value={form.latitude} placeholder="Click on map" />
                </div>
                <div className="flex flex-col gap-0.5 w-[30%]">
                  <label className="text-sm font-semibold text-primary-700">LONGITUDE</label>
                  <input className="bg-white text-sm w-full" readOnly name="longitude" value={form.longitude} placeholder="Click on map" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full md:w-1/2 md:justify-between">
              <div className="flex flex-col gap-0.5 mb-2">
                <label className="text-xs md:text-sm lg:text-2xl font-semibold w-fit bg-primary">CONTINENT</label>
                <select className="bg-white py-0.5 md:py-1 lg:py-2 text-xs md:text-sm" name="continent" value={form.continent} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="AFRICA">AFRICA</option>
                  <option value="ANTARCTICA">ANTARCTICA</option>
                  <option value="ASIA">ASIA</option>
                  <option value="EUROPE">EUROPE</option>
                  <option value="NORTHAMERICA">N. AMERICA</option>
                  <option value="OCEANIA">OCEANIA</option>
                  <option value="SOUTHAMERICA">S. AMERICA</option>
                </select>
              </div>
              <div className="flex flex-col gap-0.5 mb-2">
                <label className="text-xs md:text-sm lg:text-2xl font-semibold w-fit bg-primary">COUNTRY</label>
                <input onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }} className="bg-white py-0.5 md:py-1 lg:py-2 text-xs md:text-sm" name="country" value={form.country} onChange={handleChange} placeholder="Country" />
              </div>
              <div className="flex flex-col gap-0.5 mb-2">
                <label className="text-sm lg:text-2xl font-semibold w-fit bg-primary">CITY</label>
                <input onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }} className="bg-white py-0.5 md:py-1 lg:py-2 text-xs md:text-sm" name="city" value={form.city} onChange={handleChange} placeholder="City" />
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-xs md:text-sm lg:text-2xl font-semibold w-fit bg-primary">STREET</label>
                <input onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }} className="bg-white py-0.5 md:py-1 lg:py-2 text-xs md:text-sm" name="street" required value={form.street} onChange={handleChange} placeholder="Street" />
              </div>
            </div>
          </div>

          <div>
            <article className="flex items-end justify-between">
              <h2 className="py-1 px-2 text-sm md:text-xl font-bold bg-primary-700 w-fit mb-3 text-white">02/IDENTITY</h2>
              <p className="py-1 px-2 text-xs md:text-md w-fit bg-transparent text-primary-500">How locals call it and how it skates</p>
            </article>

            <section className="flex flex-col md:flex-row gap-2 md:gap-5">
              <article className="w-1/2">
                <div className="flex flex-col gap-0.5 mb-2">
                  <div className="flex justify-between">
                    <label className="text-xs md:text-sm lg:text-2xl font-semibold w-fit bg-primary">NAME</label>
                    <p className={`text-xs self-end bg-transparent text-primary-500 ${form.name.length > 30 ? "text-red-800" : ""}`}>{form.name.length}/30</p>
                  </div>
                  <input onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }} className="bg-white py-0.5 md:py-1 lg:py-2 text-xs md:text-sm" required name="name" value={form.name} onChange={handleChange} placeholder="Name" />
                </div>
              </article>

              <article className="flex flex-col gap-0.5">
                <label className="text-xs md:text-sm lg:text-2xl font-semibold w-fit bg-primary">RISK</label>
                <div className="flex gap-2">
                  {['LOW', 'MEDIUM', 'HIGH'].map(r => (
                    <button key={r} type="button" onClick={() => setForm(p => ({ ...p, risk: r }))}
                      className={`w-fit border ${form.risk === r ? "bg-primary-500" : ""} py-0.5 md:py-2 px-2 md:px-5`}>{r}</button>
                  ))}
                </div>
              </article>
            </section>

            <article className="flex flex-col gap-0.5">
              <div className="flex flex-col gap-2 w-fit">
                <article className="flex items-end justify-between">
                  <label className="text-xs md:text-sm lg:text-2xl font-semibold w-fit bg-primary">TYPES</label>
                  <p className="text-xs bg-transparent text-primary-500">{form.types.length}/{OPTIONS.length} selected</p>
                </article>
                <div className="flex gap-2">
                  {OPTIONS.map(t => (
                    <button key={t} type="button"
                      onClick={() => setForm(p => ({
                        ...p, types: p.types.includes(t)
                          ? p.types.filter(x => x !== t)
                          : [...p.types, t]
                      }))}
                      className={`w-fit border ${form.types.includes(t) ? "bg-primary-500" : ""} py-0.5 md:py-2 px-2 md:px-5`}>{t}</button>
                  ))}
                </div>
              </div>
            </article>

            <section className="flex flex-col md:flex-row w-full py-3 gap-5">
              <div className="flex flex-row md:flex-col justify-between md:justify-start md:w-1/2 gap-2 pt-1">

                <div className="flex flex-col w-1/2 md:w-full gap-0.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs md:text-sm lg:text-2xl font-semibold w-fit bg-primary">IMAGES</label>
                    <button type="button" onClick={() => imageInputRef.current.click()} className="text-sm border px-2 py-0.5">+ Add</button>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-primary-500">{images.length}/5 · max 1.5MB each</p>
                    <p className={`text-xs font-mono ${imageOverLimit ? "text-red-800" : "text-primary-500"}`}>
                      {formatMB(imagesTotalMB)}
                    </p>
                  </div>
                  <input ref={imageInputRef} className="hidden" type="file" accept="image/*" multiple onChange={handleAddImages} />
                  <div className="flex flex-wrap gap-1 mt-1">
                    {images.map((file, i) => (
                      <div key={i} className="relative w-16 h-16">
                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded" />
                        <p className="absolute bottom-0 left-0 right-0 text-center text-white text-[9px] bg-black/50 rounded-b">
                          {formatMB(file.size)}
                        </p>
                        <button type="button" onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">×</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col w-1/2 md:w-full gap-0.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs md:text-sm lg:text-2xl font-semibold w-fit bg-primary">VIDEOS</label>
                    <button type="button" onClick={() => videoInputRef.current.click()} className="text-sm border px-2 py-0.5">+ Add</button>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-primary-500">{videos.length}/3 · max 10MB each</p>
                    <p className={`text-xs font-mono ${videoOverLimit ? "text-red-800" : "text-primary-500"}`}>
                      {formatMB(videosTotalMB)}
                    </p>
                  </div>
                  <input ref={videoInputRef} className="hidden" type="file" accept="video/*" multiple onChange={handleAddVideos} />
                  <div className="flex flex-wrap gap-1 mt-1">
                    {videos.map((file, i) => (
                      <div key={i} className="relative w-16 h-16">
                        <video src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded" />
                        <p className="absolute bottom-0 left-0 right-0 text-center text-white text-[9px] bg-black/50 rounded-b">
                          {formatMB(file.size)}
                        </p>
                        <button type="button" onClick={() => removeVideo(i)} className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">×</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-full md:w-1/2 gap-0.5 md:ps-2 pt-2 md:pt-0 justify-between">
                <article className="flex flex-col gap-2 mb-1">
                  <div className="flex justify-between">
                    <label className="text-xs md:text-sm lg:text-2xl font-semibold w-fit bg-primary">DESCRIPTION</label>
                    <p className="text-xs self-end bg-transparent text-primary-500">{form.description.length}/500</p>
                  </div>
                  <textarea onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }} required className="bg-white py-0.5 md:py-1 lg:py-2 text-xs md:text-sm w-full" rows={2} name="description" value={form.description} onChange={handleChange} placeholder="Description" />
                </article>
                <article className="flex justify-between items-center">
                  {error && <p className="text-red-800 text-sm py-0.5 bg-transparent">{error}</p>}
                  {message && <p className="text-green-800 text-xl py-0.5 bg-transparent">{message}</p>}
                  <button disabled={loading} type="submit" className="hover:bg-primary text-xs md:text-sm lg:text-2xl xl:text-2xl font-semibold w-1/3 py-1 md:py-1.5 lg:py-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ml-auto">
                    SUBMIT
                  </button>
                </article>
              </div>
            </section>
          </div>
        </form>
      </div>
    </div>
  )
}