import { NextRequest, NextResponse } from "next/server";
import { signJwt } from "@/lib/auth";
import { inMemoryUsers } from "@/lib/app-store";
import { getDatabase } from "@/lib/mongodb";
import { comparePassword } from "@/lib/password";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  try {
    if (process.env.MONGODB_URI) {
      try {
        const db = await getDatabase();
        const user = await db.collection("users").findOne({ email });
        if (!user) {
          return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
        }

        const isValid = await comparePassword(password, user.passwordHash);
        if (!isValid) {
          return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
        }

        const token = signJwt({ sub: user.id, email: user.email, role: user.role });
        return NextResponse.json({ token, user: { id: user.id, email: user.email, role: user.role } });
      } catch {
        // fall back to memory store
      }
    }

    const user = inMemoryUsers.find((entry) => entry.email === email);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = signJwt({ sub: user.id, email: user.email, role: user.role });
    return NextResponse.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch {
    return NextResponse.json({ error: "Unable to sign in right now." }, { status: 500 });
  }
}
