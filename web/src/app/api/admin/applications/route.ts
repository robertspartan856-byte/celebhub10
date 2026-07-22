import { NextRequest, NextResponse } from "next/server";
import { inMemoryApplications } from "@/lib/app-store";
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
  const id = typeof body?.id === "string" ? body.id : "";
  const status = body?.status === "approved" || body?.status === "rejected" ? body.status : "submitted";
  const adminNotes = typeof body?.adminNotes === "string" ? body.adminNotes : "";

  if (!id) {
    return NextResponse.json({ error: "Application id is required." }, { status: 400 });
  }

  try {
    if (process.env.MONGODB_URI) {
      try {
        const db = await getDatabase();
        const updated = await db.collection("fan_applications").findOneAndUpdate(
          { id },
          {
            $set: {
              status,
              reviewedAt: new Date().toISOString(),
              adminNotes,
            },
          },
          { returnDocument: "after" },
        );

        return NextResponse.json({ data: updated?.value ?? null });
      } catch {
        // fall back to memory store
      }
    }

    const application = inMemoryApplications.find((entry) => entry.id === id);
    if (!application) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }

    application.status = status;
    application.reviewedAt = new Date().toISOString();
    application.adminNotes = adminNotes;
    return NextResponse.json({ data: application });
  } catch {
    return NextResponse.json({ error: "Unable to update application." }, { status: 500 });
  }
}
