"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setStatus("Passwords do not match.");
      return;
    }

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus(payload.error || "Unable to create account.");
      return;
    }

    localStorage.setItem("celebhub-auth", JSON.stringify(payload));
    setStatus("Account created. Welcome to the VIP lounge.");
    router.push("/account");
  };

  return (
    <main className="section-shell py-10">
      <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-[#0f1420]/80 p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">Create account</p>
        <h1 className="mt-2 text-3xl font-black">Join the premium fan network</h1>
        <p className="visually-muted mt-3 text-sm">Create a VIP account to buy tickets, save your cart, and apply for collectible programs.</p>
        <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
          <label className="block text-sm">
            Email
            <input className="focus-ring mt-1 w-full rounded-lg border border-white/20 bg-[var(--surface)] px-3 py-2" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="block text-sm">
            Password
            <input className="focus-ring mt-1 w-full rounded-lg border border-white/20 bg-[var(--surface)] px-3 py-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          <label className="block text-sm">
            Confirm password
            <input className="focus-ring mt-1 w-full rounded-lg border border-white/20 bg-[var(--surface)] px-3 py-2" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
          </label>
          <button type="submit" className="focus-ring rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-black">Create account</button>
        </form>
        {status ? <p className="mt-3 text-sm text-[var(--accent-2)]">{status}</p> : null}
        <p className="mt-4 text-sm">
          Already a member? <Link className="text-[var(--accent)] underline" href="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
