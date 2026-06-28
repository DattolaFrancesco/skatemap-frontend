'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from "react";
import { RxCross2 } from "react-icons/rx"
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useNavigationStore from '../../store/NavigationStore';
import TransitionLink from '../../components/TransitionLink';

export default function Register() {
    const router = useRouter();
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const containerRef = useRef(null)
    const scopeContainerRef = useRef(null)
    const pendingHref = useNavigationStore((state) => state.pendingHref);
    const clearPendingHref = useNavigationStore((state) => state.clearPendingHref);
    const setStatusHref = useNavigationStore((state) => state.setStatusHref);
    const statusHref = useNavigationStore((state) => state.statusHref);
    const [form, setForm] = useState({ username: "", email: "", password: "", name: "", surname: "" });
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
    useGSAP(() => {
        if (!containerRef.current) return
        gsap.killTweensOf(containerRef.current)
        gsap.set(containerRef.current, { yPercent: -300 })
        gsap.to(containerRef.current, {
            yPercent: 0,
            duration: 0.75,
            ease: "power3.inOut",
            onComplete: () => { setStatusHref(false) }
        })
    }, { dependencies: [scopeContainerRef] })
    useEffect(() => {
        if (!pendingHref) return
        setStatusHref(true)
        gsap.killTweensOf(containerRef.current)
        gsap.to(containerRef.current, {
            yPercent: -300,
            duration: 0.75,
            ease: "power3.inOut",
            onComplete: () => {
                clearPendingHref()
                router.push(pendingHref)
            }
        })
    }, [pendingHref])
    return (
        <div ref={scopeContainerRef} className="w-full flex-1  flex justify-center items-center overflow-hidden">
            <div ref={containerRef} className={`w-[90%] md:w-[40%] ${loading ? "animate-pulse pointer-events-none" : ""}`}>
                <div className="button--glass button p-2">
                    <div className="p-3 bg_login rounded-[5px] flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold">REGISTER</h1>
                            <TransitionLink href="/" className="p-2 button--glass button rounded-[5px] bg-black/10">
                                <RxCross2 size={12} />
                            </TransitionLink>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <p className="text-[10px] tracking-widest text-black/50 font-bold">USERNAME</p>
                                <input className="button--glass button w-full px-2 py-2 text-xs rounded-[5px] focus:outline-none" required name="username" value={form.username} onChange={handleChange} placeholder="username" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[10px] tracking-widest text-black/50 font-bold">NAME</p>
                                <input className="button--glass button w-full px-2 py-2 text-xs rounded-[5px] focus:outline-none" required name="name" value={form.name} onChange={handleChange} placeholder="Name" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[10px] tracking-widest text-black/50 font-bold">SURNAME</p>
                                <input className="button--glass button w-full px-2 py-2 text-xs rounded-[5px] focus:outline-none" required name="surname" value={form.surname} onChange={handleChange} placeholder="Surname" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[10px] tracking-widest text-black/50 font-bold">EMAIL</p>
                                <input className="button--glass button w-full px-2 py-2 text-xs rounded-[5px] focus:outline-none" required name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@example.com" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[10px] tracking-widest text-black/50 font-bold">PASSWORD</p>
                                <input className="button--glass button w-full px-2 py-2 text-xs rounded-[5px] focus:outline-none" required name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
                            </div>
                            {error && <p className="text-red-800 text-xs">{error}</p>}
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] tracking-widest">
                                    ALREADY HAVE AN ACCOUNT?{" "}
                                    <TransitionLink className={`underline ${statusHref ? "disabled-btn" : ""}`} href="/login">
                                        LOGIN
                                    </TransitionLink>
                                </p>
                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="button--glass button bg-black/10 text-sm font-bold tracking-widest px-4 py-2 rounded-[5px] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "..." : "SUBMIT"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}