
import SpotDetailPreview from "./components/SpotDetailPreview";
import SpotForm from "./components/SpotForm";

export default function SpotRegistration(){
  return(
    <div className="w-screen h-screen grid grid-cols-[repeat(auto-fit,minmax(500px,1fr))] gap-3">
       <SpotForm/>
      <div className="w-full">
        <SpotDetailPreview/>
      </div>
    </div>
  )
}