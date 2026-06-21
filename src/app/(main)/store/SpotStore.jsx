import { create } from "zustand";

const useSpotStore = create((set) => ({
  firstRender: 0,
  setFirstRender: (data) => set({ firstRender: data }),
  spot: null,
  setSpot: (data) => set({ spot: data }),
  firstSpot: null,
  setFirstSpot: (data) => set({ firstSpot: data }),
  spotGrid: null,
  setSpotGrid: (data) => set({ spotGrid: data }),
  filteredSpot: null,
  setFilteredSpot: (data) => set({ filteredSpot: data }),
  reset: false,
  setReset: (data) => set({ reset: data }),
  allSpots: null,
  setAllSpots: (data) => set({ allSpots: data }),
}));

export default useSpotStore;