import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export type SpySaveAd = {
  id?: string;
  userId: string;
  pageName: string;
  adText: string;
  mediaUrl?: string;
  sourceUrl?: string;
  landingPageUrl?: string;
  platform: "Meta" | "TikTok";
  tags: string[];
  notes?: string;
  folder?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  analysis?: SpySaveAnalysis;
};

export type SpySaveCompetitor = {
  id?: string;
  userId: string;
  name: string;
  libraryUrl: string;
  niche?: string;
  notes?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type SpySaveAnalysis = {
  hook: string;
  offer: string;
  cta: string;
  niche: string;
  audienceGuess: string;
  painPoint?: string;
  trustSignals?: string[];
  weaknesses?: string[];
  whyItMayWork: string;
  ideasToTest: string[];
  rewriteSuggestions?: {
    hook?: string;
    cta?: string;
    adCopy?: string;
  };
  scoreBreakdown?: {
    hook?: number;
    offer?: number;
    cta?: number;
    trust?: number;
    audienceFit?: number;
  };
  winningScore?: number;
  verdict?: "Weak" | "Good" | "Possible Winner";
  scoreReasons?: string[];
};

export type SpySaveNotification = {
  id?: string;
  userId: string;
  adId?: string;
  competitorName: string;
  title: string;
  message: string;
  read?: boolean;
  createdAt?: Timestamp;
};

export async function saveAd(ad: SpySaveAd) {
  return addDoc(collection(db, "ads"), {
    ...ad,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function saveCompetitor(competitor: SpySaveCompetitor) {
  return addDoc(collection(db, "competitors"), {
    ...competitor,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function saveAnalysis(adId: string, analysis: SpySaveAnalysis) {
  return updateDoc(doc(db, "ads", adId), {
    analysis,
    analyzedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getAd(adId: string) {
  const snapshot = await getDoc(doc(db, "ads", adId));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as SpySaveAd;
}

export async function getCompetitor(competitorId: string) {
  const snapshot = await getDoc(doc(db, "competitors", competitorId));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as SpySaveCompetitor;
}

export function watchUserAds(
  userId: string,
  onChange: (ads: SpySaveAd[]) => void,
  onError: (error: Error) => void,
) {
  const adsQuery = query(collection(db, "ads"), where("userId", "==", userId));

  return onSnapshot(
    adsQuery,
    (snapshot) => {
      const ads = snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }) as SpySaveAd)
        .sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() ?? 0;
          const bTime = b.createdAt?.toMillis?.() ?? 0;
          return bTime - aTime;
        });

      onChange(ads);
    },
    onError,
  );
}

export function watchUserCompetitors(
  userId: string,
  onChange: (competitors: SpySaveCompetitor[]) => void,
  onError: (error: Error) => void,
) {
  const competitorsQuery = query(
    collection(db, "competitors"),
    where("userId", "==", userId),
  );

  return onSnapshot(
    competitorsQuery,
    (snapshot) => {
      const competitors = snapshot.docs
        .map(
          (item) =>
            ({ id: item.id, ...item.data() }) as SpySaveCompetitor,
        )
        .sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() ?? 0;
          const bTime = b.createdAt?.toMillis?.() ?? 0;
          return bTime - aTime;
        });

      onChange(competitors);
    },
    onError,
  );
}

export function watchUserNotifications(
  userId: string,
  onChange: (notifications: SpySaveNotification[]) => void,
  onError: (error: Error) => void,
) {
  const notificationsQuery = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
  );

  return onSnapshot(
    notificationsQuery,
    (snapshot) => {
      const notifications = snapshot.docs
        .map(
          (item) =>
            ({ id: item.id, ...item.data() }) as SpySaveNotification,
        )
        .sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() ?? 0;
          const bTime = b.createdAt?.toMillis?.() ?? 0;
          return bTime - aTime;
        });

      onChange(notifications);
    },
    onError,
  );
}

export async function updateAd(
  adId: string,
  changes: Pick<SpySaveAd, "notes" | "tags" | "folder">,
) {
  return updateDoc(doc(db, "ads", adId), {
    ...changes,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteAd(adId: string) {
  return deleteDoc(doc(db, "ads", adId));
}

export async function deleteAdWithFallback(adId: string, userId: string) {
  try {
    await deleteAd(adId);
  } catch (deleteError) {
    const response = await fetch(`/api/ads/${adId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      throw new Error(
        data.error ||
          (deleteError instanceof Error ? deleteError.message : "Delete failed"),
      );
    }
  }
}

export async function deleteCompetitor(competitorId: string) {
  return deleteDoc(doc(db, "competitors", competitorId));
}
