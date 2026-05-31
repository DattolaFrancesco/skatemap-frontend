import { create } from "zustand";

const useSpotStore = create((set) => ({
  spot: null,
  setSpot: (data) => set({ spot: data }),
  firstSpot: null,
  setFirstSpot: (data) => set({ firstSpot: data }),
  reset: false,
  setReset: (data) => set({ reset: data }),
}));

export default useSpotStore;