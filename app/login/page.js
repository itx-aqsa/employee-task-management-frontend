"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { apiFetch, ROLE_DASHBOARD } from "../lib/api";

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { response, data } = await apiFetch(
                "/users/login",
                "POST",
                formData
            );

            if (!response.ok) {
                setError(data.detail || data.message || "Invalid email or password.");
                return;
            }

            const role = data.data?.role;
            const destination = ROLE_DASHBOARD[role];

            if (destination) {
                router.push(destination);
            } else {
                setError("Invalid user role. Please contact support.");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-xl shadow-slate-900/5 md:grid md:grid-cols-[0.9fr_1.1fr] login-enter">
                <aside className="relative hidden overflow-hidden bg-teal-600 p-10 text-white md:flex md:flex-col md:justify-between lg:p-12">
                    <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
                    <div aria-hidden="true" className="absolute -right-10 -top-10 h-56 w-56 rounded-full border border-white/10" />
                    <div aria-hidden="true" className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-teal-500/60" />

                    <div className="relative">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg shadow-teal-950/10 backdrop-blur-sm">
                            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                                <path d="m5 12.5 4.2 4.2L19.5 6.8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    <div className="relative my-16 lg:my-20">
                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-teal-100">Good to have you back</p>
                        <h2 className="max-w-sm text-3xl font-semibold leading-tight tracking-tight lg:text-4xl">
                            Pick up right where your team left off.
                        </h2>
                        <p className="mt-5 max-w-sm text-sm leading-6 text-teal-100">
                            Sign in to see what needs your attention and keep work moving.
                        </p>
                    </div>

                    <p className="relative text-xs text-teal-100/80">Your team workspace, ready when you are.</p>
                </aside>

                <section className="px-6 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
                    <div className="mx-auto w-full max-w-md">
                        <div className="mb-8 md:mb-9">
                            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-600/20 md:hidden">
                                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                                    <path d="m5 12.5 4.2 4.2L19.5 6.8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p className="mb-2 text-sm font-semibold text-teal-600">Welcome back</p>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-[2rem]">Sign in to your account</h1>
                            <p className="mt-2 text-sm leading-6 text-slate-500">Enter your details to continue to your workspace.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
                                <input
                                    id="login-email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm shadow-slate-900/[0.02] outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                                />
                            </div>

                            <div>
                                <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                                <input
                                    id="login-password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm shadow-slate-900/[0.02] outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                                />
                            </div>

                            {error && (
                                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="group mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-600/25 active:translate-y-0 active:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                            >
                                {loading ? "Signing in..." : "Sign in"}
                                {!loading && <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>}
                            </button>
                        </form>

                        <p className="mt-7 text-center text-sm text-slate-500">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="font-semibold text-teal-600 transition-colors hover:text-teal-700 hover:underline">
                                Create one
                            </Link>
                        </p>
                    </div>
                </section>
            </div>
            <style jsx>{`
                @keyframes login-enter {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .login-enter { animation: login-enter 500ms ease-out both; }
                @media (prefers-reduced-motion: reduce) {
                    .login-enter { animation: none; }
                }
            `}</style>
        </main>
    );
}
