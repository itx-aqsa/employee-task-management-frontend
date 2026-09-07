"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateEmployee() {

    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState("");
    
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                setMessage(data.message);
                return;
            }
            setMessage("Employee created successfully");
            setFormData({ name: "", email: "", password: "" });

        } catch (error) {
            console.log(error);
            setMessage("Something went wrong");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-xl mx-auto">
                <div className="bg-white rounded-xl shadow p-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Add Employee
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Create a new employee account
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                            </label>
                            <input type="text" name="name"
                                value={formData.name} onChange={handleChange}
                                placeholder="Enter employee name"
                                className="w-full text-black border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email" name="email"
                                value={formData.email} onChange={handleChange}
                                placeholder="Enter employee email"
                                className="w-full text-black border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password" name="password"
                                value={formData.password} onChange={handleChange}
                                placeholder="Enter temporary password"
                                className="w-full text-black border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button type="submit" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700">
                                Create Employee
                            </button>

                            <button type="button"
                                onClick={() => router.push("/dashboard/admin")}
                                className="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>

                    {message && (
                        <p className="mt-5 text-sm text-gray-600">
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}