'use client'
import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({
    email: "", password: "",
  });
    function sendLogin() {
    const url = "http://localhost:3003/auth/login"

    fetch(url,{
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        })
      .then((res) => {
        if (res.ok) return res.json()

        return res.json().then(err => {
          throw new Error(err.message)
        })
      })
      .then((data) => {
        console.log(data)
          localStorage.setItem('token', JSON.stringify(data.message))
      })
      .catch(err => {
        console.log(err.message)
      })
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendLogin()
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col border-2">
      <input  required name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <input  required name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}