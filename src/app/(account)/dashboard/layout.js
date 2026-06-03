import "@/app/globals.css"
import InfoUser from "./components/InfoUser";
import LinkDashboard from "./components/LinkDashboard";
export default function DashBoardLayout({ children, searchParams }) {
  return (
      <div className="w-screen min-h-screen flex flex-col p-3">
        <div className="h-[230px] shrink-0 flex flex-col justify-between">
          <InfoUser/>
          <LinkDashboard searchParams={searchParams}/>
        </div>
        <div className="w-full h-full">{children}</div>
      </div>
  );
}