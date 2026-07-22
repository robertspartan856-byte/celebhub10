"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("Signing you in...");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus(payload.error || "Unable to sign in.");
      return;
    }

    localStorage.setItem("celebhub-auth", JSON.stringify(payload));
    setStatus("Signed in successfully.");
    router.push("/account");
  };

  return (
    <main className="section-shell py-10">
      <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-[#0f1420]/80 p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">Member access</p>
        <h1 className="mt-2 text-3xl font-black">Log in to your account</h1>
        <p className="visually-muted mt-3 text-sm">Use your VIP credentials to manage bookings, fan-card applications, and perks.</p>
        <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
          <label className="block text-sm">
            Email
            <input className="focus-ring mt-1 w-full rounded-lg border border-white/20 bg-[var(--surface)] px-3 py-2" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="block text-sm">
            Password
            <input className="focus-ring mt-1 w-full rounded-lg border border-white/20 bg-[var(--surface)] px-3 py-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          <button type="submit" className="focus-ring rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-black">Sign in</button>
        </form>
        {status ? <p className="mt-3 text-sm text-[var(--accent-2)]">{status}</p> : null}
        <p className="mt-4 text-sm">
          New here? <Link className="text-[var(--accent)] underline" href="/signup">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
