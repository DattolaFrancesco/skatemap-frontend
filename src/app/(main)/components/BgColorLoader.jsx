"use client";

import { useEffect } from "react";
import useThemeStore from "@/app/(account)/dashboard/components/ThemesStore";
export default function BgThemeLoader() {
    
    const bgTheme = useThemeStore((data) => data.bgTheme)
    
  useEffect(() => {
    const saved = localStorage.getItem("BgTheme");
    console.log(bgTheme)
    if (bgTheme === "bg-white-custom") {
       document.documentElement.classList.add("bg-bg-white")
    }
    if(bgTheme === "bg-dark-custom") document.documentElement.classList.add("bg-bg-black")
  }, [bgTheme]);

  return null;
}