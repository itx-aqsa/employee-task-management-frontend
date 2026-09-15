
"use client";
import Link from "next/link";
import {motion} from "framer-motion";
import { FaArrowRightLong } from "react-icons/fa6";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { IoStatsChartSharp } from "react-icons/io5";
import { RiTaskLine } from "react-icons/ri";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-indigo-100 via-white to-slate-100 flex flex-col items-center">
     
     {/* Heading */}
     <div className="w-full flex justify-between max-w-7xl mx-auto py-16">
      <div className=" font-medium  py-1.5 rounded-full border border-white/20">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1, delay: 0.2 }} duration={0.9} className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span  className="w-2 h-2 rounded-full bg-indigo-500  inline-block"></span>
          Employee Task Management
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, delay: 0.4 }} className="text-6xl font-bold leading-tight">
          Manage your team,<br />
          <span className="text-indigo-600">effortlessly.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, }} transition={{delay:0.6}} className=" mt-5 text-lg leading-relaxed">
          Assign tasks, track progress, and keep your team aligned — all from one simple dashboard.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0}} transition={{delay:0.8}} className="mt-8 flex gap-4">
          <Link
            href="/login"
            className="bg-indigo-600 text-white px-10 py-3 rounded-xl font-semibold hover:bg-indigo-700 hover:scale-105 ease-in-out transition-colors shadow-sm"
          >
            Sign In 
            <FaArrowRightLong className="inline-block ml-3" />
          </Link>
          <Link
            href="/register"
            className="bg-white text-slate-700 px-10 py-3 rounded-xl font-semibold border border-slate-200 hover:bg-slate-50 hover:scale-105 ease-in-out transition-colors shadow-sm"
          >
            Create Account
          </Link>
        </motion.div>
      </div>
      <div>
        <img src="image1.jpg" alt="man" className="w-120 max-w-xl rounded-2xl " />
      </div>
      
      </div>

  

     
     
     <div className=" w-full max-w-4xl mx-auto px-6 pb-16">
      <div className="mt-10 grid sm:grid-cols-3 gap-6  w-full">
        {[
          {
            icon: RiTaskLine,
            title: "Task Assignment",
            desc: "Create and assign tasks to employees with priority levels.",
          },
          {
            icon: IoStatsChartSharp,
            title: "Live Status",
            desc: "Track pending, in-progress, and completed tasks in real time.",
          },
          {
            icon: BsFillPersonLinesFill,
            title: "Team Management",
            desc: "Add, edit, and manage employee accounts from one place.",
          },
        
        ].map((f) => {
           const Icon = f.icon;
          return(
         
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + 0.1 * f.title.length}}
            key={f.title}
            className="bg-white rounded-2xl border border-slate-100  p-6 px-8 text-center shadow-2xl shadow-indigo-700 hover:shadow-xl transition-shadow"
          >
            <div className="text-3xl mb-3"><Icon className="text-indigo-600 text-3xl" /></div>
            <h3 className="font-bold text-xl text-slate-800">{f.title}</h3>
            <p className="text-sm text-slate-500 mt-1">{f.desc}</p>
          </motion.div>
          );
})}
      </div></div>
    </main>
  );
}