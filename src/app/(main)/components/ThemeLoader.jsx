"use client";

import { useEffect } from "react";

export default function ThemeLoader() {
  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved) {
      document.documentElement.classList.add(saved)
    }
  }, []);

  return null;
}