
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
        <div>
            <div ref={containerPermissionRef} className="invisible fixed h-full inset-0 z-50 bg-black/40 overflow-hidden">
                <div className="w-full h-full flex justify-center items-center">
                    <div ref={permissionRef} className={` w-2/3 md:full bg-amber-50 border-primary-500 border-dotted border-3 ${loading ? "animate-pulse" : ""}`}>
                        <h1 className="text-red-800  text-center text-xl md:text-4xl p-5">do you really want to delete {eliminationUser?.name}?</h1>
                        <div className="flex justify-center gap-3 p-3">
                            <button onClick={() => fetchDeleteUser(eliminationUser.id)} className="px-5 text-sm md:text-xl">Yes</button>
                            <button onClick={() => setAskPermission(false)} className="px-5 text-sm md:text-xl">No</button>
                        </div>
                    </div>
                </div>
            </div>

            {loadingUsers ? (
                <h1 className="text-2xl animate-pulse mt-2">Loading users...</h1>
            ) : !users || users.length === 0 ? (
                <h1 className="text-2xl mt-2">No users found</h1>
            ) : (
                <div ref={smallContainerRef} className="w-full flex flex-col overflow-x-hidden">
                    {message.type === "bad" && (
                        <div className="absolute bottom-10 right-10 bg-black/20 animate-bounce">
                            <h1 className="text-red-500 text-2xl px-3 py-1">{message.message}</h1>
                        </div>
                    )}
                    {message.type === "good" && (
                        <div className="absolute bottom-10 right-10 bg-black/20 animate-bounce">
                            <h1 className="bg-green-600 text-2xl px-3 py-1 text-white">{message.message}</h1>
                        </div>
                    )}
                    <div className="grid-cols-[1fr_1fr_1fr_1fr_100px_100px] gap-2 items-center py-2 hidden md:grid border-b border-dashed border-primary-500">
                        <p className="px-3 w-fit text-primary-500 bg-transparent text-sm lg:text-lg">Username</p>
                        <p className="px-3 w-fit text-primary-500 bg-transparent text-sm lg:text-lg">Name</p>
                        <p className="px-3 w-fit text-primary-500 bg-transparent text-sm lg:text-lg">Surname</p>
                        <p className="px-3 w-fit text-primary-500 bg-transparent text-sm lg:text-lg">Email</p>
                        <p className="px-3 w-fit text-primary-500 bg-transparent text-sm lg:text-lg">Role</p>
                    </div>
                    {users.map((u) => (
                        <div key={u.user.id} className="grid grid-cols-3 md:grid-cols-[1fr_1fr_1fr_1fr_100px_100px] gap-2 items-center py-2 users">
                            <p className="px-3 w-fit text-primary-500 bg-transparent text-sm lg:text-lg">{u.user.username}</p>
                            <p className="px-3 w-fit text-primary-500 bg-transparent text-sm lg:text-lg">{u.user.name}</p>
                            <p className="px-3 w-fit text-primary-500 bg-transparent text-sm lg:text-lg">{u.user.surname}</p>
                            <p className="px-3 w-fit text-primary-500 bg-transparent text-sm lg:text-lg">{u.user.email}</p>
                            <select
                                className="text-primary-500 text-sm! lg:text-lg! px-2 w-fit col-start-1 md:col-start-5"
                                defaultValue={u.user.authorities[0]?.authority}
                                onChange={async (e) => await fetchChangeRole(u.user.id, e.target.value)}
                            >
                                <option value="user">user</option>
                                <option value="admin">admin</option>
                            </select>
                            <button
                                onClick={() => askConfermation(u.user)}
                                className="flex items-center justify-center md:ms-auto w-full md:w-fit bg-primary-500 cursor-pointer col-span-2 md:col-span-1"
                            >
                                DELETE
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
