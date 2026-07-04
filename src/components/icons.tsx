import type { SVGProps } from "react";

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M16.5 3c.3 2.1 1.5 3.6 3.5 3.9v2.5c-1.3.1-2.5-.3-3.6-1v5.9c0 3-2.2 5.2-5.1 5.2-2.8 0-5-2.1-5-4.9 0-2.8 2.2-4.9 5-4.9.4 0 .8 0 1.2.1v2.6c-.4-.1-.7-.2-1.1-.2-1.4 0-2.5 1-2.5 2.4s1.1 2.4 2.5 2.4c1.4 0 2.5-1 2.5-2.5V3h2.6Z" />
    </svg>
  );
}

export function SnapchatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2.6c2.5 0 4.2 1.9 4.3 4.5 0 .5 0 1 .1 1.4.2.1.5.2.8.2.5 0 .9-.3 1.2-.3.4 0 .8.3.8.7 0 .6-.9.8-1.4 1-.3.1-.6.2-.6.5 0 .2.2.5.4.8.6.9 1.6 1.7 2.9 2 .3.1.5.3.5.6 0 .6-1.3 1-2.2 1.2-.1.3-.1.7-.3.9-.1.1-.3.2-.6.2-.4 0-.9-.1-1.5-.1-.9 0-1.4.1-2 .6-.7.5-1.4 1.1-2.7 1.1s-2-.6-2.7-1.1c-.6-.5-1.1-.6-2-.6-.6 0-1.1.1-1.5.1-.3 0-.5-.1-.6-.2-.2-.2-.2-.6-.3-.9-.9-.2-2.2-.6-2.2-1.2 0-.3.2-.5.5-.6 1.3-.3 2.3-1.1 2.9-2 .2-.3.4-.6.4-.8 0-.3-.3-.4-.6-.5-.5-.2-1.4-.4-1.4-1 0-.4.4-.7.8-.7.3 0 .7.3 1.2.3.3 0 .6-.1.8-.2.1-.4.1-.9.1-1.4C7.8 4.5 9.5 2.6 12 2.6Z" />
    </svg>
  );
}
