
import Globe from "./components/Globe";

export default function Map({searchParams}) {
  console.log(searchParams)
  return (
      <Globe searchParams={searchParams}/> 
  )
}