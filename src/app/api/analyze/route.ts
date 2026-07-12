import { NextResponse } from "next/server";
import {
  analyzeWithNvidia,
  analyzeWithOpenAI,
  cleanAnalysis,
} from "@/app/api/ads/route";

type AnalyzePayload = {
  adText?: string;
};

function fallbackAnalysis(adText: string) {
  return cleanAnalysis({}, adText);
}

export async function POST(request: Request) {
  const payload = (await request.json()) as AnalyzePayload;
  const adText = payload.adText?.trim() || "";

  if (!adText) {
    return NextResponse.json(
      { error: "Add ad text before analyzing." },
      { status: 400 },
    );
  }

  const analysis =
    (await analyzeWithNvidia(adText)) ||
    (await analyzeWithOpenAI(adText)) ||
    fallbackAnalysis(adText);

  return NextResponse.json({ analysis });
}
