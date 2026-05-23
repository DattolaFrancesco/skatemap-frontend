import "@/app/globals.css"
import InfoUser from "./components/InfoUser";
import LinkDashboard from "./components/LinkDashboard";
export default function DashBoardLayout({ children, searchParams }) {
  return (
      <div className="w-screen min-h-screen flex flex-col p-3">
        <InfoUser/>
        <LinkDashboard searchParams={searchParams}/>
        <div className="w-full">{children}</div>
      </div>
  );
}