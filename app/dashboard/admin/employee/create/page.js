"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {motion} from "framer-motion"
import { FiHome,FiLogOut,FiPlus ,FiPlusCircle} from "react-icons/fi";
import { FaRegClipboard } from "react-icons/fa6";
import { LuNotebookPen } from "react-icons/lu";
import { MdLogout } from "react-icons/md"; 

export default function CreateEmployee() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", type: "" });
        try {
            const response = await fetch(
                "http://localhost:5000/users",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();
            if (!response.ok) { 
              setMessage({ text: data.message, type: "error" }); 
              return; 
            }
            setMessage({ text: "Employee created successfully!", type: "success" });
            setFormData({ 
              name: "", 
              email: "", 
              password: "" 
            });
        } catch { 
          setMessage({ text: "Something went wrong.", type: "error" }); 
        } finally { 
          setLoading(false); 
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed h-full">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-md">TM</span>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 text-lg">TaskManager</p>
                            <p className="text-sm text-slate-400">Admin Panel</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <Link href="/dashboard/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-lg transition-colors">
                        <span><FiHome className="text-xl"/></span> Dashboard
                    </Link>
                    <Link href="/dashboard/admin/tasks" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-lg transition-colors">
                        <span><FaRegClipboard className="text-xl"/></span> Tasks
                    </Link>
                    <Link href="/dashboard/admin/employee/create" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-medium text-sm">
                        <span><FiPlus className="text-xl"/></span> Add Employee
                    </Link>
                    <Link href="/dashboard/admin/tasks/create" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-lg transition-colors">
                        <span><FiPlusCircle className="text-xl"/></span> Create Task
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); router.push("/login"); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-lg font-medium transition-colors"
                    >
                        <span><FiLogOut className="text-xl"/></span> Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 ml-64 p-8">
                <div className="mb-8">
                    <button onClick={() => router.back()} className="text-lg p-3 rounded-xl text-white bg-indigo-700 hover:bg-indigo-700 hover:scale-105 ease-in-out duration-200  flex items-center gap-1 mb-4">
                        ← Back
                    </button>
                    <div className="flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-bold text-slate-900">Add Employee</h1>
                    <p className="text-slate-500 mt-1">Create a new employee account</p>
                    </div> 
                </div>

                <div className="w-full flex items-center justify-center"><div className=" w-full max-w-xl bg-white rounded-2xl border border-slate-100 shadow-md p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-md font-medium text-slate-700 mb-1.5">Full Name</label>
                            <input
                                type="text" name="name" value={formData.name} onChange={handleChange}
                                placeholder="Enter employee name" required
                                className="w-full text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-md font-medium text-slate-700 mb-1.5">Email Address</label>
                            <input
                                type="email" name="email" value={formData.email} onChange={handleChange}
                                placeholder="employee@example.com" required
                                className="w-full text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-md font-medium text-slate-700 mb-1.5">Temporary Password</label>
                            <input
                                type="password" name="password" value={formData.password} onChange={handleChange}
                                placeholder="••••••••" required
                                className="w-full text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                        </div>

                        {message.text && (
                            <div className={`text-md rounded-xl px-4 py-3 border ${message.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit" disabled={loading}
                                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium  hover:scale-105 ease-in-out duration-200 hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Creating..." : "Create Employee"}
                            </button>
                            <button
                                type="button" onClick={() => router.push("/dashboard/admin")}
                                className="bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-medium  hover:scale-105 ease-in-out duration-200 hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
                </div>
            </main>
        </div>
    );
}
