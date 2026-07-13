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
  landingPageAnalysis?: SpySaveLandingPageAnalysis;
  mediaStatus?: SpySaveMediaStatus;
};

export type SpySaveCompetitor = {
  id?: string;
  userId: string;
  name: string;
  libraryUrl: string;
  niche?: string;
  notes?: string;
  trackedAdsCount?: number;
  lastCheckedAt?: Timestamp;
  lastCheckSummary?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type SpySaveLandingPageAnalysis = {
  url: string;
  title: string;
  description: string;
  headlineGuess: string;
  offerGuess: string;
  priceGuess: string;
  ctaGuess: string;
  adMatchScore: number;
  recommendations: string[];
  checkedAt: string;
};

export type SpySaveMediaStatus = {
  mediaUrl?: string;
  source: "detected-url" | "manual-url" | "missing";
  status: "ready" | "missing" | "external-preview-risk";
  recommendation: string;
};

export type SpySaveAnalysis = {
  hook: string;
  offer: string;
  cta: string;
  niche: string;
  audienceGuess: string;
  painPoint?: string;
  trustSignals?: string[];
  objectionHandling?: string[];
  adFatigueRisk?: string;
  weaknesses?: string[];
  whyItMayWork: string;
  ideasToTest: string[];
  rewriteSuggestions?: {
    hook?: string;
    cta?: string;
    adCopy?: string;
  };
  creativeBrief?: {
    angle?: string;
    concept?: string;
    script?: string;
    visualDirection?: string;
  };
  actionPlan?: {
    bestNextMove?: string;
    recommendedFormat?: string;
    hookToTest?: string;
    ctaToTest?: string;
    audienceToTarget?: string;
    platformRecommendation?: string;
    scriptLength?: string;
  };
  generatedCreatives?: {
    hooks?: string[];
    ugcScripts?: string[];
    tiktokRewrite?: string;
    metaRewrite?: string;
    imagePrompts?: string[];
    videoPrompt?: string;
  };
  testPlan?: string[];
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

export type SpySaveWorkspace = {
  id?: string;
  userId: string;
  name: string;
  plan: "Free" | "Pro" | "Agency";
  members: Array<{
    email: string;
    role: "Admin" | "Member" | "Viewer";
  }>;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
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

export async function saveLandingPageAnalysis(
  adId: string,
  landingPageAnalysis: SpySaveLandingPageAnalysis,
) {
  return updateDoc(doc(db, "ads", adId), {
    landingPageAnalysis,
    updatedAt: serverTimestamp(),
  });
}

export async function saveMediaStatus(adId: string, mediaStatus: SpySaveMediaStatus) {
  return updateDoc(doc(db, "ads", adId), {
    mediaStatus,
    updatedAt: serverTimestamp(),
  });
}

export async function updateCompetitorCheck(
  competitorId: string,
  changes: Pick<
    SpySaveCompetitor,
    "trackedAdsCount" | "lastCheckSummary"
  >,
) {
  return updateDoc(doc(db, "competitors", competitorId), {
    ...changes,
    lastCheckedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function createNotification(
  notification: Omit<SpySaveNotification, "id" | "createdAt">,
) {
  return addDoc(collection(db, "notifications"), {
    ...notification,
    createdAt: serverTimestamp(),
  });
}

export async function markNotificationRead(notificationId: string) {
  return updateDoc(doc(db, "notifications", notificationId), {
    read: true,
  });
}

export async function saveWorkspace(workspace: SpySaveWorkspace) {
  return addDoc(collection(db, "workspaces"), {
    ...workspace,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function watchUserWorkspaces(
  userId: string,
  onChange: (workspaces: SpySaveWorkspace[]) => void,
  onError: (error: Error) => void,
) {
  const workspacesQuery = query(
    collection(db, "workspaces"),
    where("userId", "==", userId),
  );

  return onSnapshot(
    workspacesQuery,
    (snapshot) => {
      const workspaces = snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }) as SpySaveWorkspace)
        .sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() ?? 0;
          const bTime = b.createdAt?.toMillis?.() ?? 0;
          return bTime - aTime;
        });

      onChange(workspaces);
    },
    onError,
  );
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
