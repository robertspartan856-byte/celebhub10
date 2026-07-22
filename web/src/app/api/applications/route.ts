import { NextRequest, NextResponse } from "next/server";
import { createApplicationRecord, inMemoryApplications } from "@/lib/app-store";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    if (process.env.MONGODB_URI) {
      try {
        const db = await getDatabase();
        const applications = await db.collection("fan_applications").find({}).sort({ submittedAt: -1 }).toArray();
        return NextResponse.json({ data: applications });
      } catch {
        // fall back to memory store
      }
    }

    return NextResponse.json({ data: inMemoryApplications.slice().reverse() });
  } catch {
    return NextResponse.json({ error: "Unable to load applications." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const celebrity = typeof body?.celebrity === "string" ? body.celebrity.trim() : "";
  const tier = typeof body?.tier === "string" ? body.tier.trim() : "";
  const notes = typeof body?.notes === "string" ? body.notes.trim() : "";

  if (!name || !email || !celebrity || !tier) {
    return NextResponse.json({ error: "Please complete the required fields." }, { status: 400 });
  }

  try {
    const application = createApplicationRecord({ name, email, celebrity, tier, notes, status: "submitted" });

    if (process.env.MONGODB_URI) {
      try {
        const db = await getDatabase();
        await db.collection("fan_applications").insertOne(application);
        return NextResponse.json({ data: application });
      } catch {
        // fall back to memory store
      }
    }

    inMemoryApplications.push(application);
    return NextResponse.json({ data: application });
  } catch {
    return NextResponse.json({ error: "Unable to submit application." }, { status: 500 });
  }
}
