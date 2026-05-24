import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks({params}){
  const pathname = usePathname()
    return(
    <div className="flex flex-col right justify-between items-end gap-2">
      <div className="flex gap-1">
        <Link className={`nav-link ${pathname === "/grid"?"bg-black/40!":""}`} href={`/grid?${params?.toString()}`}>Grid</Link>
        <Link className={`nav-link ${pathname === "/"?"bg-black/40!":""}`} href={`/?${params?.toString()}`}>Map</Link>
      </div>

      <div className="flex gap-1">
        <Link className="nav-link" href="/donate">Donate</Link>
        <Link className="nav-link" href="/login">Login/Signup</Link>
        <Link className="nav-link" href="/dashboard">Profile</Link>
      </div>

    </div>
    )
}