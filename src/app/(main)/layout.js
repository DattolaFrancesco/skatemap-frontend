import "@/app/globals.css"
import NavBar from "./components/NavBar";
import OpenMedia from "./components/OpenMedia";

export default function NavLayout({ children }) {
  return (
  <>
  <div className="flex flex-col h-dvh landscape:h-auto landscape:min-h-dvh relative">
    <NavBar/>
    <div className="flex-1 overflow-y-auto overscroll-none landscape:overflow-visible">
      {children}
    </div>
    <OpenMedia/>
  </div>
  </>
  );
}