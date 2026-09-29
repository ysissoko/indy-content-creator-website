"use client";

import type { SocialKey, SiteTexts } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import SocialLinks from "./SocialLinks";

// Public key — safe to ship to the browser. Override per environment if needed.
const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAFHyZ6r3QzHZeTjI";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: { sitekey: string; action?: string; theme?: string },
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

type Status = "idle" | "sending" | "sent" | "error";

const fieldCls =
  "rounded-[10px] border border-[#5c5245] bg-[#4a4136] px-[18px] py-4 text-[15px] text-[#f6efe4] placeholder:text-[#a9a091] outline-none transition-colors focus:border-[#c98b7e]";

export default function Contact({
  contactEmail,
  socials,
  locale,
  t,
  texts,
}: {
  contactEmail: string;
  socials: Record<SocialKey, string>;
  locale: Locale;
  t: Dictionary["contactForm"];
  texts: SiteTexts["contact"];
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const turnstileEl = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  // Render explicitly so we keep the widget ID: tokens are single-use, and the
  // page stays open after a submit, so each attempt needs a reset.
  function renderTurnstile() {
    if (!window.turnstile || !turnstileEl.current || widgetId.current) return;
    widgetId.current = window.turnstile.render(turnstileEl.current, {
      sitekey: TURNSTILE_SITE_KEY,
      action: "contact",
      theme: "dark",
    });
  }

  useEffect(
    () => () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    },
    [],
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<
      string,
      string
    >;

    // Honeypot: bots fill hidden fields, humans don't.
    if (data.hp_field) return;

    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
          company: data.hp_field,
          token: data["cf-turnstile-response"],
          locale,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || t.genericError);
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : t.genericError);
    } finally {
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
    }
  }

  return (
    <section id="contact" className="bg-[#37302a]">
      <div className="mx-auto grid max-w-[1180px] items-center gap-12 px-5 py-16 sm:px-10 md:grid-cols-2 md:py-20">
        <div>
          <span className="text-[13px] uppercase tracking-[0.28em] text-[#c98b7e]">
            {texts.eyebrow}
          </span>
          <h2 className="mb-[22px] mt-[18px] whitespace-pre-line font-serif font-medium leading-[1.02] text-[#f6efe4] text-[clamp(38px,5vw,52px)]">
            {texts.title}
          </h2>
          <p className="mb-8 max-w-[400px] text-[17px] font-light leading-[1.7] text-[#c9bba6]">
            {texts.intro}
          </p>
          <SocialLinks socials={socials} variant="light" />
          <a
            href={`mailto:${contactEmail}`}
            className="mt-6 inline-block text-[15px] text-[#c9bba6] underline-offset-4 transition-colors hover:text-[#f6efe4] hover:underline"
          >
            {contactEmail}
          </a>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
          <input
            name="name"
            required
            placeholder={t.namePlaceholder}
            autoComplete="name"
            className={fieldCls}
          />
          <input
            name="email"
            type="email"
            required
            placeholder={t.emailPlaceholder}
            autoComplete="email"
            className={fieldCls}
          />
          <textarea
            name="message"
            required
            rows={4}
            placeholder={t.messagePlaceholder}
            className={`${fieldCls} resize-none`}
          />
          {/* honeypot — visually hidden, ignored by humans */}
          <input
            type="text"
            name="hp_field"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="hidden"
          />

          <div ref={turnstileEl} className="min-h-[65px]" />

          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-[10px] bg-[#c98b7e] py-4 text-center text-[14px] uppercase tracking-[0.08em] text-[#37302a] transition-colors hover:bg-[#d69c8f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? t.sending : t.submit}
          </button>

          {status === "sent" && (
            <p className="text-[14px] text-[#dcc8a8]" role="status">
              {t.sent}
            </p>
          )}
          {status === "error" && (
            <p className="text-[14px] text-[#e8a598]" role="alert">
              {error} {t.writeInstead}{" "}
              <a href={`mailto:${contactEmail}`} className="underline">
                {contactEmail}
              </a>
              .
            </p>
          )}
        </form>
      </div>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        onReady={renderTurnstile}
      />
    </section>
  );
}
