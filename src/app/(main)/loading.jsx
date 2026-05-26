"use client";

import { useEffect, useState } from "react";

export default function Loading() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 450);
  }, []);
    return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center ${
        isMobile ? "justify-start" : "absolute top-[-50%] translate-y-1/2 bg-image justify-center" }`}
    >
      <div className="aspect-square w_custom_globe rounded-full overflow-hidden"> 
        <div className="w-full h-full rounded-full bg-[#1a1a1a] animate-pulse flex items-center justify-center">
           <div className="w-3/4 h-3/4 rounded-full border border-white/5" /> 
           <div className="absolute w-1/2 h-px bg-white/5" /> 
           <div className="absolute w-px h-1/2 bg-white/5" /> 
        </div> 
      </div>
    </div>)}