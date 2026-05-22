'use client'
import { useEffect, useState } from "react";
import { getUser, getAllUserandAdmin, deleteUser, changeRole } from "@/app/generic/utils/user";
export default function SuperAdminHomePage(){
const [user, setUser] = useState({
    username: "", email: "",  name: "", surname: "",id:"",authorities:[]
});
const [loading, setLoading] = useState(true);
const [loadingUsers, setLoadingUsers] = useState(true);
const [users,setUsers] = useState([])

 async function fetchUser() {
    try {
      const data = await getUser();
      setUser({
        username: data.username,
        email: data.email,
        name: data.name,
        surname: data.surname,
        id: data.id,
        authorities: data.authorities
      });
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }
  async function fetchAllUsers() {
    try {
      const data = await getAllUserandAdmin();
        setUsers(data.content)
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoadingUsers(false);
    }
  }
  async function fetchDeleteUser(id) {
    try {
      const data = await deleteUser(id);
        console.log(data)
    } catch (err) {
      console.log(err.message);
    }
  }
  async function fetchChangeRole(id,value) {
    try {
      const data = await changeRole(id,value);
        console.log(data)
    } catch (err) {
      console.log(err.message);
    }
  }
useEffect(() => {
  fetchUser();
  fetchAllUsers()
}, []);
useEffect(()=>{
  console.log(user)
  console.log(users)
},[user,users])
    return (
        <>
        {!loading ? (
        <h1>ciao {user.username}</h1>
        ):(
            <h1>loading....</h1>
        )}
        {!loadingUsers? (
        users.map((u)=>(
         <div key={u.user.id} className="border-t-2  mx-2 flex justify-between">
            <div className="flex gap-1">
                <p>{u.user.username}</p>
                <p>{u.user.email}</p>
                <p>{u.user.name}</p>
                <p>{u.user.surname}</p>
                
            </div>
            <div>
                <select 
                defaultValue={u.user.authorities[0]?.authority}
                onChange={async(e)=>{
                    await fetchChangeRole(u.user.id,e.target.value)
                    await fetchAllUsers()
                }}>
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                </select>
            </div>
            <button onClick={async()=>{
                await fetchDeleteUser(u.user.id)
                await fetchAllUsers()
            }}>x</button>
         </div>
        ))
        ):(
        <h1>loading users....</h1>
        )}
        </>
    )}