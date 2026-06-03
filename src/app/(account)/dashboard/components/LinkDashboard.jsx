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
               <div className="flex flex-wrap gap-1 border-b pb-2 border-primary-500">
                    <Link href={"/dashboard/"} className={`nav-link text-sm md:text-base ${pathname === "/dashboard"?"bg-primary-500":""}`}>MY SPOTS</Link>
                      {isAdmin && <Link href={"/dashboard/allSpot"} className={`nav-link text-sm md:text-base ${pathname === "/dashboard/allSpot"?" bg-primary-500":""}`}>ALL SPOTS</Link>}
                    <Link href={"/dashboard/favourites"} className={`nav-link text-sm md:text-base ${pathname === "/dashboard/favourites"?" bg-primary-500":""}`}>FAV</Link>
                    {isAdmin && 
                    <Link href={"/dashboard/requests"} className={`relative nav-link text-sm md:text-base ${pathname === "/dashboard/requests"?" bg-primary-500":""}`}>
                      REQUESTS
                   {user.existPending > 0 && <div className="absolute rounded-full w-2 h-2 top-[-3] right-[-3] bg-red-500 text-[10px] animate-pulse"></div>}
                    </Link>}
                    {isSuperAdmin && <Link href={"/dashboard/users"} className={`nav-link text-sm md:text-base ${pathname === "/dashboard/users"?" bg-primary-500":""}`}>USERS</Link>}
                    <Link href={"/dashboard/settings"} className={`nav-link text-sm md:text-base ${pathname === "/dashboard/settings"?" bg-primary-500":""}`}>SETTING</Link>
                    <Link href={"/spot/registration"} className={`hidden md:block ms-auto nav-link w-fit text-center whitespace-nowrap text-sm md:text-base`}>ADD SPOT</Link>
               </div>
    )
}       