import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto flex max-w-md flex-col rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Welcome back</p>
          <h1 className="text-3xl font-semibold">Sign in to your account</h1>
        </div>

        <form className="mt-8 space-y-4">
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
              placeholder="••••••••"
            />
          </div>

          <button
            type="button"
            className="w-full rounded-full bg-white px-4 py-3 font-medium text-black transition hover:bg-slate-200"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don’t have an account?{' '}
          <Link to="/register" className="text-white underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
