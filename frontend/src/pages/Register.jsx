import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto flex max-w-md flex-col rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Join us</p>
          <h1 className="text-3xl font-semibold">Create your account</h1>
        </div>

        <form className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              type="text"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none ring-0"
              placeholder="Alex Morgan"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none ring-0"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none ring-0"
              placeholder="Create a strong password"
            />
          </div>

          <button
            type="button"
            className="w-full rounded-full bg-white px-4 py-3 font-medium text-black transition hover:bg-slate-200"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-white underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
