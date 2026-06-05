"use client";

import { useEffect } from "react";

export default function BgThemeLoader() {
  useEffect(() => {
    const saved = localStorage.getItem("BgTheme");
    if (saved) {
       document.documentElement.classList.add(saved)
    }
  }, []);

  return null;
}