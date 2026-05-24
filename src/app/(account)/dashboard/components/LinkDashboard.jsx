'use client'
import Link from "next/link";
import useUserStore from "./UserStore";
import { usePathname } from "next/navigation";
import { useRouter } from 'next/navigation';
export default function LinkDashboard(){
    const router = useRouter();
    const pathname = usePathname()
    const user = useUserStore((data)=> data.user)
    const isAdmin = user?.authorities[0].authority === "admin" || user?.authorities[0].authority === "super_admin";
    const isSuperAdmin =  user?.authorities[0].authority === "super_admin";
    if(!user)
    return(
        <div className="w-full flex flex-wrap justify-between gap-2 py-2 border-t border-b mt-3">
          <div className="flex gap-2">      
            <div className="nav-link w-16 h-5 animate-pulse bg-black/20" />
            <div className="nav-link w-20 h-5 animate-pulse bg-black/20" />
            <div className="nav-link w-20 h-5 animate-pulse bg-black/20" />
            <div className="nav-link w-16 h-5 animate-pulse bg-black/20" />
          </div>
          <div className="flex">
            <div className="nav-link w-16 h-5 animate-pulse bg-black/20" />
          </div>
        </div>
    )
    return(
        <div className="w-full flex flex-wrap justify-between gap-2  py-2 border-t border-b mt-3">
               <div className="flex gap-2">
                    <Link href={"/dashboard/"} className={`nav-link ${pathname === "/dashboard"?" bg-black/50!":""}`}>SPOTS</Link>
                    <Link href={"/dashboard/favourites"} className={`nav-link ${pathname === "/dashboard/favourites"?" bg-black/50!":""}`}>FAVOURITES</Link>
                    {isAdmin && 
                    <Link href={"/dashboard/requests"} className={`nav-link ${pathname === "/dashboard/requests"?" bg-black/50!":""}`}>REQUESTS</Link>}
                    {isSuperAdmin && <Link href={"/dashboard/users"} className={`nav-link ${pathname === "/dashboard/users"?" bg-black/50!":""}`}>USERS</Link>}
               </div>
               <div className="flex"><button onClick={()=>{
                localStorage.removeItem('token')
                router.push("/login")
               }} className={`nav-link`}>LOG OUT</button></div>
        </div>
    )
}       