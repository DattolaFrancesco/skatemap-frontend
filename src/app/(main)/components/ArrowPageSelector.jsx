
'use client'
export default function ArrowPageSelector({ totalPages , currentPage, onPageChange}) {
  return (
    <div className="flex items-center gap-2 py-2">
      <button
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        className="disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        ←
      </button>
      <p className="text-sm">{currentPage + 1} / {totalPages}</p>
      <button
        disabled={currentPage >= totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        className="disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        →
      </button>
    </div>
  )
}