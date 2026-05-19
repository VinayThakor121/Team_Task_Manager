import Link from "next/link";

const features = [
  "JWT auth with role-based access for admins and members",
  "Project and task workflows with overdue visibility and analytics",
  "AI-powered subtask generation for complex deliverables",
  "Personal and group chat with Socket.IO presence updates",
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center gap-12 px-4 py-16">
      <section className="grid gap-10 rounded-[2rem] border border-white/10 bg-slate-950/60 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-violet-300">Team collaboration OS</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            Manage projects, unblock teams, and break work down with AI.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Team Task Manager combines modern task operations, real-time chat, role-based access control, and AI-assisted planning in a polished full-stack workspace.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/register" className="rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 hover:bg-violet-400">
              Launch workspace
            </Link>
            <Link href="/login" className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-slate-100 hover:bg-white/10">
              Sign in
            </Link>
          </div>
          <dl className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["2", "user roles"],
              ["7+", "core APIs"],
              ["Live", "Socket.IO chat"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <dt className="text-2xl font-semibold text-white">{value}</dt>
                <dd className="mt-1 text-sm text-slate-400">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm font-semibold text-emerald-300">Included out of the box</p>
          <div className="mt-6 space-y-4">
            {features.map((feature, index) => (
              <div key={feature} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-300">0{index + 1}</p>
                <p className="mt-2 text-sm text-slate-200">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
