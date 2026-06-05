import "@/app/globals.css"
import InfoUser from "./components/InfoUser";
import LinkDashboard from "./components/LinkDashboard";
export default function DashBoardLayout({ children, searchParams }) {
  return (
      <div className="w-full min-h-dvh flex flex-col p-3 overflow-x-hidden">
        <div className="h-[230px] shrink-0 flex flex-col justify-between">
          <InfoUser/>
          <LinkDashboard searchParams={searchParams}/>
        </div>
        <div className="w-full flex-1">{children}</div>
      </div>
  );
}