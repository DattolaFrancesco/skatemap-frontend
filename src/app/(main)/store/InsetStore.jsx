import { create } from "zustand";
const useInsetStore = create((set)=>({
    spotOpen: null,
    setSpotOpen: (spot) => set({ spotOpen: spot })
}))
export default useInsetStore;