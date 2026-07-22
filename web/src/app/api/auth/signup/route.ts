import { NextRequest, NextResponse } from "next/server";
import { signJwt } from "@/lib/auth";
import { createStoredUser, inMemoryUsers } from "@/lib/app-store";
import { getDatabase } from "@/lib/mongodb";
import { hashPassword } from "@/lib/password";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const role = body?.role === "admin" ? "admin" : "user";

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  try {
    if (process.env.MONGODB_URI) {
      try {
        const db = await getDatabase();
        const existing = await db.collection("users").findOne({ email });
        if (existing) {
          return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
        }

        const passwordHash = await hashPassword(password);
        const user = createStoredUser({ email, passwordHash, role });
        await db.collection("users").insertOne(user);

        const token = signJwt({ sub: user.id, email: user.email, role: user.role });
        return NextResponse.json({ token, user: { id: user.id, email: user.email, role: user.role } });
      } catch {
        // fall back to in-memory storage when Mongo is unavailable
      }
    }

    const existing = inMemoryUsers.find((entry) => entry.email === email);
    if (existing) {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = createStoredUser({ email, passwordHash, role });
    inMemoryUsers.push(user);

    const token = signJwt({ sub: user.id, email: user.email, role: user.role });
    return NextResponse.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch {
    return NextResponse.json({ error: "Unable to create account right now." }, { status: 500 });
  }
}
