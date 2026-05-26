
import Link from "next/link";
import { usePathname } from "next/navigation";
import TransitionLink from "./TransitionLink";
import useNavigationStore from "../store/NavigationStore";
import { useEffect } from "react";

export default function NavLinks({params}){
  const pathname = usePathname()
  const statusHref = useNavigationStore((state) => state.statusHref);
    return(
    <div className="flex flex-col right justify-between items-end gap-2">
      <div className="flex gap-1">
        <TransitionLink className={`nav-link ${pathname === "/grid"?"bg-primary-500":""} ${statusHref?" disabled-btn":""}`} href={`/grid?${params?.toString()}`}>Grid</TransitionLink>
        <TransitionLink className={`nav-link ${pathname === "/"?"bg-primary-500":""}  ${statusHref?" disabled-btn":""}`} href={`/?${params?.toString()}`}>Map</TransitionLink>
      </div>

      <div className="flex flex-wrap gap-1 justify-end">
        <Link className="nav-link" href="/donate">Donate</Link>
        <Link className="nav-link" href="/dashboard">Profile</Link>
        <Link className="nav-link" href="/login">Login</Link>
      </div>

    </div>
    )
}