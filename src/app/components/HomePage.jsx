'use client'

import Image from "next/image"
import TestLibre from "@/app/components/TestLibre"


export default function HomePage() {

  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center">
        <TestLibre/>
      </div>
    </>
  )
}