import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-slate-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>
          Employee Task Management
        </div>

        <h1 className="text-5xl font-bold text-slate-900 leading-tight">
          Manage your team,<br />
          <span className="text-indigo-600">effortlessly.</span>
        </h1>

        <p className="text-slate-500 mt-5 text-lg leading-relaxed">
          Assign tasks, track progress, and keep your team aligned — all from one simple dashboard.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-white text-slate-700 px-6 py-3 rounded-xl font-semibold border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
          >
            Create Account
          </Link>
        </div>
      </div>

      <div className="mt-20 grid sm:grid-cols-3 gap-6 max-w-3xl w-full">
        {[
          {
            icon: "📋",
            title: "Task Assignment",
            desc: "Create and assign tasks to employees with priority levels.",
          },
          {
            icon: "📊",
            title: "Live Stats",
            desc: "Track pending, in-progress, and completed tasks in real time.",
          },
          {
            icon: "👥",
            title: "Team Management",
            desc: "Add, edit, and manage employee accounts from one place.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-semibold text-slate-800">{f.title}</h3>
            <p className="text-sm text-slate-500 mt-1">{f.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}