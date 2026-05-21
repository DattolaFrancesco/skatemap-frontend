import { create } from "zustand";
const useInsetStore = create((set)=>({
    spotOpen: null,
    setSpotOpen: (spot) => set({ spotOpen: spot }),
    mediaOpen: null,
    setMediaOpen: (media) => set({ mediaOpen: media })
}))
export default useInsetStore;