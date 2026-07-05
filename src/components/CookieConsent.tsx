"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie-consent";

type Consent = "accepted" | "rejected";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  function choose(consent: Consent) {
    window.localStorage.setItem(STORAGE_KEY, consent);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Consentement aux cookies"
      className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto flex max-w-[900px] flex-col gap-4 rounded-2xl border border-[#e0d3bd] bg-[#f6efe4] p-5 shadow-[0_10px_40px_rgba(55,48,42,0.15)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <p className="text-[13px] leading-relaxed text-[#5b5044] sm:text-[14px]">
          Ce site utilise des cookies pour améliorer votre expérience de
          navigation. En cliquant sur « Accepter », vous consentez à leur
          utilisation.
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => choose("rejected")}
            className="rounded-full border border-[#c6b49a] px-5 py-2.5 text-[12px] uppercase tracking-[0.08em] text-[#5b5044] transition-colors hover:bg-[#efe6d8] sm:text-[13px]"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="rounded-full bg-[#37302a] px-5 py-2.5 text-[12px] uppercase tracking-[0.08em] text-[#f6efe4] transition-colors hover:bg-[#2e2822] sm:text-[13px]"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
