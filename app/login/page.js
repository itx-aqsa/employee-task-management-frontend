"use client";

import { useState } from "react";

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");

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
                "http://localhost:5000/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            )
            const data = await response.json();
            setMessage(data.message);
            console.log("Login response", data);
            
        } catch (error) {
            console.log(error);
            setMessage("Something went wrong");          
            
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">

                <h1 className="text-2xl font-bold text-gray-800 text-center">
                    Welcome Back
                </h1>

                <p className="text-gray-500 text-center mt-2">
                    Login to your account
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email" name="email" value={formData.email}
                            onChange={handleChange} placeholder="Enter your email"
                            className="w-full text-black placeholder:text-gray-300 border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password" name="password" value={formData.password}
                            onChange={handleChange} placeholder="Enter your password"
                            className="w-full text-black placeholder:text-gray-300 border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition">
                        Login
                    </button>
                </form>
                {message && (
                    <p className="text-center mt-4 text-sm text-gray-600">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}