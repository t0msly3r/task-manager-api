import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-100">
        <span className="text-xl font-bold text-cyan-500 tracking-tight">
          TaskFlow
        </span>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg transition shadow-sm"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-2xl mx-auto w-full gap-6 py-24">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 bg-cyan-50 border border-cyan-100 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
          Simple · Fast · Yours
        </span>

        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
          Stay on top of{" "}
          <span className="text-cyan-500 relative">
            everything
            <svg
              className="absolute -bottom-1 left-0 w-full"
              viewBox="0 0 200 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M1 5.5 C 40 1, 80 7, 120 4 S 170 1, 199 5"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </span>
        </h1>

        <p className="text-lg text-gray-500 max-w-md leading-relaxed">
          A clean, distraction-free task manager. Create tasks, mark them done,
          and keep moving.
        </p>

        <div className="flex gap-3 mt-2">
          <Link
            href="/register"
            className="font-semibold text-white bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl transition shadow-md hover:shadow-lg hover:-translate-y-0.5 transform duration-150"
          >
            Start for free →
          </Link>
          <Link
            href="/login"
            className="font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-xl transition"
          >
            Sign in
          </Link>
        </div>
      </main>

      {/* Feature strip */}
      <section className="border-t border-gray-100 px-8 py-10">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            {
              icon: "✓",
              title: "Instant capture",
              desc: "Add tasks in seconds, no friction.",
            },
            {
              icon: "⚡",
              title: "Fast to manage",
              desc: "Inline edit, one-click complete.",
            },
            {
              icon: "🔒",
              title: "Yours alone",
              desc: "JWT-auth keeps your data private.",
            },
          ].map((f) => (
            <div key={f.title} className="flex flex-col items-center gap-2">
              <span className="text-2xl">{f.icon}</span>
              <h3 className="font-semibold text-gray-800 text-sm">{f.title}</h3>
              <p className="text-xs text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-300 py-5 border-t border-gray-50">
        © {new Date().getFullYear()} TaskFlow
      </footer>
    </div>
  );
}
