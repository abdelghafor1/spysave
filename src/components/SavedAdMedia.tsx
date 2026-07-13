"use client";

import { ExternalLink, ImageIcon } from "lucide-react";
import { useState } from "react";

type SavedAdMediaProps = {
  mediaUrl?: string;
  label?: string;
};

function looksLikeVideo(url: string) {
  return /\.(mp4|webm|mov)(\?|#|$)/i.test(url) || /\/video\//i.test(url);
}

export function SavedAdMedia({
  mediaUrl,
  label = "Saved creative",
}: SavedAdMediaProps) {
  const [failed, setFailed] = useState(false);
  const cleanUrl = mediaUrl?.trim();

  if (!cleanUrl) return null;

  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-[#dbe7e2] bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-[#e6eee9] px-3 py-2">
        <p className="text-xs font-bold uppercase text-[#4f635d]">{label}</p>
        <a
          href={cleanUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#3157d5]"
        >
          Open original
          <ExternalLink size={13} />
        </a>
      </div>

      {failed ? (
        <a
          href={cleanUrl}
          target="_blank"
          rel="noreferrer"
          className="flex min-h-28 items-center gap-3 p-4 text-sm font-bold text-[#625d53]"
        >
          <span className="grid size-12 place-items-center rounded-md bg-[#f6f3ed] text-[#d25f3f]">
            <ImageIcon size={18} />
          </span>
          Media preview unavailable. Open original creative.
        </a>
      ) : looksLikeVideo(cleanUrl) ? (
        <video
          src={cleanUrl}
          controls
          playsInline
          className="max-h-[360px] w-full bg-[#101413] object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cleanUrl}
          alt="Saved ad product creative"
          className="max-h-[360px] w-full bg-[#f6f3ed] object-contain"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
