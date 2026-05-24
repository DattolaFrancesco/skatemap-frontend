import { create } from "zustand";
const useUserStore = create((set)=>({
    user: null,
    setUser: (data) => set({ user: data }),
    refresh: true,
    setRefresh: (data) => set({ refresh: data }),
    pendingSpots: true,
    setPendingSpots: (data) => set({ pendingSpots: data })
}))
export default useUserStore;