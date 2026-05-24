
    'use client'
import { useRouter, useSearchParams } from "next/navigation"

export default function ArrowPageSelector({ totalPages }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = parseInt(searchParams.get("page") || "0")

  function goToPage(page) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex items-center gap-2 py-2">
      <button
        disabled={currentPage === 0}
        onClick={() => goToPage(currentPage - 1)}
        className="disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        ←
      </button>
      <p className="text-sm">{currentPage + 1} / {totalPages}</p>
      <button
        disabled={currentPage >= totalPages - 1}
        onClick={() => goToPage(currentPage + 1)}
        className="disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        →
      </button>
    </div>
  )
}