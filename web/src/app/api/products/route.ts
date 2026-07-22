import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const featured = request.nextUrl.searchParams.get("featured");
  const data = featured === "1" ? products.slice(0, 4) : products;
  return NextResponse.json({ data });
}