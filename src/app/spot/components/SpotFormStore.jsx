
import { create } from 'zustand'

const useSpotForm = create((set) => ({
    position: {country:null, city:null, street:null},
    setPosition: (data) => set(() => ({ position: data })),
    latLng: {lat:null, lng:null},
    setLatLng: (data) => set(() => ({ latLng: data })),
}))

export default useSpotForm;