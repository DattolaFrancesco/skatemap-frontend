
import Globe from "./components/Globe";

export default function Map({searchParams}) {
  return (
    <div className="flex justify-center items-center h-full">
      <Globe searchParams={searchParams}/>
    </div>
  )
}