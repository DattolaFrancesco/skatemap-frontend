import "@/app/globals.css"
import InfoUser from "./components/InfoUser";
export default function DashBoardLayout({ children, searchParams }) {
  return (
      <div className="flex flex-col h-dvh landscape:h-auto landscape:min-h-dvh  overflow-hidden relative">
        <div className="shrink-0 flex px-3 pt-3">
          <InfoUser searchParams={searchParams}/>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-none landscape:overflow-visible flex flex-col">{children}</div>
      </div>
  );
}