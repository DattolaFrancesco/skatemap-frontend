import Link from "next/link";

export default function NavLinks(){
    return(
    <div className="flex flex-col right justify-between items-end gap-2">
      <div className="flex gap-3">
        <Link className="nav-link" href="/grid">Grid</Link>
        <Link className="nav-link" href="/">Map</Link>
      </div>

      <div className="flex gap-3">
        <Link className="nav-link" href="/donate">Donate</Link>
        <Link className="nav-link" href="/login">Login/Signup</Link>
      </div>

    </div>
    )
}