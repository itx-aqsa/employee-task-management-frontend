import Link from "next/link";
import { FiArrowRight, FiCheck, FiCheckCircle, FiClipboard, FiLayers, FiUsers } from "react-icons/fi";

const features = [
  {
    icon: FiClipboard,
    title: "Clear task ownership",
    description: "Create tasks with priorities and assign them to the right people.",
  },
  {
    icon: FiLayers,
    title: "Progress at a glance",
    description: "Follow pending, in progress, and completed work in one place.",
  },
  {
    icon: FiUsers,
    title: "A connected team",
    description: "Admins can manage employee accounts and see team workloads.",
  },
];

function TaskPreview() {
  return (
    <div aria-label="Illustration of a task dashboard" className="relative mx-auto w-full max-w-[570px]">
      <div aria-hidden="true" className="absolute -inset-5 rounded-[2.5rem] bg-teal-100/70 blur-2xl" />
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-teal-950/10">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white"><FiCheck aria-hidden="true" /></span>
            <div><p className="text-sm font-bold text-slate-900">My workspace</p><p className="text-xs text-slate-500">Task overview</p></div>
          </div>
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">This week</span>
        </div>
        <div className="grid grid-cols-3 gap-3 p-5 sm:gap-4 sm:p-7">
          {[["12", "Total"], ["4", "In progress"], ["8", "Completed"]].map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 sm:p-4">
              <p className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{value}</p>
              <p className="mt-1 text-[11px] font-medium text-slate-500 sm:text-xs">{label}</p>
            </div>
          ))}
        </div>
        <div className="px-5 pb-2 sm:px-7"><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Recent tasks</p></div>
        <div className="space-y-3 px-5 pb-5 sm:px-7 sm:pb-7">
          {[
            ["Prepare weekly project update", "In progress", "bg-blue-50 text-blue-700", "72%"],
            ["Review new team requests", "Completed", "bg-green-50 text-green-700", "100%"],
            ["Organize sprint priorities", "Pending", "bg-slate-100 text-slate-600", "0%"],
          ].map(([title, status, tone, progress]) => (
            <div key={title} className="flex items-center gap-3 rounded-2xl border border-slate-100 px-3 py-3 sm:gap-4 sm:px-4">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${status === "Completed" ? "bg-green-50 text-green-600" : "bg-teal-50 text-teal-700"}`}><FiCheckCircle aria-hidden="true" className="h-4 w-4" /></span>
              <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-slate-800 sm:text-sm">{title}</p><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${progress === "100%" ? "bg-green-500" : "bg-teal-500"}`} style={{ width: progress }} /></div></div>
              <span className={`hidden rounded-full px-2.5 py-1 text-[10px] font-semibold sm:inline-flex ${tone}`}>{status}</span>
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="absolute -right-4 top-24 hidden rounded-2xl border border-teal-100 bg-white p-3 shadow-lg shadow-slate-900/10 sm:flex sm:items-center sm:gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><FiCheckCircle /></span><span className="text-xs font-semibold text-slate-700">Progress updated</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="overflow-hidden bg-white text-slate-900">
      <header className="relative z-10 border-b border-slate-100 bg-white/90">
        <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-3" aria-label="TaskManager home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold text-white shadow-sm shadow-teal-600/20">TM</span>
            <span className="text-base font-bold tracking-tight text-slate-900">TaskManager</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-teal-700 sm:px-4">Sign in</Link>
            <Link href="/register" className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-200">Create account</Link>
          </div>
        </nav>
      </header>

      <section className="relative isolate">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-50 via-white to-white" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:px-12 lg:py-28">
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white px-3.5 py-2 text-xs font-semibold text-teal-800 shadow-sm shadow-teal-900/[0.03]"><span className="h-2 w-2 rounded-full bg-teal-500" /> A clearer way to move work forward</div>
            <h1 className="text-4xl font-bold leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-[3.75rem]">Bring your team&apos;s work <span className="text-teal-700">into focus.</span></h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">Assign tasks, keep priorities visible, and follow progress from one calm, simple workspace.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-teal-800/15 transition hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-200">Get started <FiArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-1" /></Link>
              <Link href="/login" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50/50 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-100">Sign in to your workspace</Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500"><span className="inline-flex items-center gap-2"><FiCheckCircle className="text-teal-600" /> Team task tracking</span><span className="inline-flex items-center gap-2"><FiCheckCircle className="text-teal-600" /> Clear progress views</span></div>
          </div>
          <TaskPreview />
        </div>
      </section>

      <section className="border-y border-slate-100 bg-slate-50/70 py-20 sm:py-24" aria-labelledby="features-heading">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-14"><p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Everything in its place</p><h2 id="features-heading" className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">A smoother way to stay on top of work</h2><p className="mt-4 text-base leading-7 text-slate-600">Keep everyday tasks moving with a shared view of ownership and progress.</p></div>
          <div className="grid gap-4 md:grid-cols-3 md:gap-5">
            {features.map(({ icon: Icon, title, description }, index) => (
              <article key={title} className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-900/[0.02] transition duration-200 hover:-translate-y-1 hover:border-teal-100 hover:shadow-lg hover:shadow-slate-900/[0.05] sm:p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-100 transition group-hover:bg-teal-600 group-hover:text-white"><Icon aria-hidden="true" className="h-5 w-5" /></span>
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">0{index + 1}</p><h3 className="mt-2 text-lg font-bold tracking-tight text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <Link href="/" className="font-bold tracking-tight text-slate-700">TaskManager</Link><p>Make room for focused, well-organized work.</p><div className="flex items-center gap-4"><Link href="/login" className="transition hover:text-teal-700">Sign in</Link><Link href="/register" className="transition hover:text-teal-700">Create account</Link></div>
      </footer>
    </main>
  );
}
