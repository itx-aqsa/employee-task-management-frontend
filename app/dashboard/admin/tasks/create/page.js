"use client"

import { useEffect, useState } from "react"

export default function CreateTaskPage(){

    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({ title: "", description: "", priority: "", userId: ""});
    const [message, setMessage] = useState("")

    useEffect(() => {
      getEmployees();
    }, []);

    const getEmployees = async () => {
        try {
            const response = await fetch("http://localhost:5000/users");
            const data = await response.json();

            setEmployees(data);
        } catch (error) {
            console.log(error);
            setMessage("Unable to load employees");
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        })
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                "http://localhost:5000/tasks",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...formData, 
                        userId: Number(formData.userId)
                    })
                }

            )
            const data = await response.json();
            setMessage(data.message);

            if(response.ok){
                setFormData({ title: "", description: "", priority: "", userId: "" });
            }
        } catch (error) {
            console.log(error);
            setMessage("Something went wrong");
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-xl mx-auto">
                <div className="bg-white rounded-xl shadow-md p-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Create Task
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Assign a task to an employee
                    </p>
                    <form onSubmit={handleSubmit}  className="mt-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input type="text" name="title" value={formData.title}
                                onChange={handleChange} placeholder="Enter task title"
                                className="w-full text-black border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea name="description" value={formData.description}
                                onChange={handleChange} placeholder="Enter task description"
                                rows="4"
                                className="w-full text-black border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Priority
                            </label>
                            <select name="priority" value={formData.priority}
                                onChange={handleChange}
                                className="w-full text-black border border-gray-300 rounded-lg px-4 py-2.5"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Assign To
                            </label>
                            <select name="userId" value={formData.userId}
                                onChange={handleChange}
                                className="w-full text-black border border-gray-300 rounded-lg px-4 py-2.5"
                            >
                                <option value="">
                                    Select Employee
                                </option>
                                {employees.map((employee) => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700">
                            Create Task
                        </button>
                    </form>
                    {message && (
                        <p className="text-center mt-4 text-sm text-gray-600">
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}