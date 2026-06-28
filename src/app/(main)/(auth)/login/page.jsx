'use client'
import { useRef, useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { RxCross2 } from "react-icons/rx"
import useUserStore from "@/app/(account)/dashboard/components/UserStore";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useNavigationStore from "../../store/NavigationStore";
import TransitionLink from "../../components/TransitionLink";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Login() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState(null)
    const setUser = useUserStore((data) => data.setUser)
    const containerRef = useRef(null)
    const scopeContainerRef = useRef(null)
    const pendingHref = useNavigationStore((state) => state.pendingHref);
    const clearPendingHref = useNavigationStore((state) => state.clearPendingHref);
    const setStatusHref = useNavigationStore((state) => state.setStatusHref);
    const statusHref = useNavigationStore((state) => state.statusHref);
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
        try {
            const res = await fetch(`${API}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setUser(data)
            localStorage.setItem('token', data.message);
            await getUserId()
        } catch (err) {
            setError(err.message)
            setLoading(false)
        }
    }
    async function getUserId() {
        try {
            const res = await fetch(`${API}/account`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            router.push(`/dashboard`)
        } catch (err) {
            console.log(err.message)
            setLoading(false)
        }
    }
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
            <div ref={containerRef} className={`w-[90%] md:w-[40%]  ${loading ? "animate-pulse pointer-events-none" : ""}`}>
                <div className="button--glass button p-2">
                    <div className="p-3 bg_login rounded-[5px] flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold">LOGIN</h1>
                            <TransitionLink href="/" className="p-2 button--glass button rounded-[5px] bg-black/10">
                                <RxCross2 size={12} />
                            </TransitionLink>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <p className="text-[10px] tracking-widest text-black/50 font-bold">EMAIL</p>
                                <input
                                    className="button--glass button w-full px-2 py-2 text-xs rounded-[5px] focus:outline-none"
                                    required
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[10px] tracking-widest text-black/50 font-bold">PASSWORD</p>
                                <input
                                    className="button--glass button w-full px-2 py-2 text-xs rounded-[5px] focus:outline-none"
                                    required
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                />
                            </div>
                            {error && <p className="text-red-800 text-xs">{error}</p>}
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] tracking-widest">
                                    NO ACCOUNT?{" "}
                                    <TransitionLink
                                        className={`underline ${statusHref ? "disabled-btn" : ""}`}
                                        href="/register"
                                    >
                                        REGISTER
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