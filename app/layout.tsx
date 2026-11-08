import type { Metadata, Viewport } from "next";
import { Cinzel_Decorative, Cormorant_Garamond, Great_Vibes, Plus_Jakarta_Sans } from "next/font/google";
import { COUPLE, EVENT } from "@/lib/config";
import "./globals.css";

const cinzel = Cinzel_Decorative({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-cinzel-decorative" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-cormorant" });
const script = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-great-vibes" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-jakarta" });

const { partnerA: a, partnerB: b } = COUPLE;

const title = `${a} & ${b} · ${EVENT.occasion}`;
const description = `${EVENT.date}, ${EVENT.time} · ${EVENT.venue.name}, ${EVENT.venue.address}. ${EVENT.blessing}`;

export const metadata: Metadata = {
  // Absolute URLs for the share preview image.
  metadataBase: new URL("https://shreyas-and-kruthika.vercel.app"),
  title,
  description,
  // Pre-rendered JPEG kept under ~200 KB so WhatsApp reliably shows the preview.
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_IN",
    siteName: `${a} & ${b}`,
    images: [{ url: "/images/share-preview.jpg", width: 1200, height: 630, alt: title }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/share-preview.jpg"] },
};

export const viewport: Viewport = {
  themeColor: "#4F0E0B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable} ${jakarta.variable} ${script.variable}`}>
      <body>{children}</body>
    </html>
  );
}
