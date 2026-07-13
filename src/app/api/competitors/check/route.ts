import { NextResponse } from "next/server";
import { addDoc, collection, getDocs, query, serverTimestamp, updateDoc, where, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { SpySaveAd, SpySaveCompetitor } from "@/lib/ads";

type CheckPayload = {
  userId?: string;
  competitorId?: string;
  competitorName?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as CheckPayload;
  const userId = payload.userId?.trim() || "";
  const competitorName = payload.competitorName?.trim() || "";

  if (!userId || !payload.competitorId || !competitorName) {
    return NextResponse.json(
      { error: "User ID, competitor ID, and competitor name are required." },
      { status: 400 },
    );
  }

  const adsQuery = query(collection(db, "ads"), where("userId", "==", userId));
  const adsSnapshot = await getDocs(adsQuery);
  const competitorAds = adsSnapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }) as SpySaveAd)
    .filter((ad) => ad.pageName.toLowerCase() === competitorName.toLowerCase());

  const competitorRef = doc(db, "competitors", payload.competitorId);
  const previousCountQuery = query(
    collection(db, "competitors"),
    where("userId", "==", userId),
  );
  const competitorSnapshot = await getDocs(previousCountQuery);
  const competitor = competitorSnapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }) as SpySaveCompetitor)
    .find((item) => item.id === payload.competitorId);
  const previousCount = competitor?.trackedAdsCount || 0;
  const newAds = Math.max(0, competitorAds.length - previousCount);
  const summary =
    newAds > 0
      ? `${newAds} new saved ad${newAds > 1 ? "s" : ""} found for ${competitorName}.`
      : `No new saved ads found for ${competitorName}.`;

  await updateDoc(competitorRef, {
    trackedAdsCount: competitorAds.length,
    lastCheckSummary: summary,
    lastCheckedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await addDoc(collection(db, "notifications"), {
    userId,
    competitorName,
    title: newAds > 0 ? "Competitor has new saved ads" : "Competitor check complete",
    message: summary,
    read: false,
    createdAt: serverTimestamp(),
  });

  return NextResponse.json({
    ok: true,
    competitorName,
    adsCount: competitorAds.length,
    newAds,
    summary,
  });
}
