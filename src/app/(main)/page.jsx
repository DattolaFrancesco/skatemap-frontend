
import Globe from "./components/Globe";

export default function Map({searchParams}) {
  console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)
const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
console.log('Full URL:', url)
  return (
    <div className=" flex justify-center items-center ">
      <Globe searchParams={searchParams}/> 
    </div>
  )
}