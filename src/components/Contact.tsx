"use client";

import { useState } from "react";
import type { SocialKey } from "@/config/site";
import SocialLinks from "./SocialLinks";

type Status = "idle" | "sending" | "sent" | "error";

const fieldCls =
  "rounded-[10px] border border-[#5c5245] bg-[#4a4136] px-[18px] py-4 text-[15px] text-[#f6efe4] placeholder:text-[#a9a091] outline-none transition-colors focus:border-[#c98b7e]";

export default function Contact({
  contactEmail,
  socials,
}: {
  contactEmail: string;
  socials: Record<SocialKey, string>;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    // Honeypot: bots fill hidden fields, humans don't.
    if (data.company) return;

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
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Une erreur est survenue.");
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  }

  return (
    <section id="contact" className="bg-[#37302a]">
      <div className="mx-auto grid max-w-[1180px] items-center gap-12 px-5 py-16 sm:px-10 md:grid-cols-2 md:py-20">
        <div>
          <span className="text-[13px] uppercase tracking-[0.28em] text-[#c98b7e]">
            Travaillons ensemble
          </span>
          <h2 className="mb-[22px] mt-[18px] font-serif font-medium leading-[1.02] text-[#f6efe4] text-[clamp(38px,5vw,52px)]">
            Un projet food
            <br />
            en tête ?
          </h2>
          <p className="mb-8 max-w-[400px] text-[17px] font-light leading-[1.7] text-[#c9bba6]">
            Shooting, recettes signées, vidéos courtes ou campagne complète —
            dites-moi tout.
          </p>
          <SocialLinks socials={socials} variant="light" />
          <a
            href={`mailto:${contactEmail}`}
            className="mt-6 inline-block text-[15px] text-[#c9bba6] underline-offset-4 transition-colors hover:text-[#f6efe4] hover:underline"
          >
            {contactEmail}
          </a>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-3.5" noValidate>
          <input
            name="name"
            required
            placeholder="Votre nom"
            autoComplete="name"
            className={fieldCls}
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Email professionnel"
            autoComplete="email"
            className={fieldCls}
          />
          <textarea
            name="message"
            required
            rows={4}
            placeholder="Votre projet"
            className={`${fieldCls} resize-none`}
          />
          {/* honeypot — visually hidden, ignored by humans */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="hidden"
          />

          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-[10px] bg-[#c98b7e] py-4 text-center text-[14px] uppercase tracking-[0.08em] text-[#37302a] transition-colors hover:bg-[#d69c8f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? "Envoi…" : "Envoyer ma demande"}
          </button>

          {status === "sent" && (
            <p className="text-[14px] text-[#dcc8a8]" role="status">
              Merci ! Votre message a bien été envoyé, je vous réponds vite.
            </p>
          )}
          {status === "error" && (
            <p className="text-[14px] text-[#e8a598]" role="alert">
              {error} Vous pouvez aussi m&apos;écrire à{" "}
              <a href={`mailto:${contactEmail}`} className="underline">
                {contactEmail}
              </a>
              .
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
