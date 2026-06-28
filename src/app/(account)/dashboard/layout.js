import "@/app/globals.css"
import InfoUser from "./components/InfoUser";
export default function DashBoardLayout({ children, searchParams }) {
  return (
      <div className="flex flex-col h-dvh landscape:h-auto landscape:min-h-dvh relative p-3">
        <div className="shrink-0 flex">
          <InfoUser searchParams={searchParams}/>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-none landscape:overflow-visible">{children}</div>
      </div>
  );
}