import "@/app/globals.css"
import InfoUser from "./components/InfoUser";
export default function DashBoardLayout({ children }) {
  return (
      <div className="w-screen min-h-screen flex flex-col p-3">
        <InfoUser/>
        <div className="bg-red-400 w-full">{children}</div>
      </div>
  );
}