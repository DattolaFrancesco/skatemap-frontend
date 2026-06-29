'use client'
import useNavigationStore from "../store/NavigationStore";
import useSpotStore from "../store/SpotStore";
import useUserStore from "@/app/(account)/dashboard/components/UserStore";

export default function TransitionLink({ href, children, className }) {
  const setPendingHref = useNavigationStore((state) => state.setPendingHref);
  const setUser = useUserStore((data) => data.setUser)
  const setAllSpots = useSpotStore((s) => s.setAllSpots)
  const setFilteredSpot = useSpotStore((s) => s.setFilteredSpot)
  const setSpot = useSpotStore((s) => s.setSpot)
  return (
    <button type="button" className={className} onClick={() => {
      if(children === "Log out"){
        localStorage.removeItem('token')
        setUser(null)
        setAllSpots(null)
        setFilteredSpot(null)
        setSpot(null)
      }
      setPendingHref(href)}}>
      {children}
    </button>
  );
}