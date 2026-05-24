'use client'
import { useEffect, useState } from "react";
import { getAllUserandAdmin, deleteUser, changeRole } from "@/app/(account)/dashboard/components/user";
import { RxCross2 } from "react-icons/rx";

export default function User() {
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [users, setUsers] = useState([]);
    const [askPermission, setAskPermission] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({message:"",type:""})
    const [eliminationUser, setEliminationUser] = useState(null)

  async function fetchAllUsers() {
    try {
      const data = await getAllUserandAdmin();
      setUsers(data.content);
      console.log(data)
       setLoading(false)

    } catch (err) { console.log(err.message) }
    finally { setLoadingUsers(false); setLoading(false) }
  }

  async function fetchDeleteUser(id) {
    setLoading(true)
    try {
      await deleteUser(id);
      await fetchAllUsers();
      setAskPermission(false)
    } catch (err) { 
        setAskPermission(false)
     }
  }

  async function fetchChangeRole(id, value) {
    try {
      await changeRole(id, value);
      await fetchAllUsers();
    } catch (err) { console.log(err.message) }
  }
    function askConfermation(user){
         setAskPermission(true)
         setEliminationUser(user)
    }
  useEffect(() => {  fetchAllUsers(); }, [loading]);

  if (loadingUsers) return <h1 className="text-2xl  animate-pulse mt-2">Loading users...</h1>
  if (!users || users.length === 0) return <h1 className="text-2xl mt-2">No users found</h1>

  return (
    <div className="w-full flex flex-col ">
            {message.type === "bad" ?
            <div className="absolute bottom-10 right-10 bg-black/20 animate-bounce"><h1 className="text-red-500 text-2xl px-3 py-1">{message.message}</h1></div>:null}
            {message.type === "good" ?
            <div className="absolute bottom-10 right-10 bg-black/20 animate-bounce"><h1 className="bg-green-600 text-2xl px-3 py-1 text-white">{message.message}</h1></div>:null}
            <div className={` ${askPermission ? "block" : "hidden"} fixed h-full  inset-0 z-50 bg-black/40 overflow-hidden`}>
                <div className="w-full h-full flex justify-center items-center" >
                  <div className={`bg-white ${loading ? "animate-pulse" : ""}`}>
                        <h1 className="text-red-800 text-4xl p-5">do you realy want to delete {eliminationUser?.name}?</h1>
                       <div className="flex justify-center gap-3 p-3">
                            <button onClick={()=>fetchDeleteUser(eliminationUser.id)} className="px-5">Yes</button>
                            <button onClick={()=>setAskPermission(false)} className="px-5">No</button>
                       </div>
                  </div>
                </div>
            </div>
      {users.map((u) => (
        <div key={u.user.id} className="grid grid-col-2 sm:grid-cols-3 md:grid-cols-[1fr_1fr_1fr_1fr_100px_30px] gap-2 items-center py-2 border-b">
          <p className="px-3  text-sm lg:text-lg bg-amber-50 ">{u.user.username}</p>
          <p className="px-3  text-sm lg:text-lg bg-amber-50 ">{u.user.name}</p>
          <p className="px-3  text-sm lg:text-lg bg-amber-50 ">{u.user.surname}</p>
          <p className="px-3  text-sm lg:text-lg bg-amber-50 ">{u.user.email}</p>
          <select
            className="bg_login py-1"
            defaultValue={u.user.authorities[0]?.authority}
            onChange={async (e) => await fetchChangeRole(u.user.id, e.target.value)}
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <button
            onClick={() => askConfermation(u.user)}
            className="flex items-center justify-center ms-auto w-7 h-7 hover:bg-black/10 cursor-pointer"
          >
            <RxCross2 size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}