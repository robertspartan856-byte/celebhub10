"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AuthSession = {
  user?: {
    email?: string;
    role?: string;
  };
};

export default function AccountPage() {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("celebhub-auth");
    if (!raw) {
      return;
    }

    try {
      setSession(JSON.parse(raw));
    } catch {
      setSession(null);
    }
  }, []);

  return (
    <main className="section-shell py-10">
      <div className="rounded-2xl border border-white/10 bg-[#0f1420]/80 p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">Member dashboard</p>
        <h1 className="mt-2 text-3xl font-black">My account</h1>
        <p className="visually-muted mt-3 text-sm">Track your bookings, fan-card applications, and loyalty access from one lounge.</p>
        {session?.user ? (
          <div className="mt-6 space-y-3 rounded-xl border border-white/10 p-4 text-sm">
            <p><span className="font-semibold">Signed in as:</span> {session.user.email}</p>
            <p><span className="font-semibold">Role:</span> {session.user.role || "member"}</p>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-white/20 p-4 text-sm text-[var(--muted)]">
            Sign in to unlock your member dashboard and application history.
            <div className="mt-3 flex flex-wrap gap-3">
              <Link className="focus-ring rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black" href="/login">Login</Link>
              <Link className="focus-ring rounded-full border border-white/20 px-4 py-2 text-sm" href="/signup">Create account</Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
