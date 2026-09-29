// Dedicated ROOT layout for the CMS admin. Keystatic renders its own full UI
// here, independent of the marketing site's sections. This must own <html>/
// <body> because the marketing site's root layout now lives under
// app/[lang]/layout.tsx and does not apply to this static "/keystatic" route.
export default function KeystaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
