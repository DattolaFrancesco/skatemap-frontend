import { create } from "zustand";
const useInsetStore = create((set)=>({
    spotOpen: null,
    setSpotOpen: (spot) => set({ spotOpen: spot }),
    expanded: null,
    setExpanded: (spot) => set({ expanded: spot }),
    mediaOpen: null,
    setMediaOpen: (media) => set({ mediaOpen: media })
}))
export default useInsetStore;