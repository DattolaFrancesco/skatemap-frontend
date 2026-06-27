import { create } from "zustand";

const useSpotStore = create((set) => ({
  spot: null,
  setSpot: (data) => set({ spot: data }),
  openList: null,
  setOpenList: (data) => set({ openList: data }),
  filteredSpot: null,
  setFilteredSpot: (data) => set({ filteredSpot: data }),
  allSpots: null,
  setAllSpots: (data) => set({ allSpots: data }),
}));

export default useSpotStore;