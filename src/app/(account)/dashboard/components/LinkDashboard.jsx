'use client'
import Link from "next/link";
import useUserStore from "./UserStore";
import { usePathname } from "next/navigation";
import { useRouter } from 'next/navigation';
export default function LinkDashboard(){
    const router = useRouter();
    const pathname = usePathname()
    const user = useUserStore((data)=> data.user)
    const role = user?.authorities?.[0];
   const isAdmin =
      role === "admin" || role === "super_admin";
    const isSuperAdmin =
    role === "super_admin";
    if(!user)
    return(
        <div className="w-full flex flex-wrap justify-between gap-2 py-2  ">
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
        <div className="w-full flex flex-wrap justify-between gap-2  py-3 ">
               <div className="flex flex-wrap gap-2">
                    <Link href={"/dashboard/"} className={`nav-link ${pathname === "/dashboard"?"bg-primary-500":""}`}>MY SPOTS</Link>
                      {isAdmin && <Link href={"/dashboard/allSpot"} className={`nav-link ${pathname === "/dashboard/allSpot"?" bg-primary-500":""}`}>ALL SPOTS</Link>}
                    <Link href={"/dashboard/favourites"} className={`nav-link ${pathname === "/dashboard/favourites"?" bg-primary-500":""}`}>FAVOURITES</Link>
                    {isAdmin && 
                    <Link href={"/dashboard/requests"} className={`relative nav-link ${pathname === "/dashboard/requests"?" bg-primary-500":""}`}>
                      REQUESTS
                   {user.existPending > 0 && <div className="absolute rounded-full w-2 h-2 top-[-3] right-[-3] bg-red-500 text-[10px] animate-pulse"></div>}
                    </Link>}
                    {isSuperAdmin && <Link href={"/dashboard/users"} className={`nav-link ${pathname === "/dashboard/users"?" bg-primary-500":""}`}>USERS</Link>}
                    <Link href={"/dashboard/settings"} className={`nav-link ${pathname === "/dashboard/settings"?" bg-primary-500":""}`}>SETTING</Link>
               </div>
               <div className="flex gap-2">
                 <Link href={"/spot/registration"} className={`nav-link `}>ADD SPOT</Link>
                <button onClick={()=>{
                localStorage.removeItem('token')
                router.push("/login")
               }} className={`nav-link`}>LOG OUT</button>
               </div>
        </div>
    )
}       