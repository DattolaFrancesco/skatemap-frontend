'use client'
import Link from "next/link";
import useUserStore from "./UserStore";
import { usePathname } from "next/navigation";
export default function LinkDashboard(){
    const pathname = usePathname()
    const user = useUserStore((data)=> data.user)
    const isAdmin = user?.authorities[0].authority === "admin" || user?.authorities[0].authority === "super_admin";
    const isSuperAdmin =  user?.authorities[0].authority === "super_admin";
    return(
        <div className="w-full flex gap-2  py-2 border-t border-b my-3">
                <Link href={"/dashboard/"} className={`nav-link ${pathname === "/dashboard"?" bg-black/50!":""}`}>SPOTS</Link>
                <Link href={"/dashboard/favourites"} className={`nav-link ${pathname === "/dashboard/favourites"?" bg-black/50!":""}`}>FAVOURITES</Link>
                {isAdmin && 
                <Link href={"/dashboard/requests"} className={`nav-link ${pathname === "/dashboard/requests"?" bg-black/50!":""}`}>REQUESTS</Link>}
                {isSuperAdmin && <Link href={"/dashboard/users"} className={`nav-link ${pathname === "/dashboard/users"?" bg-black/50!":""}`}>USERS</Link>}
                <Link href={"/dashboard/settings"} className={`nav-link ms-auto ${pathname === "/dashboard/settings"?" bg-black/50!":""}`}>SETTINGS</Link>
        </div>
    )
}