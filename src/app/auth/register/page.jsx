'use client'
import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    username: "", email: "", password: "", name: "", surname: "",
  });
    function sendRegistration() {
    const url = "http://localhost:3003/auth/register"

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
    sendRegistration()
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col border-2">
      <input  required name="username" value={form.username} onChange={handleChange} placeholder="Username" />
      <input  required name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <input  required name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />
      <input  required name="name" value={form.name} onChange={handleChange} placeholder="Nome" />
      <input  required name="surname" value={form.surname} onChange={handleChange} placeholder="Cognome" />
      <button type="submit">Register</button>
    </form>
  );
}