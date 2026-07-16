import { NextResponse } from "next/server";
import { saveCompetitor } from "@/lib/ads";

type SaveCompetitorPayload = {
  userId?: string;
  name?: string;
  libraryUrl?: string;
  niche?: string;
  notes?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as SaveCompetitorPayload;
  const userId = payload.userId?.trim() || "";
  const name = payload.name?.trim() || "";

  if (!userId) {
    return NextResponse.json(
      { error: "Connect your User ID before saving competitors." },
      { status: 400 },
    );
  }

  if (!name) {
    return NextResponse.json(
      { error: "Add competitor name before saving." },
      { status: 400 },
    );
  }

  try {
    const saved = await saveCompetitor({
      userId,
      name,
      libraryUrl: payload.libraryUrl?.trim() || "",
      niche: payload.niche?.trim() || "",
      notes: payload.notes?.trim() || "",
    });

    return NextResponse.json({
      id: saved.id,
      userId,
      competitor: {
        name,
        libraryUrl: payload.libraryUrl?.trim() || "",
        niche: payload.niche?.trim() || "",
        notes: payload.notes?.trim() || "",
      },
    });
  } catch (error) {
    console.error("SpySave competitor save failed", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Competitor save failed. Check Firestore rules and try again.",
      },
      { status: 500 },
    );
  }
}
