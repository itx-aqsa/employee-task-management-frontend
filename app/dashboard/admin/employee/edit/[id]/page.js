"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditEmployee() {
    
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    
    const params = useParams();
    const router = useRouter();

    useEffect(() => {
        const getEmployee = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/users/${params.id}`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                const data = await response.json();
                if (!response.ok) {
                    setMessage(data.message);
                    setLoading(false);
                    return;
                }

                setFormData({
                    name: data.data.name,
                    email: data.data.email,
                    password: ""
                });
                setLoading(false);

            } catch (error) {
                console.log(error);
                setMessage("Something went wrong");
                setLoading(false);
            }
        };
        getEmployee();

    }, [params.id, router]);

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
                `http://localhost:5000/users/${params.id}`,
                {
                    method: "PUT",
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
            setMessage("Employee updated successfully");

        } catch (error) {
            console.log(error);
            setMessage("Something went wrong");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-gray-600">
                    Loading...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-xl mx-auto">
                <div className="bg-white rounded-xl shadow p-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Edit Employee
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Update employee information
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                            </label>
                            <input type="text" name="name"
                                value={formData.name} onChange={handleChange}
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
                                className="w-full text-black border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <input
                                type="password" name="password"
                                value={formData.password} onChange={handleChange}
                                placeholder="Leave empty to keep current password"
                                className="w-full text-black border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>


                        <div className="flex gap-3">
                            <button type="submit" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700">
                                Update Employee
                            </button>

                            <button type="button" onClick={() => router.push("/dashboard/admin")}
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