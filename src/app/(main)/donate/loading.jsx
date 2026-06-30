export default function Loading() {
    return (
        <main className="justify-center items-center ps-2 flex flex-col flex-1">
            <div className="w-5/6 md:w-1/2">
                <div className="button--glass button p-2 animate-pulse">
                    <div className="p-3 bg_login rounded-[5px]">
                        <div className="flex justify-between items-center">
                            <div className="h-7 bg-black/10 rounded-[4px]" style={{ width: "110px" }} />
                            <div className="h-6 w-6 bg-black/10 rounded-[5px]" />
                        </div>
                        <div className="h-2 bg-black/10 rounded-[4px] mt-2 mb-3" style={{ width: "130px" }} />
                        <div className="h-3 bg-black/10 rounded-[4px] w-full mb-1" />
                        <div className="h-3 bg-black/10 rounded-[4px] w-5/6 mb-3" />

                        <div className="h-5 bg-black/10 rounded-[4px] my-5" style={{ width: "180px" }} />

                        <article className="flex gap-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-1/3 aspect-video button--glass button flex flex-col items-center justify-center gap-1">
                                    <div className="h-6 bg-black/10 rounded-[4px]" style={{ width: "40px" }} />
                                    <div className="h-2 bg-black/10 rounded-[4px]" style={{ width: "60px" }} />
                                </div>
                            ))}
                        </article>

                        <div className="mt-3 w-full button--glass button h-12" />
                        <div className="mt-1 mb-5 h-2 bg-black/10 rounded-[4px] w-full" style={{ height: "0px" }} />
                        <div className="mb-5 h-3 bg-black/10 rounded-[4px] w-full" />
                        <div className="button--glass button w-full h-14" />
                    </div>
                </div>
            </div>
        </main>
    )
}