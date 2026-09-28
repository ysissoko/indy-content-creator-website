import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSiteContent } from "@/lib/content";

// Basic email shape check — good enough to reject obvious junk.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TURNSTILE_ACTION = "contact";

export async function POST(req: Request) {
  let body: {
    name?: string;
    email?: string;
    message?: string;
    company?: string;
    token?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Honeypot: pretend it worked so the bot learns nothing.
  if (body.company) return NextResponse.json({ ok: true });

  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!(await verifyTurnstile(body.token, clientIp))) {
    return NextResponse.json(
      { error: "Vérification anti-spam échouée. Rechargez la page et réessayez." },
      { status: 403 },
    );
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Tous les champs sont requis." },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }
  if (message.length > 5000) {
    return NextResponse.json({ error: "Message trop long." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Not configured yet — log it so nothing is lost during setup, and tell
    // the visitor to use the email link rather than failing silently.
    console.warn(
      "[contact] RESEND_API_KEY manquante. Message reçu mais non envoyé:",
      { name, email, message },
    );
    return NextResponse.json(
      {
        error:
          "Le formulaire n'est pas encore connecté. Merci de m'écrire directement par email.",
      },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);
  // FROM must be a domain you've verified in Resend. Until you verify your own,
  // Resend's shared sandbox domain works for testing.
  const from = process.env.CONTACT_FROM || "Indy <onboarding@resend.dev>";

  try {
    const site = await getSiteContent();
    const { error } = await resend.emails.send({
      from,
      to: site.contactEmail,
      replyTo: email,
      subject: `Nouveau message de ${name} — indy.food`,
      text: `Nom : ${name}\nEmail : ${email}\n\n${message}`,
      html: `
        <div style="font-family:system-ui,sans-serif;color:#37302a">
          <h2 style="margin:0 0 12px">Nouveau message depuis indy.food</h2>
          <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
          <p><strong>Email :</strong> ${escapeHtml(email)}</p>
          <p style="white-space:pre-wrap;margin-top:16px">${escapeHtml(message)}</p>
        </div>`,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json(
        { error: "L'envoi a échoué. Réessayez plus tard." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] unexpected error:", err);
    return NextResponse.json(
      { error: "L'envoi a échoué. Réessayez plus tard." },
      { status: 500 },
    );
  }
}

// Canonical Turnstile siteverify: the token must be valid, issued for this
// form's action, and solved on one of this deployment's hostnames.
async function verifyTurnstile(
  token: unknown,
  clientIp: string | undefined,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET;
  const expectedHostnames = new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((hostname) => hostname.trim())
      .filter(Boolean),
  );

  if (
    !secret ||
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > 2048 ||
    expectedHostnames.size === 0
  ) {
    return false;
  }

  const params = new URLSearchParams({ secret, response: token });
  if (clientIp) params.set("remoteip", clientIp);

  let result: {
    success?: boolean;
    action?: string;
    hostname?: string;
    "error-codes"?: string[];
  };
  try {
    const r = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        signal: AbortSignal.timeout(10_000),
        body: params,
      },
    );
    if (!r.ok) throw new Error(`siteverify ${r.status}`);
    result = await r.json();
  } catch (err) {
    console.error("[contact] Turnstile siteverify error:", err);
    return false;
  }

  const ok =
    result.success === true &&
    result.action === TURNSTILE_ACTION &&
    !!result.hostname &&
    expectedHostnames.has(result.hostname);
  if (!ok) {
    console.warn("[contact] Turnstile rejected:", {
      success: result.success,
      action: result.action,
      hostname: result.hostname,
      errors: result["error-codes"],
    });
  }
  return ok;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
