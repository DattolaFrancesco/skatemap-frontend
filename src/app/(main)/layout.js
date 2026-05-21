import "@/app/globals.css"
import NavBar from "./components/NavBar";
export default function NavLayout({ children }) {
  return (
  <>
   <div className="flex flex-col h-screen">
      <NavBar/>
      <main className="flex-1 relative">{children}</main>
   </div>
  </>
  );
}