'use client'
import { useEffect, useState } from "react";
import Select from 'react-select';
import usePinRegistration from "@/app/generic/store/PinRegistration";
import { registerSpot } from "../utils/GenericFetch";

export default function SpotForm(){
const pin = usePinRegistration((state) => state.pin);
    const options = [
    { value: 'rail', label: 'Rail' },
    { value: 'ledge', label: 'Ledge' },
    { value: 'street', label: 'Street' },
    { value: 'skatepark', label: 'Skatepark' },
    { value: 'stair', label: 'Stair' },
    ];
    const [form, setForm] = useState({
        name: '',
        latitude: '',
        longitude: '',
        description: '',
        risk: 'low',
        types: [],
    });
    function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    }
    function handleSubmit(e){
        e.preventDefault()
        addSpot(form)
    }
    useEffect(()=>{
        setForm((prev) => ({
      ...prev,
       latitude:pin.lat,
       longitude:pin.lng,
    }));
    },[pin])
    async function addSpot(form) {
       try {
         const data = await registerSpot(form);
        console.log(data)
       } catch (err) {
        console.log(err.message);
       }
    }
    return(
         <div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-[300px]">

      <input
        name="name"
        placeholder="Nome"
        value={form.name}
        onChange={handleChange}
        className="border p-2"
      />

      <input
        readOnly
        name="latitude"
        placeholder="Latitudine"
        value={form.latitude}
        onChange={handleChange}
        className="border p-2"
      />

      <input
        readOnly
        name="longitude"
        placeholder="Longitudine"
        value={form.longitude}
        className="border p-2"
      />

      <textarea
        name="description"
        placeholder="Descrizione"
        value={form.description}
        onChange={handleChange}
        className="border p-2"
      />

      <select
        name="risk"
        value={form.risk}
        onChange={handleChange}
        className="border p-2"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

        <Select
        isMulti
        options={options}
        value={options.filter((o) =>
            form.types.includes(o.value)
            )}
        onChange={(selected) => {
        setForm((prev) => ({
        ...prev,
        types: selected ? selected.map((s) => s.value) : [],
        }));
        } }
        />
     
      <button
        type="submit"
        className="bg-blue-500 text-white p-2"
      >
        Invia
      </button>

    </form>
                </div>
    )
}