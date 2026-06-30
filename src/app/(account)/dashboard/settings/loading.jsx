export default function Loading() {
    return (
        <div className="flex flex-col gap-2 p-3">
            {[...Array(2)].map((_, i) => (
                <div key={i} className="button--glass button p-2 rounded-[5px] flex justify-between items-center gap-4">
                    <div className="bg_login rounded-[5px] px-2 py-1">
                        <div className="h-3 bg-black/10 animate-pulse rounded-[4px]" style={{ width: "90px" }} />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 bg-black/10 animate-pulse rounded-[4px]" style={{ width: "20px" }} />
                        <div className="relative w-10 h-5 rounded-full button--glass button">
                            <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-black/10 animate-pulse" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}