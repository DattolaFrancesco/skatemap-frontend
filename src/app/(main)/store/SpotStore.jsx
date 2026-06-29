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
    pendingSpot: null,
    setPendingSpot: (data) => set({ pendingSpot: data }),
    askPermissionPending: false,
    setAskPermissionPending: (data) => set({ askPermissionPending: data }),
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