export default function Loading() {
    return (
        <div className="w-full flex-1 flex justify-center items-center overflow-hidden">
            <div className="w-[90%] md:w-[40%]">
                <div className="button--glass button p-2 animate-pulse">
                    <div className="p-3 bg_login rounded-[5px] flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <div className="h-7 bg-black/10 rounded-[4px]" style={{ width: "130px" }} />
                            <div className="h-6 w-6 bg-black/10 rounded-[5px]" />
                        </div>
                        <div className="flex flex-col gap-3">
                            {["USERNAME", "NAME", "SURNAME", "EMAIL", "PASSWORD"].map((label) => (
                                <div key={label} className="flex flex-col gap-1">
                                    <div className="h-2 bg-black/10 rounded-[4px]" style={{ width: `${label.length * 6}px` }} />
                                    <div className="h-9 bg-black/10 rounded-[5px] w-full" />
                                </div>
                            ))}
                            <div className="flex justify-between items-center">
                                <div className="h-2 bg-black/10 rounded-[4px]" style={{ width: "150px" }} />
                                <div className="h-9 bg-black/10 rounded-[5px]" style={{ width: "90px" }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}