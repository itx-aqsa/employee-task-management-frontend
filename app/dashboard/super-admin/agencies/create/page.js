"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../../components/Sidebar";
import { apiFetch, ROLES } from "../../../../lib/api";
import { requireRole } from "../../../../lib/auth";

export default function CreateAgencyPage() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        domain: "",
    });
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const profile = await requireRole(router, [ROLES.SUPER_ADMIN]);
            if (!profile) return;
            setUser(profile);
            setIsAuthChecked(true);
        };
        init();
    }, [router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const body = {
                name: formData.name.trim(),
                ...(formData.description.trim() && { description: formData.description.trim() }),
                ...(formData.domain.trim() && { domain: formData.domain.trim() }),
            };

            const { response, data } = await apiFetch("/agencies", "POST", body);

            if (!response.ok) {
                setMessage({
                    text: data.message || "Failed to create agency.",
                    type: "error",
                });
                return;
            }

            setMessage({ text: "Agency created successfully!", type: "success" });
            setFormData({ name: "", description: "", domain: "" });

            // Navigate back after a short delay so the user can see the success message.
            setTimeout(() => router.push("/dashboard/super-admin/agencies"), 1200);
        } catch {
            setMessage({ text: "Something went wrong. Please try again.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthChecked) return null;

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar role={ROLES.SUPER_ADMIN} user={user} />

            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push("/dashboard/super-admin/agencies")}
                        className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-4 transition-colors"
                    >
                        ← Back to Agencies
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900">Create Agency</h1>
                    <p className="text-slate-500 mt-1">
                        Register a new agency on the platform
                    </p>
                </div>

                {/* Form card */}
                <div className="max-w-xl bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Agency Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Agency Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Acme Corporation"
                                required
                                className="w-full text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Description{" "}
                                <span className="text-slate-400 font-normal">(optional)</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Brief description of the agency…"
                                rows={3}
                                className="w-full text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition resize-none"
                            />
                        </div>

                        {/* Domain */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Domain{" "}
                                <span className="text-slate-400 font-normal">(optional)</span>
                            </label>
                            <input
                                type="text"
                                name="domain"
                                value={formData.domain}
                                onChange={handleChange}
                                placeholder="acme.com"
                                className="w-full text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                            />
                        </div>

                        {/* Feedback banner */}
                        {message.text && (
                            <div
                                className={`text-sm rounded-xl px-4 py-3 border ${
                                    message.type === "success"
                                        ? "bg-green-50 border-green-200 text-green-700"
                                        : "bg-red-50 border-red-200 text-red-700"
                                }`}
                            >
                                {message.text}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Creating…" : "Create Agency"}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push("/dashboard/super-admin/agencies")}
                                className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
