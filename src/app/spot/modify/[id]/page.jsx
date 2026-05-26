import ModifySpotForm from "../../components/ModifySpotForm";


export default function ModifySpot(){
   return(
    <div className="w-screen h-screen flex flex-col md:flex-row gap-3 p-3">
      <div className="w-full md:w-1/2 h-full">
       <ModifySpotForm/>
      </div>
      <div className="w-full md:w-1/2 h-full">
      </div>
    </div>
  )
}