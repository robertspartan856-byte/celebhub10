import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 lg:px-8">
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-300">
            Coming soon • Premium fan experience
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Your celebrity community is almost here.
            </h1>
            <p className="max-w-2xl text-lg text-slate-300 sm:text-xl">
              Join the next wave of fan engagement with exclusive drops, creator connections, and a seamless membership experience.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/register"
              className="rounded-full bg-white px-6 py-3 font-medium text-black transition hover:bg-slate-200"
            >
              Create account
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-white/20 px-6 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Sign in
            </Link>
          </div>

          <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:grid-cols-3">
            <div>
              <p className="text-2xl font-semibold">01</p>
              <p className="mt-2 text-sm text-slate-300">Early access to drops</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">02</p>
              <p className="mt-2 text-sm text-slate-300">VIP fan card experiences</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">03</p>
              <p className="mt-2 text-sm text-slate-300">Real community engagement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
