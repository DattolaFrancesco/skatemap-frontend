'use client'
import { useEffect, useState, useRef } from "react";
import useSpotForm from "@/app/spot/components/SpotFormStore";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation"
import dynamic from 'next/dynamic'
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useNavigationStore from "@/app/(main)/store/NavigationStore";

const MapWithData = dynamic(() => import('@/app/googleMaps/MapWithData'), { ssr: false })

const options = [
  { value: 'RAIL' },
  { value: 'LEDGE' },
  { value: 'STREET' },
  { value: 'SKATEPARK' },
  { value: 'STAIR' },
]

export default function ModifySpotForm() {
  const router = useRouter();
  const clearPendingHref = useNavigationStore((state) => state.clearPendingHref);
  const setStatusHref = useNavigationStore((state) => state.setStatusHref);
  const containerRef = useRef(null)
  const pathname = usePathname()
  const sections = pathname.split("/")
  const section = sections[3]
  const latLng = useSpotForm((data) => data.latLng);
  const position = useSpotForm((data) => data.position);
  const setLatLng = useSpotForm((data) => data.setLatLng);
  const setPosition = useSpotForm((data) => data.setPosition);
  const [existsImages, setExistsImages] = useState(null)
  const [existsVideos, setExistsVideos] = useState(null)
  const [eliminatedExistsImages, setEliminatedExistsImages] = useState({ id: [] })
  const [eliminatedExistsVideos, setEliminatedExistsVideos] = useState({ id: [] })
  let imageRestrictionNumber = 5 - (existsImages?.length - eliminatedExistsImages?.id?.length);
  let videoRestrictionNumber = 3 - (existsVideos?.length - eliminatedExistsVideos?.id?.length);
  const [images, setImages] = useState([])
  const [videos, setVideos] = useState([])
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const imageInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', latitude: '', longitude: '',
    description: '', risk: 'LOW', types: [],
    city: '', country: '', continent: '', street: ''
  });

  useEffect(() => { getSpot(); setPosition(null) }, [])
  useEffect(() => {
    if (!latLng || !latLng.lat) return
    setForm((prev) => ({ ...prev, latitude: latLng.lat, longitude: latLng.lng }));
  }, [latLng])
  useEffect(() => {
    if (!position || !position.country) return;
    setForm((prev) => ({ ...prev, country: position.country, city: position.city, street: position.street }));
  }, [position])
  
  async function getSpot() {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots/single/${section}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      })
      const data = await res.json()
      if (!res.ok) throw new Error("unable to get spot");
      setForm({
        name: data.name, latitude: data.latitude, longitude: data.longitude,
        description: data.description, risk: data.risk, types: data.spotTypes.map((t) => t),
        city: data.city, country: data.country, continent: data.continents, street: data.street
      })
      setLatLng({ lat: data.latitude, lng: data.longitude })
      setExistsImages(data.image)
      setExistsVideos(data.video)
    } catch (err) { console.log(err.message) }
  }
  function handleChange(e) {
    const { name, value } = e.target;
    if (name === 'description' && value.length > 500) return
    setForm((prev) => ({ ...prev, [name]: value }));
  }
  function handleAddImages(e) {
    const incoming = Array.from(e.target.files).filter(f => f.type.startsWith('image/'))
    const merged = [...images, ...incoming]
    if (merged.length > imageRestrictionNumber) { setError("Max 5 images"); return }
    setImages(merged)
    e.target.value = ''
  }
  function handleAddVideos(e) {
    const incoming = Array.from(e.target.files).filter(f => f.type.startsWith('video/'))
    const merged = [...videos, ...incoming]
    if (merged.length > videoRestrictionNumber) { setError("Max 3 videos"); return }
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
    const remainingExisting = (existsImages?.length ?? 0) - eliminatedExistsImages.id.length
    if (remainingExisting === 0 && images.length === 0) {
      setError("At least 1 image required")
      return
    }
      const eliminatedMedia = [
        ...eliminatedExistsImages.id,
        ...eliminatedExistsVideos.id
      ];
      const payload = {
        ...form,
        eliminatedMedia
      };
      const formData = new FormData();
      formData.append(
        "spot",
        new Blob([JSON.stringify(payload)], {
          type: "application/json"
        })
      );
      const media = [...images, ...videos];
      media.forEach(f => formData.append("media", f));
      setLoading(true)
    try {
      await handleForm(section, formData)
      setLoading(false)
      router.push('/dashboard')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  async function handleForm(spotId, formData) {
    const token = localStorage.getItem('token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots/modify/${spotId}`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData,
    });
    const text = await res.text()
    if (!res.ok) {
          throw new Error(text.message+" try again, it could be the media format");
    };
  }
    const {contextSafe} = useGSAP(()=>{},{ scope: containerRef })
  useGSAP(()=>{
    if(!containerRef.current) return
      const form = containerRef.current
      gsap.killTweensOf(form)
      gsap.set(form,{yPercent:200})
      gsap.to(form,{
        yPercent:0,
        duration:1,
        ease:"power4.inOut",
        onComplete: ()=>{
          setStatusHref(false)
        }
      })

  },{scope: containerRef})
  const handleGoingBack = contextSafe(() => {
      if(!containerRef.current) return
      const form = containerRef.current
      gsap.killTweensOf(form)
      gsap.to(form,{
        yPercent:200,
        duration:1,
        ease:"power4.inOut",
        onComplete: ()=>{
          clearPendingHref()
          router.push("/dashboard")
        }
      })
  })

  return (
    <div ref={containerRef} className={`flex flex-col w-full h-full md:w-[80%] md:h-[80%] justify-center items-center ${loading ? "animate-pulse" : ""}`}>
      <div className="w-full h-full bg-black/30 px-2 py-1.5 md:px-3 md:py-2 flex flex-col overflow-y-auto">
        <section className="flex justify-between py-2">
          <h1 className="text-lg md:text-xl lg:text-2xl xl:text-4xl font-bold text-primary-500">EDIT SPOT</h1>
          <button onClick={()=>handleGoingBack()} className={`w-fit bg-transparent h-fit text-primary-500 ${loading ? "invisible" : ""}`}>BACK</button>
        </section>

        <form autoComplete="off" onSubmit={handleSubmit} className="md:h-full flex flex-col gap-1.5 md:gap-2 lg:gap-3">

          {/* 01 / LOCATION */}
          <h2 className="py-1 px-2 text-sm md:text-xl font-bold bg-primary-700 w-fit mb-3 text-white">01/LOCATION</h2>
          <div className="flex flex-col md:flex-row h-full gap-1.5 md:gap-2 lg:gap-3">
            <div className="flex flex-col gap-1 w-full md:w-1/2 min-h-[300px] md:min-h-0 md:flex-1 border relative">
              <MapWithData lat={form.latitude} lng={form.longitude} />
              <div className="absolute flex gap-1 bottom-1 left-1">
                <div className="flex flex-col gap-0.5 w-[30%]">
                  <label className="text-sm font-semibold text-primary-700">LATITUDE</label>
                  <input autoComplete="new-password" className="bg-white text-sm w-full" readOnly name="latitude" value={form.latitude} placeholder="Click on map" />
                </div>
                <div className="flex flex-col gap-0.5 w-[30%]">
                  <label className="text-sm font-semibold text-primary-700">LONGITUDE</label>
                  <input autoComplete="new-password" className="bg-white text-sm w-full" readOnly name="longitude" value={form.longitude} placeholder="Click on map" />
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
                <input autoComplete="new-password" onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }} className="bg-white py-0.5 md:py-1 lg:py-2 text-xs md:text-sm" name="country" value={form.country} onChange={handleChange} placeholder="Country" />
              </div>
              <div className="flex flex-col gap-0.5 mb-2">
                <label className="text-sm lg:text-2xl font-semibold w-fit bg-primary">CITY</label>
                <input autoComplete="new-password" onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }} className="bg-white py-0.5 md:py-1 lg:py-2 text-xs md:text-sm" name="city" value={form.city} onChange={handleChange} placeholder="City" />
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-xs md:text-sm lg:text-2xl font-semibold w-fit bg-primary">STREET</label>
                <input autoComplete="new-password" onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }} className="bg-white py-0.5 md:py-1 lg:py-2 text-xs md:text-sm" name="street" required value={form.street} onChange={handleChange} placeholder="Street" />
              </div>
            </div>
          </div>

          {/* 02 / IDENTITY */}
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
                  <input autoComplete="new-password" onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }} className="bg-white py-0.5 md:py-1 lg:py-2 text-xs md:text-sm" required name="name" value={form.name} onChange={handleChange} placeholder="Name" />
                </div>
              </article>

              <article className="flex flex-col gap-0.5">
                <label className="text-xs md:text-sm lg:text-2xl font-semibold w-fit bg-primary">RISK</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setForm((prev) => ({ ...prev, risk: "LOW" }))} className={`w-fit border ${form.risk === "LOW" ? "bg-primary-500" : ""} py-0.5 md:py-2 px-2 md:px-5`}>LOW</button>
                  <button type="button" onClick={() => setForm((prev) => ({ ...prev, risk: "MEDIUM" }))} className={`w-fit border ${form.risk === "MEDIUM" ? "bg-primary-500" : ""} py-0.5 md:py-2 px-2 md:px-5`}>MEDIUM</button>
                  <button type="button" onClick={() => setForm((prev) => ({ ...prev, risk: "HIGH" }))} className={`w-fit border ${form.risk === "HIGH" ? "bg-primary-500" : ""} py-0.5 md:py-2 px-2 md:px-5`}>HIGH</button>
                </div>
              </article>
            </section>

            <article className="flex flex-col gap-0.5">
              <div className="flex flex-col gap-2 w-fit">
                <article className="flex items-end justify-between">
                  <label className="text-xs md:text-sm lg:text-2xl font-semibold w-fit bg-primary">TYPES</label>
                  <p className="text-xs bg-transparent text-primary-500">{form.types.length}/{options.length} selected</p>
                </article>
                <div className="flex gap-2">
                  {options.map((t) => (
                    <button key={t.value} type="button"
                      onClick={() => setForm((prev) => ({
                        ...prev, types: prev.types.includes(t.value)
                          ? prev.types.filter(x => x !== t.value)
                          : [...prev.types, t.value],
                      }))}
                      className={`w-fit border ${form.types.includes(t.value) ? "bg-primary-500" : ""} py-0.5 md:py-2 px-2 md:px-5`}
                    >{t.value}</button>
                  ))}
                </div>
              </div>
            </article>

            <section className="flex flex-col md:flex-row w-full py-3 gap-5">
              <div className="flex flex-row md:flex-col justify-between md:justify-start md:w-1/2 gap-2 pt-1">

                {/* IMAGES */}
                <div className="flex flex-col w-1/2 md:w-full gap-0.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs md:text-sm lg:text-2xl font-semibold w-fit bg-primary">IMAGES</label>
                    <button type="button" onClick={() => imageInputRef.current.click()} className="text-sm border px-2 py-0.5">+ Add</button>
                  </div>
                  <input ref={imageInputRef} className="hidden" type="file" accept="image/*" multiple onChange={handleAddImages} />
                  <div className="flex flex-wrap gap-1 mt-1">
                    {existsImages && existsImages.map((img) => (
                      <div key={img.id} className={`relative ${eliminatedExistsImages.id.includes(img.id) ? "hidden" : ""}`}>
                        <img src={img.link} className="w-16 h-16 object-cover rounded" />
                        <button type="button"
                          disabled={(existsImages?.length ?? 0) - eliminatedExistsImages.id.length + images.length <= 1}
                          onClick={() => setEliminatedExistsImages((prev) => ({ id: [...prev.id, img.id] }))}
                          className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed">×</button>
                      </div>
                    ))}
                    {images.map((file, i) => (
                      <div key={i} className="relative w-16 h-16">
                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded" />
                        <button type="button" onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">×</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* VIDEOS */}
                <div className="flex flex-col w-1/2 md:w-full gap-0.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs md:text-sm lg:text-2xl font-semibold w-fit bg-primary">VIDEOS</label>
                    <button type="button" onClick={() => videoInputRef.current.click()} className="text-sm border px-2 py-0.5">+ Add</button>
                  </div>
                  <input ref={videoInputRef} className="hidden" type="file" accept="video/*" multiple onChange={handleAddVideos} />
                  <div className="flex flex-wrap gap-1 mt-1">
                    {existsVideos && existsVideos.map((vid) => (
                      <div key={vid.id} className={`relative ${eliminatedExistsVideos.id.includes(vid.id) ? "hidden" : ""}`}>
                        <img src={vid.thumbnailUrl} className="w-16 h-16 object-cover rounded" />
                        <button type="button" onClick={() => setEliminatedExistsVideos((prev) => ({ id: [...prev.id, vid.id] }))} className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">×</button>
                      </div>
                    ))}
                    {videos.map((file, i) => (
                      <div key={i} className="relative w-16 h-16">
                        <video src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded" />
                        <button type="button" onClick={() => removeVideo(i)} className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">×</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="flex flex-col w-full md:w-1/2 gap-0.5 md:ps-2 pt-2 md:pt-0 justify-between">
                <article className="flex flex-col gap-2 mb-1">
                  <div className="flex justify-between">
                    <label className="text-xs md:text-sm lg:text-2xl font-semibold w-fit bg-primary">DESCRIPTION</label>
                    <p className="text-xs self-end bg-transparent text-primary-500">{form.description.length}/500</p>
                  </div>
                  <textarea onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }} required className="bg-white py-0.5 md:py-1 lg:py-2 text-xs md:text-sm w-full" rows={2} name="description" value={form.description} onChange={handleChange} placeholder="Description" />
                </article>
                <article className="flex justify-between">
                  {error && <p className="text-red-800 text-xl py-0.5 bg-transparent">{error}</p>}
                  {message && <p className="text-green-800 text-xl py-0.5 bg-transparent">{message}</p>}
                  <button disabled={loading} type="submit" className="hover:bg-primary text-xs md:text-sm lg:text-2xl xl:text-2xl font-semibold w-1/3 py-1 md:py-1.5 lg:py-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
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