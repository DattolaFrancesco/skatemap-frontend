export default function Loading() {
    return (
        <div className="p-3">
            <div className="w-full flex flex-col gap-1">
                <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_100px_80px] gap-2 items-center px-2 py-1">
                    {["Username", "Name", "Surname", "Email", "Role", ""].map((h) => (
                        <p key={h} className="text-[10px] tracking-widest text-white/40 font-bold">{h}</p>
                    ))}
                </div>

                {[...Array(6)].map((_, i) => (
                    <div key={i} className="button--glass button p-1.5 rounded-[5px]">
                        <div className="bg_login grid grid-cols-3 md:grid-cols-[1fr_1fr_1fr_1fr_100px_80px] gap-2 items-center px-2 py-2 rounded-[5px]">
                            <div className="h-3 bg-black/10 animate-pulse rounded-[4px]" style={{ width: "70%" }} />
                            <div className="h-3 bg-black/10 animate-pulse rounded-[4px]" style={{ width: "60%" }} />
                            <div className="h-3 bg-black/10 animate-pulse rounded-[4px]" style={{ width: "65%" }} />
                            <div className="h-3 bg-black/10 animate-pulse rounded-[4px]" style={{ width: "80%" }} />
                            <div className="h-6 bg-black/10 animate-pulse rounded-[5px] col-start-1 md:col-start-5" style={{ width: "55px" }} />
                            <div className="h-6 bg-black/10 animate-pulse rounded-[5px] col-span-2 md:col-span-1" style={{ width: "60px" }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}