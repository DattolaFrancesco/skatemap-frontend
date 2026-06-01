import { create } from "zustand";

const useSpotStore = create((set) => ({
  firstRender: 0,
  setFirstRender: (data) => set({ firstRender: data }),
  firstRenderGrid: 0,
  setFirstRenderGrid: (data) => set({ firstRenderGrid: data }),
  spot: null,
  setSpot: (data) => set({ spot: data }),
  firstSpot: null,
  setFirstSpot: (data) => set({ firstSpot: data }),
  spotGrid: null,
  setSpotGrid: (data) => set({ spotGrid: data }),
  firstSpotGrid: null,
  setFirstSpotGrid: (data) => set({ firstSpotGrid: data }),
  reset: false,
  setReset: (data) => set({ reset: data }),
}));

export default useSpotStore;