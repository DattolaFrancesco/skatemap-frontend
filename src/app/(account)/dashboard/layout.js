import "@/app/globals.css"
import InfoUser from "./components/InfoUser";
import LinkDashboard from "./components/LinkDashboard";
export default function DashBoardLayout({ children, searchParams }) {
  return (
      <div className="flex flex-col h-dvh landscape:h-auto landscape:min-h-dvh relative p-3">
        <div className="h-[230px] shrink-0 flex flex-col justify-between">
          <InfoUser/>
          <LinkDashboard searchParams={searchParams}/>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-none landscape:overflow-visible">{children}</div>
      </div>
  );
}