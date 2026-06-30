export default function Loading() {
    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40">
            <div className="w-2/3 md:w-1/3 p-2 button--glass button rounded-[5px]">
                <div className="w-full bg_login rounded-[5px] flex flex-col items-center gap-4 py-8 px-5">
                    <div className="relative w-12 h-12">
                        <div className="absolute inset-0 rounded-full border-2 border-white/20" />
                        <div className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    </div>
                    <p className="text-white text-sm md:text-base tracking-wide animate-pulse">
                        Loading spots...
                    </p>
                </div>
            </div>
        </div>
    )
}