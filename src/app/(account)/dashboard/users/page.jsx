'use client'
import { useEffect, useState, useRef } from "react";
import { getAllUserandAdmin, deleteUser, changeRole } from "@/app/(account)/dashboard/components/user";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRouter } from "next/navigation";
import useNavigationStore from "@/app/(main)/store/NavigationStore";

export default function User() {
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [users, setUsers] = useState([]);
    const [askPermission, setAskPermission] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ message: "", type: "" })
    const [eliminationUser, setEliminationUser] = useState(null)
    const smallContainerRef = useRef(null)
    const containerPermissionRef = useRef(null)
    const permissionRef = useRef(null)
    const timelinePermissionRef = useRef(null)
    const router = useRouter();
    const setStatusHref = useNavigationStore((state) => state.setStatusHref);
    const clearPendingHref = useNavigationStore((state) => state.clearPendingHref);
    const pendingHref = useNavigationStore((state) => state.pendingHref);

    async function fetchAllUsers() {
        try {
            const data = await getAllUserandAdmin();
            setUsers(data.content);
        } catch (err) { console.log(err.message) }
        finally { setLoadingUsers(false); setLoading(false) }
    }

    async function fetchDeleteUser(id) {
        setLoading(true)
        try {
            await deleteUser(id);
            await fetchAllUsers();
            setAskPermission(false)
        } catch (err) { setAskPermission(false) }
    }

    async function fetchChangeRole(id, value) {
        try {
            await changeRole(id, value);
            await fetchAllUsers();
        } catch (err) { console.log(err.message) }
    }

    function askConfermation(user) {
        setAskPermission(true)
        setEliminationUser(user)
    }

    useEffect(() => { fetchAllUsers(); }, [loading]);

    useGSAP(() => {
        if (!smallContainerRef.current) return
        const els = gsap.utils.toArray(document.querySelectorAll(".users"))
        if (!els.length) return
        gsap.set(els, { yPercent: 200, opacity: 0 })
        gsap.to(els, {
            yPercent: 0,
            opacity: 1,
            duration: 0.2,
            stagger: 0.1,
            ease: "power2.out",
            clearProps: "transform,opacity"
        })
    }, { scope: smallContainerRef, dependencies: [users] })

    useGSAP(() => {
        if (!containerPermissionRef.current) return
        timelinePermissionRef.current = gsap.timeline({
            paused: true,
            onReverseComplete: () => {
                gsap.set(containerPermissionRef.current, { visibility: "hidden" })
            }
        })
        timelinePermissionRef.current
            .set(permissionRef.current, { yPercent: -500 })
            .to(permissionRef.current, { yPercent: 0, ease: "power2.out" })
    }, { scope: containerPermissionRef })

    useEffect(() => {
        if (!timelinePermissionRef.current) return
        if (askPermission) {
            gsap.set(containerPermissionRef.current, { visibility: "visible" })
            timelinePermissionRef.current.play()
        } else {
            timelinePermissionRef.current.reverse()
        }
    }, [askPermission])

    useEffect(() => {
        if (!pendingHref) return
        setStatusHref(true)
        const els = gsap.utils.toArray(document.querySelectorAll(".users"))
        gsap.to(els, {
            yPercent: 200,
            opacity: 0,
            duration: 0.75,
            ease: "power3.inOut",
            onComplete: () => {
                clearPendingHref()
                router.push(pendingHref)
            }
        })
    }, [pendingHref])

    return (
        <div className="">
            <div ref={containerPermissionRef} className="invisible fixed inset-0 z-[99999] bg-black/40 overflow-hidden">
                <div className="w-full h-full flex justify-center items-center">
                    <div ref={permissionRef} className={`w-2/3 md:w-1/2 p-2 button--glass button rounded-[5px] ${loading ? "animate-pulse" : ""}`}>
                        <div className="w-full bg_login rounded-[5px] p-4">
                            <h1 className="text-red-800 text-center text-xl md:text-2xl font-bold p-5">
                                Delete {eliminationUser?.name}?
                            </h1>
                            <div className="flex justify-center gap-3 p-3">
                                <button onClick={() => fetchDeleteUser(eliminationUser.id)} className="px-5 button--glass button">Yes</button>
                                <button onClick={() => setAskPermission(false)} className="px-5 button--glass button">No</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {loadingUsers ? (
                <div className="flex gap-2 mt-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-4 bg-black/10 animate-pulse rounded-[5px]" style={{ width: `${60 + i * 20}px` }} />
                    ))}
                </div>
            ) : !users || users.length === 0 ? (
                <p className="text-xs tracking-widest text-black/40 mt-2">No users found</p>
            ) : (
                <div ref={smallContainerRef} className="w-full flex flex-col gap-1 overflow-x-hidden">
                    {message.type === "bad" && (
                        <div className="absolute bottom-10 right-10 button--glass button px-3 py-1 rounded-[5px] animate-bounce">
                            <p className="text-red-500 text-xs">{message.message}</p>
                        </div>
                    )}
                    {message.type === "good" && (
                        <div className="absolute bottom-10 right-10 button--glass button px-3 py-1 rounded-[5px] animate-bounce">
                            <p className="text-green-600 text-xs">{message.message}</p>
                        </div>
                    )}

                    <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_100px_80px] gap-2 items-center px-2 py-1">
                        {["Username", "Name", "Surname", "Email", "Role", ""].map((h) => (
                            <p key={h} className="text-[10px] tracking-widest text-white font-bold">{h}</p>
                        ))}
                    </div>

                    {users.map((u) => (
                        <div
                            key={u.user.id}
                            className="users button--glass button p-1.5 rounded-[5px]">
                           <div className="users bg_login grid grid-cols-3 md:grid-cols-[1fr_1fr_1fr_1fr_100px_80px] gap-2 items-center px-2 py-2 rounded-[5px]">
                                <p className="text-xs font-bold truncate">{u.user.username}</p>
                                <p className="text-xs truncate text-black/60">{u.user.name}</p>
                                <p className="text-xs truncate text-black/60">{u.user.surname}</p>
                                <p className="text-xs truncate text-black/40">{u.user.email}</p>
                                <select
                                    className="button--glass button text-xs px-2 py-1 rounded-[5px] w-fit col-start-1 md:col-start-5 focus:outline-none"
                                    defaultValue={u.user.authorities[0]?.authority}
                                    onChange={async (e) => await fetchChangeRole(u.user.id, e.target.value)}
                                >
                                    <option value="user">user</option>
                                    <option value="admin">admin</option>
                                </select>
                                <button
                                    onClick={() => askConfermation(u.user)}
                                    className="button--glass button bg-red-100/60 text-xs px-2 py-1 rounded-[5px] col-span-2 md:col-span-1"
                                >
                                    Delete
                                </button>
                           </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}