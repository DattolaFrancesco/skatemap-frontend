export default function Loading() {
    return (
        <div className="flex flex-col gap-4 animate-pulse">

            {/* CHAT BOT */}
            <div className="flex justify-between py-3 border-b">
                <div className="h-5 w-24 bg-black/10 rounded" />
                <div className="h-6 w-14 bg-black/10 rounded-full" />
            </div>

            {/* THEME */}
            <div className="flex justify-between py-3 border-b">
                <div className="h-5 w-20 bg-black/10 rounded" />
                <div className="h-8 w-40 bg-black/10 rounded" />
            </div>

            {/* BG THEME */}
            <div className="flex justify-between py-3 border-b">
                <div className="h-5 w-24 bg-black/10 rounded" />
                <div className="h-8 w-40 bg-black/10 rounded" />
            </div>

        </div>
    )
}