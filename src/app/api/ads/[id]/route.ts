import { NextResponse } from "next/server";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const payload = (await request.json().catch(() => ({}))) as {
    userId?: string;
  };
  const userId = payload.userId?.trim();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required." }, { status: 400 });
  }

  const adRef = doc(db, "ads", id);
  const snapshot = await getDoc(adRef);

  if (!snapshot.exists()) {
    return NextResponse.json({ ok: true });
  }

  if (snapshot.data().userId !== userId) {
    return NextResponse.json(
      { error: "This ad belongs to another account." },
      { status: 403 },
    );
  }

  await deleteDoc(adRef);
  return NextResponse.json({ ok: true });
}
