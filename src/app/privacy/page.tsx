import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="aurora-page min-h-screen px-5 py-8 text-[#13231f]">
      <section className="premium-panel mx-auto max-w-3xl rounded-xl p-6">
        <Link href="/" className="text-sm font-bold text-[#08775d]">
          SpySave
        </Link>
        <h1 className="mt-3 text-4xl font-semibold">Privacy Policy</h1>
        <p className="mt-4 leading-7 text-[#4f635d]">
          SpySave helps users save public Meta/Facebook ad information to their
          own dashboard for research. The Chrome extension stores the dashboard
          API base and the user ID locally in Chrome storage so users do not
          need to paste them every time.
        </p>

        <div className="mt-6 grid gap-4">
          {[
            [
              "What we collect",
              "Saved ad text, page name, source URL, landing page URL, media URL, tags, notes, and AI analysis generated for the saved ad.",
            ],
            [
              "What the extension reads",
              "Only the active Facebook or Meta Ad Library page when the user opens SpySave or clicks detect/save.",
            ],
            [
              "What we do not collect",
              "SpySave does not collect passwords, private messages, payment data, or browsing history outside the pages where the user actively uses the extension.",
            ],
            [
              "Data control",
              "Users can delete saved ads from the dashboard. Deleted ads are removed from Firestore.",
            ],
          ].map(([title, body]) => (
            <article key={title} className="rounded-lg bg-white p-4">
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#4f635d]">{body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
