
import SpotDetailPreview from "../components/SpotDetailPreview";
import SpotForm from "../components/SpotForm";

export default function SpotRegistration(){
   return(
    <div className="w-screen h-screen flex flex-col md:flex-row gap-3 p-3">
      <div className="w-full md:w-1/2 h-full">
        <SpotForm/>
      </div>
      <div className="w-full md:w-1/2 h-full">
        <SpotDetailPreview/>
      </div>
    </div>
  )
}