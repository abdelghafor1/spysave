import { NextResponse } from "next/server";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { saveAd } from "@/lib/ads";
import { db } from "@/lib/firebase";

type SaveAdPayload = {
  userId?: string;
  pageName?: string;
  adText?: string;
  mediaUrl?: string;
  sourceUrl?: string;
  landingPageUrl?: string;
  tags?: string[] | string;
  notes?: string;
  folder?: string;
  platform?: "Meta" | "TikTok";
};

export type AdAnalysis = {
  hook: string;
  offer: string;
  cta: string;
  niche: string;
  audienceGuess: string;
  painPoint: string;
  trustSignals: string[];
  objectionHandling: string[];
  adFatigueRisk: string;
  weaknesses: string[];
  whyItMayWork: string;
  ideasToTest: string[];
  rewriteSuggestions: {
    hook: string;
    cta: string;
    adCopy: string;
  };
  scoreBreakdown: {
    hook: number;
    offer: number;
    cta: number;
    trust: number;
    audienceFit: number;
  };
  winningScore: number;
  verdict: "Weak" | "Good" | "Possible Winner";
  scoreReasons: string[];
};

type CompetitorRecord = {
  id: string;
  name?: string;
};

function normalizeTags(tags: SaveAdPayload["tags"]) {
  if (Array.isArray(tags)) {
    return tags.map((tag) => tag.trim()).filter(Boolean);
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

function extractHook(adText = "") {
  const firstLine = adText
    .split(/\n|\.|\?|!/)
    .map((line) => line.trim())
    .find(Boolean);

  return firstLine || "Add a stronger first line to make the hook clear.";
}

function detectCta(adText = "") {
  const text = adText.toLowerCase();
  if (text.includes("shop")) return "Shop now";
  if (text.includes("learn")) return "Learn more";
  if (text.includes("order")) return "Order now";
  if (text.includes("message")) return "Send message";
  return "CTA not obvious";
}

function detectOffer(adText = "") {
  const discount = adText.match(/\b\d{1,2}%\s?(off|discount)?\b/i)?.[0];
  if (discount) return discount;
  if (/free shipping/i.test(adText)) return "Free shipping";
  if (/buy\s?\d|get\s?\d|bundle/i.test(adText)) return "Bundle offer";
  return "No clear offer detected";
}

function detectNiche(adText = "") {
  const text = adText.toLowerCase();
  if (/skin|acne|beauty|serum|hair/.test(text)) return "Skincare / beauty";
  if (/workout|fitness|gym|weight|protein/.test(text)) return "Fitness";
  if (/kitchen|home|clean|organizer/.test(text)) return "Home gadget";
  if (/dress|shoes|fashion|wear/.test(text)) return "Fashion";
  return "General e-commerce";
}

function scoreAd(adText: string) {
  const text = adText.toLowerCase();
  const reasons: string[] = [];
  let score = 35;

  if (extractHook(adText).length >= 18) {
    score += 12;
    reasons.push("Clear hook");
  }

  if (detectOffer(adText) !== "No clear offer detected") {
    score += 16;
    reasons.push("Clear offer");
  }

  if (detectCta(adText) !== "CTA not obvious") {
    score += 12;
    reasons.push("Clear CTA");
  }

  if (/tired|struggle|problem|hiding|save|stop|without|before|after|pain|wasting/i.test(adText)) {
    score += 12;
    reasons.push("Pain point or result angle");
  }

  if (/free|discount|%|bundle|limited|today|shipping/i.test(text)) {
    score += 8;
    reasons.push("Buying incentive");
  }

  if (adText.length >= 80 && adText.length <= 700) {
    score += 5;
    reasons.push("Readable length");
  }

  const finalScore = Math.max(0, Math.min(100, score));
  const verdict =
    finalScore >= 78 ? "Possible Winner" : finalScore >= 58 ? "Good" : "Weak";

  return {
    winningScore: finalScore,
    verdict,
    scoreReasons: reasons.length ? reasons.slice(0, 4) : ["Needs stronger proof"],
  } satisfies Pick<AdAnalysis, "winningScore" | "verdict" | "scoreReasons">;
}

function detectObjectionHandling(adText = "") {
  const objections: string[] = [];
  if (/free shipping|shipping|delivery|fast delivery/i.test(adText)) {
    objections.push("Shipping or delivery concern");
  }
  if (/guarantee|refund|return|risk[-\s]?free/i.test(adText)) {
    objections.push("Risk reversal or refund concern");
  }
  if (/review|rated|stars|testimonial|before|after|results/i.test(adText)) {
    objections.push("Trust and proof concern");
  }
  if (/discount|%|sale|bundle|buy\s?\d|get\s?\d|free/i.test(adText)) {
    objections.push("Price or value concern");
  }

  return objections.length
    ? objections.slice(0, 5)
    : ["No clear objections handled. Add proof, guarantee, shipping, or value reasons."];
}

function detectAdFatigueRisk(adText = "") {
  const text = adText.toLowerCase();
  const hasFreshAngle = /story|i tried|before|after|challenge|day \d|routine|testimonial|creator|ugc/i.test(adText);
  const isOfferHeavy = /discount|%|sale|limited|today|free shipping|buy now|shop now/i.test(text);
  const isShortGeneric = adText.trim().length < 80 || /best product|must have|viral|limited offer/i.test(text);

  if (isShortGeneric && isOfferHeavy) {
    return "High risk: the ad leans on a generic offer/hook and may fatigue quickly without new creatives.";
  }
  if (hasFreshAngle) {
    return "Low to medium risk: the ad has a story, demo, or proof angle that can be refreshed into variants.";
  }
  return "Medium risk: the core angle is usable, but it needs new hooks, thumbnails, or proof variations to avoid fatigue.";
}

function fallbackAnalysis(adText: string): AdAnalysis {
  const score = scoreAd(adText);

  return {
    hook: extractHook(adText),
    offer: detectOffer(adText),
    cta: detectCta(adText),
    niche: detectNiche(adText),
    audienceGuess: "Dropshipping or small e-commerce buyer persona",
    painPoint:
      "The ad needs a clearer pain point unless the first line already names the customer problem.",
    trustSignals: /review|rated|stars|before|after|guarantee|testimonial/i.test(adText)
      ? ["Contains a possible proof or trust element"]
      : ["No strong trust signal detected"],
    objectionHandling: detectObjectionHandling(adText),
    adFatigueRisk: detectAdFatigueRisk(adText),
    weaknesses: [
      detectOffer(adText) === "No clear offer detected"
        ? "Offer is not clear enough"
        : "Offer could be made more specific",
      detectCta(adText) === "CTA not obvious"
        ? "CTA is missing or unclear"
        : "CTA can be stronger",
    ],
    whyItMayWork:
      "The ad can work when the hook names a clear problem, the offer is simple, and the CTA tells the buyer what to do next.",
    ideasToTest: [
      "Test a UGC video with the same hook.",
      "Create a shorter version focused only on the pain point.",
      "Try a bundle or free shipping offer against the current CTA.",
    ],
    rewriteSuggestions: {
      hook: `Try: ${extractHook(adText)}`,
      cta:
        detectCta(adText) === "CTA not obvious"
          ? "Try: Shop now before the offer ends."
          : `Try a more urgent CTA based on: ${detectCta(adText)}`,
      adCopy:
        "Rewrite the ad with one clear pain point, one proof element, one simple offer, and one CTA.",
    },
    scoreBreakdown: {
      hook: extractHook(adText).length >= 18 ? 20 : 10,
      offer: detectOffer(adText) !== "No clear offer detected" ? 18 : 8,
      cta: detectCta(adText) !== "CTA not obvious" ? 14 : 5,
      trust: /review|rated|stars|before|after|guarantee|testimonial/i.test(adText)
        ? 12
        : 4,
      audienceFit: detectNiche(adText) !== "General e-commerce" ? 20 : 12,
    },
    ...score,
  };
}

function normalizeName(value = "") {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

async function createCompetitorNotification({
  userId,
  pageName,
  adId,
}: {
  userId: string;
  pageName: string;
  adId: string;
}) {
  try {
    const competitorsQuery = query(
      collection(db, "competitors"),
      where("userId", "==", userId),
    );
    const competitorsSnapshot = await getDocs(competitorsQuery);
    const pageKey = normalizeName(pageName);
    const competitor = competitorsSnapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }) as CompetitorRecord)
      .find((item) => normalizeName(item.name || "") === pageKey);

    if (!competitor?.name) return;

    await addDoc(collection(db, "notifications"), {
      userId,
      adId,
      competitorName: competitor.name,
      title: "New competitor ad",
      message: `${competitor.name} has a new saved ad in your library.`,
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn("Notification skipped", error);
  }
}

export function cleanAnalysis(value: Partial<AdAnalysis>, adText: string): AdAnalysis {
  const fallback = fallbackAnalysis(adText);

  return {
    hook: value.hook || fallback.hook,
    offer: value.offer || fallback.offer,
    cta: value.cta || fallback.cta,
    niche: value.niche || fallback.niche,
    audienceGuess: value.audienceGuess || fallback.audienceGuess,
    painPoint: value.painPoint || fallback.painPoint,
    trustSignals:
      Array.isArray(value.trustSignals) && value.trustSignals.length
        ? value.trustSignals.slice(0, 5)
        : fallback.trustSignals,
    objectionHandling:
      Array.isArray(value.objectionHandling) && value.objectionHandling.length
        ? value.objectionHandling.slice(0, 5)
        : fallback.objectionHandling,
    adFatigueRisk: value.adFatigueRisk || fallback.adFatigueRisk,
    weaknesses:
      Array.isArray(value.weaknesses) && value.weaknesses.length
        ? value.weaknesses.slice(0, 5)
        : fallback.weaknesses,
    whyItMayWork: value.whyItMayWork || fallback.whyItMayWork,
    ideasToTest:
      Array.isArray(value.ideasToTest) && value.ideasToTest.length
        ? value.ideasToTest.slice(0, 3)
        : fallback.ideasToTest,
    rewriteSuggestions: {
      hook: value.rewriteSuggestions?.hook || fallback.rewriteSuggestions.hook,
      cta: value.rewriteSuggestions?.cta || fallback.rewriteSuggestions.cta,
      adCopy:
        value.rewriteSuggestions?.adCopy || fallback.rewriteSuggestions.adCopy,
    },
    scoreBreakdown: {
      hook:
        typeof value.scoreBreakdown?.hook === "number"
          ? value.scoreBreakdown.hook
          : fallback.scoreBreakdown.hook,
      offer:
        typeof value.scoreBreakdown?.offer === "number"
          ? value.scoreBreakdown.offer
          : fallback.scoreBreakdown.offer,
      cta:
        typeof value.scoreBreakdown?.cta === "number"
          ? value.scoreBreakdown.cta
          : fallback.scoreBreakdown.cta,
      trust:
        typeof value.scoreBreakdown?.trust === "number"
          ? value.scoreBreakdown.trust
          : fallback.scoreBreakdown.trust,
      audienceFit:
        typeof value.scoreBreakdown?.audienceFit === "number"
          ? value.scoreBreakdown.audienceFit
          : fallback.scoreBreakdown.audienceFit,
    },
    winningScore:
      typeof value.winningScore === "number"
        ? Math.max(0, Math.min(100, Math.round(value.winningScore)))
        : fallback.winningScore,
    verdict:
      value.verdict === "Possible Winner" ||
      value.verdict === "Good" ||
      value.verdict === "Weak"
        ? value.verdict
        : fallback.verdict,
    scoreReasons:
      Array.isArray(value.scoreReasons) && value.scoreReasons.length
        ? value.scoreReasons.slice(0, 4)
        : fallback.scoreReasons,
  };
}

function parseJsonObject(content: string) {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const candidate = fenced || trimmed.match(/\{[\s\S]*\}/)?.[0] || trimmed;

  return JSON.parse(candidate) as Partial<AdAnalysis>;
}

export async function analyzeWithNvidia(adText: string): Promise<AdAnalysis | null> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) return null;

  const model = process.env.NVIDIA_MODEL || "meta/llama-3.1-8b-instruct";
  const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You analyze ecommerce Meta/Facebook ads for dropshippers. Return only JSON with keys: hook, offer, cta, niche, audienceGuess, painPoint, trustSignals, objectionHandling, adFatigueRisk, weaknesses, whyItMayWork, ideasToTest, rewriteSuggestions, scoreBreakdown, winningScore, verdict, scoreReasons. trustSignals, objectionHandling, and weaknesses are arrays of short strings. adFatigueRisk is one short practical sentence: Low, Medium, or High risk plus why. ideasToTest must be exactly 3 short strings. rewriteSuggestions has hook, cta, adCopy. scoreBreakdown has hook, offer, cta, trust, audienceFit as 0-25 numbers. winningScore is 0-100. verdict is Weak, Good, or Possible Winner. scoreReasons is 2-4 short strings explaining the score.",
        },
        {
          role: "user",
          content: `Analyze this ad and judge why it may work:\n\n${adText}`,
        },
      ],
      temperature: 0.2,
      max_tokens: 500,
    }),
  });

  if (!response.ok) return null;

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) return null;

  try {
    return cleanAnalysis(parseJsonObject(content), adText);
  } catch {
    return null;
  }
}

export async function analyzeWithOpenAI(adText: string): Promise<AdAnalysis | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You analyze ecommerce social ads. Return only valid JSON with keys: hook, offer, cta, niche, audienceGuess, painPoint, trustSignals, objectionHandling, adFatigueRisk, weaknesses, whyItMayWork, ideasToTest, rewriteSuggestions, scoreBreakdown, winningScore, verdict, scoreReasons. trustSignals, objectionHandling, and weaknesses are arrays of short strings. adFatigueRisk is one short practical sentence: Low, Medium, or High risk plus why. ideasToTest must be exactly 3 short strings. rewriteSuggestions has hook, cta, adCopy. scoreBreakdown has hook, offer, cta, trust, audienceFit as 0-25 numbers. winningScore is 0-100. verdict is Weak, Good, or Possible Winner. scoreReasons is 2-4 short strings.",
        },
        {
          role: "user",
          content: `Analyze this Meta ad for a dropshipper or small ecommerce owner:\n\n${adText}`,
        },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) return null;

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) return null;

  try {
    return cleanAnalysis(parseJsonObject(content), adText);
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const payload = (await request.json()) as SaveAdPayload;
  const adText = payload.adText?.trim() || "";

  if (!adText) {
    return NextResponse.json(
      { error: "Add ad text before saving." },
      { status: 400 },
    );
  }

  let firestoreId = "";

  if (payload.userId?.trim()) {
    const saved = await saveAd({
      userId: payload.userId.trim(),
      pageName: payload.pageName || "Unknown page",
      adText,
      mediaUrl: payload.mediaUrl || "",
      sourceUrl: payload.sourceUrl || "",
      landingPageUrl: payload.landingPageUrl || "",
      platform: payload.platform || "Meta",
      tags: normalizeTags(payload.tags),
      notes: payload.notes || "",
      folder: payload.folder || "Extension saves",
    });

    firestoreId = saved.id;
    await createCompetitorNotification({
      userId: payload.userId.trim(),
      pageName: payload.pageName || "Unknown page",
      adId: firestoreId,
    });
  }

  return NextResponse.json({
    id: firestoreId || crypto.randomUUID(),
    firestoreId,
    userId: payload.userId?.trim() || "",
    savedAt: new Date().toISOString(),
    ad: {
      pageName: payload.pageName || "Unknown page",
      adText,
      mediaUrl: payload.mediaUrl || "",
      sourceUrl: payload.sourceUrl || "",
      landingPageUrl: payload.landingPageUrl || "",
      platform: payload.platform || "Meta",
    },
  });
}
