'use client'
import { useEffect, useState, useRef, useMemo } from "react"
import useSpotForm from "./SpotFormStore"
import dynamic from 'next/dynamic'
import { useRouter } from "next/navigation";
import useNavigationStore from "@/app/(main)/store/NavigationStore"
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import imageCompression from "browser-image-compression";

const MapWithData = dynamic(() => import('@/app/googleMaps/MapWithData'), { ssr: false })

const TYPE_OPTIONS = ['STREET', 'SKATEPARK', 'BOWL']
const STRUCTURE_OPTIONS = ['RAIL', 'LEDGE', 'STAIR', 'RAMP']
const RISK_OPTIONS = ['LOW', 'MEDIUM', 'HIGH']
const MAX_VIDEO_SIZE = 40 * 1024 * 1024
const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const STEPS = [
  { n: 1, label: "Location" },
  { n: 2, label: "Details" },
  { n: 3, label: "Media" },
]
const COMPRESSION_WEIGHT = 30

function formatMB(bytes) {
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

function totalSize(files) {
  return files.reduce((acc, f) => acc + f.size, 0)
}

function uploadWithProgress(url, formData, token, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", url)
    xhr.setRequestHeader("Authorization", `Bearer ${token}`)

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(e.loaded / e.total)
      }
    }

    xhr.onload = () => {
      let data = {}
      try { data = JSON.parse(xhr.responseText) } catch (_) {}
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data)
      } else {
        reject(new Error(data.message || "Upload failed"))
      }
    }

    xhr.onerror = () => reject(new Error("Network error during upload"))

    xhr.send(formData)
  })
}

// Hook helper: genera gli object URL per le preview in modo SINCRONO
// (useMemo, calcolato durante il render) cosi' la preview appare subito
// dopo aver scelto i file, senza dover "toccare" altro per forzare un
// secondo render. Il cleanup (revokeObjectURL) avviene in un useEffect
// separato per evitare memory leak.
function useObjectUrls(files) {
  const urls = useMemo(() => files.map(f => URL.createObjectURL(f)), [files])

  useEffect(() => {
    return () => {
      urls.forEach(u => URL.revokeObjectURL(u))
    }
  }, [urls])

  return urls
}

export default function SpotForm() {
  const router = useRouter();
  const clearPendingHref = useNavigationStore((state) => state.clearPendingHref);
  const setStatusHref = useNavigationStore((state) => state.setStatusHref);
  const containerRef = useRef(null)
  const latLng = useSpotForm((d) => d.latLng)
  const position = useSpotForm((d) => d.position)
  const [images, setImages] = useState([])
  const [videos, setVideos] = useState([])
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loadingPhase, setLoadingPhase] = useState(null)
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const imageInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const [form, setForm] = useState({
    name: '', latitude: '', longitude: '',
    description: '', risk: 'LOW', types: [],
    city: '', country: '', continent: '', street: '',
  })

  const imageUrls = useObjectUrls(images)
  const videoUrls = useObjectUrls(videos)

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

  function selectType(t) {
    setForm(p => ({
      ...p,
      types: [...p.types.filter(x => !TYPE_OPTIONS.includes(x)), t]
    }))
  }

  function toggleStructure(s) {
    setForm(p => ({
      ...p,
      types: p.types.includes(s) ? p.types.filter(x => x !== s) : [...p.types, s]
    }))
  }

  function handleAddImages(e) {
    const incoming = Array.from(e.target.files).filter(f => f.type.startsWith('image/'))
    const tooBig = incoming.filter(f => f.size > MAX_IMAGE_SIZE)
    if (tooBig.length > 0) {
      setError(`Images must be under 10MB each (${tooBig.map(f => f.name).join(', ')})`)
      e.target.value = ''
      return
    }
    const merged = [...images, ...incoming]
    if (merged.length > 5) {
      setError("Max 5 images")
      e.target.value = ''
      return
    }
    setError(null)
    setImages(merged)
    e.target.value = ''
  }

  function handleAddVideos(e) {
    const incoming = Array.from(e.target.files).filter(f => f.type.startsWith('video/'))
    const tooBig = incoming.filter(f => f.size > MAX_VIDEO_SIZE)
    if (tooBig.length > 0) {
      setError(`Videos must be under 40MB each (${tooBig.map(f => f.name).join(', ')})`)
      e.target.value = ''
      return
    }
    const merged = [...videos, ...incoming]
    if (merged.length > 3) {
      setError("Max 3 videos")
      e.target.value = ''
      return
    }
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

  async function normalize(file) {
    const isHeic = /heic|heif/i.test(file.type) || /\.he?i[cf]$/i.test(file.name)
    if (!isHeic) return file
    const heic2any = (await import("heic2any")).default
    let blob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 })
    if (Array.isArray(blob)) blob = blob[0]
    const nome = file.name.replace(/\.[^.]+$/, ".jpg")
    return new File([blob], nome, { type: "image/jpeg" })
  }

  async function comprimi(files, onProgress) {
    const results = []
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1280,
      useWebWorker: true,
      fileType: 'image/webp',
    }
    for (let x = 0; x < files.length; x++) {
      const normal = await normalize(files[x])
      const compresso = await imageCompression(normal, options)
      const nome = normal.name.replace(/\.[^.]+$/, '.webp')
      results.push(new File([compresso], nome, { type: 'image/webp' }))
      if (onProgress) onProgress((x + 1) / files.length)
    }
    return results
  }

  function validateStep(s) {
    if (s === 1) {
      if (!form.latitude || !form.longitude) return "Click on the map to set the location"
      if (!form.name.trim()) return "Name is required"
      if (!form.continent.trim()) return "Continent is required"
      if (!form.country.trim()) return "Country is required"
      if (!form.city.trim()) return "City is required"
      if (!form.street.trim()) return "Street is required"
      return null
    }
    if (s === 2) {
      const hasType = form.types.some(t => TYPE_OPTIONS.includes(t))
      if (!hasType) return "Select exactly one Type (Street, Skatepark or Bowl)"
      if (!form.description.trim()) return "Description is required"
      return null
    }
    if (s === 3) {
      if (images.length === 0) return "At least 1 image is required"
      return null
    }
    return null
  }

  function goNext() {
    const err = validateStep(step)
    if (err) { setError(err); return }
    setError(null)
    setStep(s => Math.min(s + 1, STEPS.length))
  }

  function goBack() {
    setError(null)
    setStep(s => Math.max(s - 1, 1))
  }

  function resetForm() {
    setForm({
      name: '', latitude: '', longitude: '',
      description: '', risk: 'LOW', types: [],
      city: '', country: '', continent: '', street: '',
    })
    if (imageInputRef.current) imageInputRef.current.value = ''
    if (videoInputRef.current) videoInputRef.current.value = ''
    setImages([])
    setVideos([])
    setStep(1)
    setError(null)
    setMessage(null)
  }

  // Submit gestito SOLO dal pulsante finale (type="button" + onClick),
  // non più legato a onSubmit del <form>: niente più submit "automatici"
  // quando si passa da uno step all'altro o si preme Enter.
  async function handleSubmit() {
    if (step !== STEPS.length) return

    const err = validateStep(3)
    if (err) { setError(err); return }

    setLoading(true)
    setProgress(0)
    setLoadingPhase('compressing')

    try {
      const newImages = await comprimi(images, (frac) => {
        setProgress(Math.round(frac * COMPRESSION_WEIGHT))
      })

      setLoadingPhase('uploading')
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append("spot", new Blob([JSON.stringify(form)], { type: "application/json" }))
      ;[...newImages, ...videos].forEach(f => formData.append("media", f, f.name))

      const data = await uploadWithProgress(
        `${process.env.NEXT_PUBLIC_API_URL}/spots/upload`,
        formData,
        token,
        (frac) => {
          setProgress(COMPRESSION_WEIGHT + Math.round(frac * (100 - COMPRESSION_WEIGHT)))
        }
      )

      setError(null)
      setMessage(data.message)
      resetForm()
      setSubmitted(true)
    } catch (err) {
      setError(err.message || "Something went wrong while uploading the spot")
      setMessage(null)
    } finally {
      setLoading(false)
      setProgress(0)
      setLoadingPhase(null)
    }
  }

  function handleCreateAnother() {
    setSubmitted(false)
    resetForm()
  }

  // Blocca il submit "nativo" del form (es. Enter su una <select> o input)
  // come ulteriore livello di sicurezza, oltre al bottone type="button".
  function handleFormKeyDown(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault()
    }
  }

  function handleFormSubmit(e) {
    // Difesa extra: anche se qualcosa scatenasse un submit nativo,
    // non facciamo nulla qui. L'unico modo per inviare è il pulsante SUBMIT.
    e.preventDefault()
  }

  const imagesTotalMB = totalSize(images)
  const videosTotalMB = totalSize(videos)
  const imageOverLimit = imagesTotalMB > 5 * MAX_IMAGE_SIZE
  const videoOverLimit = videosTotalMB > 3 * MAX_VIDEO_SIZE
  const selectedType = form.types.find(t => TYPE_OPTIONS.includes(t))
  const selectedStructures = form.types.filter(t => STRUCTURE_OPTIONS.includes(t))

  const { contextSafe } = useGSAP(() => {}, { scope: containerRef })
  useGSAP(() => {
    if (!containerRef.current) return
    const form = containerRef.current
    gsap.killTweensOf(form)
    gsap.set(form, { yPercent: 200 })
    gsap.to(form, {
      yPercent: 0,
      duration: 1,
      ease: "power4.inOut",
      onComplete: () => { setStatusHref(false) }
    })
  }, { scope: containerRef })

  const handleGoingBack = contextSafe(() => {
    if (!containerRef.current) return
    const form = containerRef.current
    gsap.killTweensOf(form)
    gsap.to(form, {
      yPercent: 200,
      duration: 1,
      ease: "power4.inOut",
      onComplete: () => {
        clearPendingHref()
        router.push("/dashboard")
      }
    })
  })

  return (
    <div className="w-full h-full flex justify-center items-center p-3 overflow-hidden">
      <div ref={containerRef} className="flex flex-col w-full h-full min-h-0 md:w-[90%] md:h-[90%] lg:w-[70%] justify-center items-center">

        <div className="button--glass button w-full h-full min-h-0 rounded-[10px] p-1.5 flex flex-col">
          <div className="bg_login w-full rounded-[8px] flex flex-col flex-1 min-h-0 overflow-hidden">

            {loading ? (
              /* ---------- LOADER (liquid glass) ---------- */
              <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 text-center">
                <div className="button--glass rounded-full w-20 h-20 flex items-center justify-center text-xl font-bold">
                  {progress}%
                </div>

                <div className="w-full max-w-xs flex flex-col gap-2">
                  <div className="button--glass rounded-full h-3 w-full overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg_activated_light transition-[width] duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs color_p_gray">
                    {loadingPhase === 'compressing' ? 'Compressing media…' : 'Uploading spot…'}
                  </p>
                </div>
              </div>
            ) : submitted ? (
              /* ---------- SUCCESS SCREEN ---------- */
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4 text-center">
                <div className="button--glass rounded-full w-16 h-16 flex items-center justify-center text-3xl">
                  ✓
                </div>
                <h2 className="text-xl md:text-2xl font-bold">Spot submitted!</h2>
                <p className="text-sm color_p_gray max-w-md">
                  Your spot has been created successfully. It will now be reviewed by our team and, once approved, it will be published on the map for everyone to see.
                </p>
                <div className="flex gap-2 mt-2 w-full max-w-xs">
                  <button
                    type="button"
                    onClick={() => handleGoingBack()}
                    className="button--glass rounded-[6px] flex-1 py-2.5 text-sm"
                  >
                    Go Back
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateAnother}
                    className="button--glass rounded-[6px] flex-1 py-2.5 text-sm font-semibold bg_activated_light"
                  >
                    Create Another
                  </button>
                </div>
              </div>
            ) : (
              /* ---------- FORM ---------- */
              <div className="px-2 py-2 flex flex-col gap-4 flex-1 min-h-0 overflow-hidden">

                <section className="flex justify-between items-center shrink-0">
                  <h1 className="text-lg md:text-2xl font-bold">Add Spot</h1>
                  <button type="button" onClick={() => handleGoingBack()} className="button--glass rounded-[6px] px-3 py-1 text-sm">Back</button>
                </section>

                {/* Step indicator — centrato, non cliccabile */}
                <div className="flex items-center justify-center gap-2 shrink-0 w-full max-w-md mx-auto">
                  {STEPS.map((s, i) => (
                    <div key={s.n} className="flex items-center gap-2 flex-1">
                      {i > 0 && <div className="flex-1 h-[1px] bg-black/15" />}
                      <div
                        className={`button--glass rounded-full w-9 h-9 flex items-center justify-center text-sm font-semibold shrink-0 ${step === s.n ? "bg_activated_light" : ""} ${step > s.n ? "opacity-60" : ""}`}
                      >
                        {s.n}
                      </div>
                      <p className={`text-xs hidden sm:block whitespace-nowrap ${step === s.n ? "" : "color_p_gray"}`}>{s.label}</p>
                      {i < STEPS.length - 1 && <div className="flex-1 h-[1px] bg-black/15" />}
                    </div>
                  ))}
                </div>

                <form
                  autoComplete="off"
                  onSubmit={handleFormSubmit}
                  onKeyDown={handleFormKeyDown}
                  className="flex-1 flex flex-col min-h-0 overflow-hidden"
                >

                  {/* STEP 1 — Location, mappa sopra sempre */}
                  {step === 1 && (
                    <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto">
                      <div className="button--glass rounded-[8px] overflow-hidden relative w-full flex-1 min-h-[200px]">
                        <MapWithData />
                        <div className="absolute flex gap-1 bottom-2 left-2 right-2">
                          <input className="button--glass rounded-[5px] text-xs w-1/2 px-2 py-1.5" readOnly name="latitude" value={form.latitude} placeholder="Latitude" />
                          <input className="button--glass rounded-[5px] text-xs w-1/2 px-2 py-1.5" readOnly name="longitude" value={form.longitude} placeholder="Longitude" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 shrink-0">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex justify-between items-end">
                            <label className="text-xs font-semibold color_p_gray">Name</label>
                            <p className={`text-xs color_p_gray ${form.name.length > 30 ? "text-red-500" : ""}`}>{form.name.length}/30</p>
                          </div>
                          <input className="button--glass rounded-[5px] text-sm px-2 py-2" required name="name" value={form.name} onChange={handleChange} placeholder="Name" />
                        </div>

                        <div className="flex flex-col gap-0.5">
                          <label className="text-xs font-semibold color_p_gray">Continent</label>
                          <select className="button--glass rounded-[5px] text-sm px-2 py-2" name="continent" value={form.continent} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="AFRICA">Africa</option>
                            <option value="ANTARCTICA">Antarctica</option>
                            <option value="ASIA">Asia</option>
                            <option value="EUROPE">Europe</option>
                            <option value="NORTHAMERICA">N. America</option>
                            <option value="OCEANIA">Oceania</option>
                            <option value="SOUTHAMERICA">S. America</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-0.5">
                          <label className="text-xs font-semibold color_p_gray">Country</label>
                          <input className="button--glass rounded-[5px] text-sm px-2 py-2" name="country" value={form.country} onChange={handleChange} placeholder="Country" />
                        </div>

                        <div className="flex flex-col gap-0.5">
                          <label className="text-xs font-semibold color_p_gray">City</label>
                          <input className="button--glass rounded-[5px] text-sm px-2 py-2" name="city" value={form.city} onChange={handleChange} placeholder="City" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-0.5 shrink-0">
                        <label className="text-xs font-semibold color_p_gray">Street</label>
                        <input className="button--glass rounded-[5px] text-sm px-2 py-2" name="street" required value={form.street} onChange={handleChange} placeholder="Street" />
                      </div>
                    </div>
                  )}

                  {/* STEP 2 — Type & Description */}
                  {step === 2 && (
                    <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-y-auto">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold color_p_gray">Risk</label>
                        <div className="flex gap-2">
                          {RISK_OPTIONS.map(r => (
                            <button key={r} type="button" onClick={() => setForm(p => ({ ...p, risk: r }))}
                              className={`button--glass rounded-[5px] flex-1 py-2.5 text-sm transition-colors ${form.risk === r ? "bg_activated_light" : ""}`}>
                              {r.charAt(0) + r.slice(1).toLowerCase()}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold color_p_gray">Type <span className="opacity-60">(choose one)</span></label>
                        <div className="flex gap-2">
                          {TYPE_OPTIONS.map(t => (
                            <button key={t} type="button" onClick={() => selectType(t)}
                              className={`button--glass rounded-[5px] flex-1 py-2.5 text-sm transition-colors ${selectedType === t ? "bg_activated_light" : ""}`}>
                              {t.charAt(0) + t.slice(1).toLowerCase()}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-end">
                          <label className="text-xs font-semibold color_p_gray">Structure</label>
                          <p className="text-xs color_p_gray">{selectedStructures.length}/{STRUCTURE_OPTIONS.length}</p>
                        </div>
                        <div className="flex gap-2">
                          {STRUCTURE_OPTIONS.map(s => (
                            <button key={s} type="button" onClick={() => toggleStructure(s)}
                              className={`button--glass rounded-[5px] flex-1 py-2.5 text-sm transition-colors ${selectedStructures.includes(s) ? "bg_activated_light" : ""}`}>
                              {s.charAt(0) + s.slice(1).toLowerCase()}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 flex-1">
                        <div className="flex justify-between items-end">
                          <label className="text-xs font-semibold color_p_gray">Description</label>
                          <p className="text-xs color_p_gray">{form.description.length}/500</p>
                        </div>
                        <textarea required className="button--glass rounded-[5px] text-sm px-3 py-2.5 w-full resize-none flex-1 min-h-[160px]" name="description" value={form.description} onChange={handleChange} placeholder="Description" />
                      </div>
                    </div>
                  )}

                  {/* STEP 3 — Media */}
                  {step === 3 && (
                    <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0 overflow-y-auto">
                      <div className="flex flex-col gap-2 w-full md:w-1/2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-semibold color_p_gray">Images</label>
                          <button type="button" onClick={() => imageInputRef.current.click()} className="button--glass rounded-[5px] text-xs px-3 py-1">+ Add</button>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs color_p_gray">{images.length}/5 · max 10MB each</p>
                          <p className={`text-xs font-mono ${imageOverLimit ? "text-red-500" : "color_p_gray"}`}>{formatMB(imagesTotalMB)}</p>
                        </div>
                        <input ref={imageInputRef} className="hidden" type="file" accept="image/*" multiple onChange={handleAddImages} />
                        <div className="button--glass rounded-[8px] flex-1 min-h-[180px] p-2 flex flex-wrap gap-2 content-start">
                          {images.length === 0 && (
                            <p className="text-xs color_p_gray w-full text-center self-center mt-8">No images yet</p>
                          )}
                          {images.map((file, i) => (
                            <div key={i} className="relative w-20 h-20">
                              {imageUrls[i] && (
                                <img src={imageUrls[i]} className="w-full h-full object-cover rounded-[5px]" />
                              )}
                              <button type="button" onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">×</button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 w-full md:w-1/2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-semibold color_p_gray">Videos</label>
                          <button type="button" onClick={() => videoInputRef.current.click()} className="button--glass rounded-[5px] text-xs px-3 py-1">+ Add</button>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs color_p_gray">{videos.length}/3 · max 40MB each</p>
                          <p className={`text-xs font-mono ${videoOverLimit ? "text-red-500" : "color_p_gray"}`}>{formatMB(videosTotalMB)}</p>
                        </div>
                        <input ref={videoInputRef} className="hidden" type="file" accept="video/*" multiple onChange={handleAddVideos} />
                        <div className="button--glass rounded-[8px] flex-1 min-h-[180px] p-2 flex flex-wrap gap-2 content-start">
                          {videos.length === 0 && (
                            <p className="text-xs color_p_gray w-full text-center self-center mt-8">No videos yet</p>
                          )}
                          {videos.map((file, i) => (
                            <div key={i} className="relative w-20 h-20">
                              {videoUrls[i] && (
                                <video src={videoUrls[i]} className="w-full h-full object-cover rounded-[5px]" />
                              )}
                              <button type="button" onClick={() => removeVideo(i)} className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">×</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Nav buttons + submit */}
                  <div className="flex flex-col gap-2 shrink-0 mt-4">
                    {error && <p className="text-red-500 text-xs">{error}</p>}
                    {message && <p className="text-green-500 text-xs">{message}</p>}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={step === 1}
                        onClick={goBack}
                        className="button--glass rounded-[6px] px-5 py-2.5 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Back
                      </button>

                      {step < STEPS.length ? (
                        <button
                          type="button"
                          onClick={goNext}
                          className="button--glass rounded-[6px] flex-1 py-2.5 text-sm font-semibold bg_activated_light"
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          disabled={loading}
                          type="button"
                          onClick={handleSubmit}
                          className="button--glass rounded-[6px] flex-1 py-2.5 text-sm font-semibold bg_activated_light disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          SUBMIT
                        </button>
                      )}
                    </div>
                  </div>

                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}