'use client'
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "", password: "",
  });
   const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendLogin()
  };
async function sendLogin() {
  const url = "http://localhost:3003/auth/login";
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    localStorage.setItem('token', data.message);
    getUserId()
  } catch (err) {
    console.log(err.message);
  }
}
async function getUserId(){
  const url = "http://localhost:3003/account";
  try{
    const res = await fetch(url,{
      method:"GET",
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    })
    const data = await res.json();
    if(!res.ok) throw new Error(data.message);
    router.push(`/auth/superadmin/${data.id}`)
    console.log(data)
  }
  catch(err){
    console.log(err.message);
  }
}

  return (
    <form onSubmit={handleSubmit} className="flex flex-col border-2">
      <input  required name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <input  required name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}