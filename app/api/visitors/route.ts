import { NextResponse } from "next/server";
import { fetchVisits } from "@/lib/sheets";
import { summarize } from "@/lib/aggregate";

export const revalidate = 60;

export async function GET() {
  try {
    const visits = await fetchVisits();
    return NextResponse.json(summarize(visits));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
