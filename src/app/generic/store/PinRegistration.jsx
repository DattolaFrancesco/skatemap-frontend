import { create } from 'zustand'
const usePinRegistration = create((set)=>({
    pin:{},
    setPin: (coords) => set(() => ({pin: coords})),
}))
export default usePinRegistration;