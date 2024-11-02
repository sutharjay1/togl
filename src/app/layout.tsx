import { geistSans } from "@/lib/fonts";
import { ThemeProvider } from "@/providers/theme-provider";

import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/providers/query-provider";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Togl - Enterprise-Grade Feature Management System",
  description:
    "Togl is a high-performance feature management system built with Bun, designed for modern development teams. Enable seamless feature deployment and A/B testing at scale.",
  keywords: [
    "feature management",
    "feature flags",
    "A/B testing",
    "Bun",
    "enterprise",
    "development",
  ],
  authors: [{ name: "Togl Team" }],
  creator: "Togl",
  publisher: "Togl",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Togl - Feature Management Made Easy",
    description:
      "Empower your development team with Togl's advanced feature management system. Real-time toggling, sophisticated state management, and granular access control.",
    url: "https://togl.dev",
    siteName: "Togl",
    images: [
      {
        url: "https://togl.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "Togl - Enterprise-Grade Feature Management",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Togl - Enterprise-Grade Feature Management",
    description:
      "Seamless feature deployment and A/B testing at scale with Togl's high-performance system.",
    creator: "@togldev",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/3/35/GitLab_icon.svg",
    ],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen w-full scroll-smooth bg-background text-foreground antialiased",
          geistSans.className,
        )}
      >
        <TooltipProvider>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster />

              {children}
            </ThemeProvider>
          </QueryProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
