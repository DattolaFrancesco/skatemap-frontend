import { create } from "zustand";
const useUserStore = create((set)=>({
    user: null,
    setUser: (data) => set({ user: data }),
    refresh: true,
    setRefresh: (data) => set({ refresh: data })
}))
export default useUserStore;