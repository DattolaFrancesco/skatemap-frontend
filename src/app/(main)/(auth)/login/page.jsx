'use client'
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { RxCross2 } from "react-icons/rx"
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendLogin()
  };

  async function sendLogin() {
    setLoading(true)
    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem('token', data.message);
      await getUserId()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  async function getUserId() {
    try {
      const res = await fetch("http://localhost:3003/account", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      router.push(`/dashboard`)
    } catch(err) {
      console.log(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-full flex justify-end items-start">
      <div className={`w-[90%] md:w-[40%] bg_login px-2 py-0.5 flex flex-col ${loading ? "animate-pulse pointer-events-none" : ""}`}>
        <section className="flex justify-between">
          <h1 className="text-4xl font-bold">LOGIN</h1>
          <RxCross2 size={38} onClick={() => router.push(`/`)} className="cursor-pointer" />
        </section>
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow-1 justify-around">
          <h1 className="text-2xl font-semibold">EMAIL</h1>
          <input
            className="bg-white py-2"
            required name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
          <h1 className="text-2xl font-semibold">PASSWORD</h1>
          <input
            className="bg-white py-2"
            required name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />
          {error && <p className="text-red-800 py-1">{error}</p>}
          <aside className="flex justify-between items-end py-1">
            <p className="text-xs">IF YOU DON'T HAVE AN ACCOUNT YET <span className="underline"><Link href="/register">REGISTER</Link></span></p>
            <button
              disabled={loading}
              type="submit"
              className="bg-black/30 hover:bg-black/40 text-2xl font-semibold w-1/3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "..." : "SUBMIT"}
            </button>
          </aside>
        </form>
      </div>
    </div>
  );
}