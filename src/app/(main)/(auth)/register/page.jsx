'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { useState } from "react";
import { RxCross2 } from "react-icons/rx"

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    username: "", email: "", password: "", name: "", surname: "",
  });

  async function sendRegistration() {
    setLoading(true)
    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/register`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      router.push('/login')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
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
    <div className="w-full h-full flex justify-end items-start">
      <div className={`w-[90%] md:w-[40%] bg_login px-2 py-0.5 flex flex-col ${loading ? "animate-pulse pointer-events-none" : ""}`}>
        <section className="flex justify-between">
          <h1 className="text-4xl font-bold">REGISTER</h1>
          <RxCross2 size={38} onClick={() => router.push(`/`)} className="cursor-pointer" />
        </section>
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow-1 justify-around">
          <h1 className="text-2xl font-semibold">USERNAME</h1>
          <input className="bg-white py-2" required name="username" value={form.username} onChange={handleChange} placeholder="Username" />
          <h1 className="text-2xl font-semibold">NAME</h1>
          <input className="bg-white py-2" required name="name" value={form.name} onChange={handleChange} placeholder="Name" />
          <h1 className="text-2xl font-semibold">SURNAME</h1>
          <input className="bg-white py-2" required name="surname" value={form.surname} onChange={handleChange} placeholder="Surname" />
          <h1 className="text-2xl font-semibold">EMAIL</h1>
          <input className="bg-white py-2" required name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
          <h1 className="text-2xl font-semibold">PASSWORD</h1>
          <input className="bg-white py-2" required name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />
          {error && <p className="text-red-800 py-1">{error}</p>}
          <aside className="flex justify-between items-end py-1">
            <p className="text-xs">ALREADY HAVE AN ACCOUNT? <span className="underline"><Link href="/login">LOGIN</Link></span></p>
            <button
              disabled={loading}
              type="submit"
              className="bg-primary-500 text-2xl font-semibold w-1/3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "..." : "SUBMIT"}
            </button>
          </aside>
        </form>
      </div>
    </div>
  );
}