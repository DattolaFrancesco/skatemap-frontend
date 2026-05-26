import { create } from "zustand";
const useThemeStore = create((set)=>({
    theme: localStorage.getItem("theme"),
    setTheme: (data) => set({ theme: data }),
    bgTheme: null,
    setBgTheme: (data) => set({ bgTheme: data })
}))
export default useThemeStore;