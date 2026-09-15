"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { IoPersonOutline } from "react-icons/io5";
import {motion} from "framer-motion"
export default function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(
                "http://localhost:5000/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message);
                return;
            }

            if (data.data.role === "ADMIN") {
                router.push("/dashboard/admin");
            } else if (data.data.role === "EMPLOYEE") {
                router.push("/dashboard/employee");
            } else {
                setMessage("Invalid user role");
            }
        } catch (error) {
            console.log(error);
            setMessage("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-linear-to-br from-indigo-100 via-white to-slate-100 flex items-center justify-center px-4">
           
           <div className="w-full  min-h-screen flex ">
            {/* leftside */}

            <div className="w-1/2 min-h-screen bg-indigo-600 flex flex-col items-center justify-center rounded-l-lg p-10 ">
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, }} transition={{delay:0.3}} className="text-5xl max-w-lg font-bold text-white">Simplify <br/> management with our dashboard</motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, }} transition={{delay:0.5}} className="text-xl text-slate-300 mt-3">Simplify your e-commerece management with our userfriendly admin dashboard.</motion.p>
   

<motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, }} transition={{delay:0.7}} className="mt-4 max-w-2xl mx-auto text-slate-300 text-base leading-7">
  Manage tasks, track your team, and stay organized with a simple,
  fast, and easy-to-use platform built for modern teams.
</motion.p>
             <img
  src="/login.gif"
  alt=""
  className="
     w-70
    
  "
/>
                </div>
                {/* Rightside */}
            <div className="w-1/2 min-h-screen bg-white flex flex-col justify-center p-10">
                {/* Logo / Brand */}
                <div className="text-center mb-8">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1, delay: 0.2 }} duration={0.4} className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-4xl mb-4 shadow-md">
                        <span className="text-white text-2xl">✓</span>
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, delay: 0.4 }} className="text-4xl font-bold text-slate-900">
                        Welcome back
                    </motion.h1>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, }} transition={{delay:0.7}} className="text-slate-500 mt-1 text-lg">
                        Sign in to your account to continue
                    </motion.p>
                </div>

                {/* Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{delay:0.9}} className="bg-white rounded-2xl max-w-2xl ml-28  shadow-sm border border-slate-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xl font-medium text-slate-700 mb-1.5">
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                                className="w-full text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                           
                        </div>

                        <div>
                            <label className="block text-xl font-medium text-slate-700 mb-1.5">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                        </div>

                        {message && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white hover:scale-105 ease-in-out py-4 rounded-xl font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="text-indigo-600 font-medium hover:underline"
                        >
                            Create one
                        </Link>
                    </p>
                </motion.div>
            </div>
            </div>
        </div>
    );
}