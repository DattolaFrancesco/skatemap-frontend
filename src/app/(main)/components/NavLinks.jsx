import Link from "next/link";

export default function NavLinks({params}){
    return(
    <div className="flex flex-col right justify-between items-end gap-2">
      <div className="flex gap-1">
        <Link className="nav-link" href={`/grid?${params?.toString()}`}>Grid</Link>
        <Link className="nav-link" href={`/?${params?.toString()}`}>Map</Link>
      </div>

      <div className="flex gap-1">
        <Link className="nav-link" href="/donate">Donate</Link>
        <Link className="nav-link" href="/login">Login/Signup</Link>
        <Link className="nav-link" href="/dashboard">Profile</Link>
      </div>

    </div>
    )
}