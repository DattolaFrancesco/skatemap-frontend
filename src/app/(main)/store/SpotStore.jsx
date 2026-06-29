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
    eliminationSpot: null,
    setEliminationSpot: (data) => set({ eliminationSpot: data }),
    askPermission: false,
    setAskPermission: (data) => set({ askPermission: data }),
    reset: false,
    setReset: (data) => set({ reset: data }),
    firstRender: 0,
    setFirstRender: (data) => set({ firstRender: data }),
    firstRenderGrid: 0,
    setFirstRenderGrid: (data) => set({ firstRenderGrid: data }),
}));

export default useSpotStore;