import { create } from "zustand";
const useUserStore = create((set)=>({
    user: null,
    setUser: (data) => set({ user: data })
}))
export default useUserStore;