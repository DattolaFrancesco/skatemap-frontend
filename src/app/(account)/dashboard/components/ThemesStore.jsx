import { create } from "zustand"
import { persist } from "zustand/middleware"

const useThemeStore = create(
  persist(
    (set) => ({
      theme: "theme-green",
      setTheme: (theme) => set({ theme }),

      bgTheme: "bg-white-custom",
      setBgTheme: (bgTheme) => set({ bgTheme }),
    }),
    {
      name: "theme-storage"
    }
  )
)

export default useThemeStore