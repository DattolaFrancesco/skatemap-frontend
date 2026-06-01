
import { usePathname } from "next/navigation";
import TransitionLink from "./TransitionLink";
import useNavigationStore from "../store/NavigationStore";

export default function NavLinks({params}){
  const pathname = usePathname()
  const statusHref = useNavigationStore((state) => state.statusHref);
    return(
    <div className="flex flex-col right justify-between items-end gap-2">
      <div className="flex gap-1">
        <TransitionLink className={`nav-link ${pathname === "/grid"?"bg-primary-500 disabled-btn":""} ${statusHref?" disabled-btn":""}`} href={`/grid?${params?.toString()}`}>Grid</TransitionLink>
        <TransitionLink className={`nav-link ${pathname === "/"?"bg-primary-500 disabled-btn":""}  ${statusHref?" disabled-btn":""}`} href={`/?${params?.toString()}`}>Map</TransitionLink>
      </div>

      <div className="flex flex-wrap gap-1 justify-end">
        <TransitionLink className={`nav-link ${pathname === "/donate"?"bg-primary-500 disabled-btn":""}  ${statusHref?" disabled-btn":""}`} href={`/donate?${params?.toString()}`}>Donate</TransitionLink>
        <TransitionLink className={`nav-link ${statusHref?" disabled-btn":""}`} href={`/dashboard`}>Profile</TransitionLink>
        <TransitionLink className={`nav-link ${pathname === "/login"?"bg-primary-500 disabled-btn":""}  ${statusHref?" disabled-btn":""}`} href={`/login?${params?.toString()}`}>Login</TransitionLink>
      </div>

    </div>
    )
}