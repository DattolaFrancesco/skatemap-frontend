'use client'
import useNavigationStore from "../store/NavigationStore";

export default function TransitionLink({ href, children, className }) {
  const setPendingHref = useNavigationStore((state) => state.setPendingHref);

  return (
    <button type="button" className={className} onClick={() => {setPendingHref(href)}}>
      {children}
    </button>
  );
}