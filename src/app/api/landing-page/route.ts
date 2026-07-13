import { NextResponse } from "next/server";
import type { SpySaveLandingPageAnalysis } from "@/lib/ads";

type LandingPayload = {
  url?: string;
  adText?: string;
};

function extractMeta(html: string, name: string) {
  const patterns = [
    new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+property=["']og:${name}["'][^>]+content=["']([^"']+)["']`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern)?.[1];
    if (match) return match.replace(/\s+/g, " ").trim();
  }

  return "";
}

function extractTitle(html: string) {
  return (
    html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim() ||
    extractMeta(html, "title") ||
    "No title detected"
  );
}

function guessOffer(text: string) {
  const discount = text.match(/\b\d{1,2}%\s?(off|discount)?\b/i)?.[0];
  if (discount) return discount;
  if (/free shipping/i.test(text)) return "Free shipping";
  if (/bundle|starter kit|buy now/i.test(text)) return "Bundle or starter offer";
  return "No clear offer detected";
}

function guessPrice(text: string) {
  return (
    text.match(/([$€£]\s?\d+(?:[.,]\d{2})?|\d+(?:[.,]\d{2})?\s?(?:USD|EUR|MAD|DH))/i)?.[0] ||
    "No price detected"
  );
}

function guessCta(text: string) {
  if (/add to cart/i.test(text)) return "Add to cart";
  if (/shop now/i.test(text)) return "Shop now";
  if (/buy now/i.test(text)) return "Buy now";
  if (/get started/i.test(text)) return "Get started";
  return "No clear CTA detected";
}

export async function POST(request: Request) {
  const payload = (await request.json()) as LandingPayload;
  const url = payload.url?.trim() || "";

  if (!url || !/^https?:\/\//i.test(url)) {
    return NextResponse.json(
      { error: "Add a valid landing page URL." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "SpySaveBot/1.0 (+https://spysave.vercel.app)" },
      next: { revalidate: 3600 },
    });
    const html = await response.text();
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 6000);
    const title = extractTitle(html);
    const description = extractMeta(html, "description");
    const adWords = new Set((payload.adText || "").toLowerCase().match(/[a-z0-9]{4,}/g) || []);
    const pageWords = new Set(text.toLowerCase().match(/[a-z0-9]{4,}/g) || []);
    const overlap = Array.from(adWords).filter((word) => pageWords.has(word)).length;
    const adMatchScore = adWords.size
      ? Math.min(100, Math.round((overlap / Math.max(1, adWords.size)) * 100))
      : 0;

    const analysis: SpySaveLandingPageAnalysis = {
      url,
      title,
      description: description || "No meta description detected",
      headlineGuess: title,
      offerGuess: guessOffer(text),
      priceGuess: guessPrice(text),
      ctaGuess: guessCta(text),
      adMatchScore,
      recommendations: [
        adMatchScore < 30
          ? "Landing page message does not strongly match the saved ad. Align the headline with the ad hook."
          : "Landing page message has some overlap with the ad.",
        guessOffer(text) === "No clear offer detected"
          ? "Make the main offer more visible above the fold."
          : "Keep the offer visible near the first CTA.",
        guessCta(text) === "No clear CTA detected"
          ? "Add a clear primary CTA."
          : "Use the same CTA language from ad to landing page.",
      ],
      checkedAt: new Date().toISOString(),
    };

    return NextResponse.json({ analysis });
  } catch {
    return NextResponse.json(
      { error: "Could not read this landing page. Some stores block automated checks." },
      { status: 502 },
    );
  }
}
