import "@/app/globals.css"
import NavBar from "./components/NavBar";
export default function NavLayout({ children }) {
  return (
  <>
   <div className="flex flex-col h-screen relative">
      <NavBar/>
      {children}
   </div>
  </>
  );
}