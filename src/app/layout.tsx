import { geistSans } from "@/lib/fonts";
import { ThemeProvider } from "@/providers/theme-provider";

import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import ClientProvider from "@/providers/client-provider";
import { QueryProvider } from "@/providers/query-provider";
import TRPCProvider from "@/providers/trpc-provider";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Toaster } from "sonner";
import { authOptions } from "./api/auth/[...nextauth]/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "Togl - Enterprise-Grade Feature Management System",
  description:
    "Togl is a high-performance feature management system built with NextJS, designed for modern development teams. Enable seamless feature deployment and A/B testing at scale.",
  keywords: [
    "feature management",
    "feature flags",
    "A/B testing",
    "NextJS",
    "enterprise",
    "development",
  ],
  authors: [{ name: "Togl Team" }],
  creator: "Jay Suthar",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen w-full scroll-smooth bg-background text-foreground antialiased",
          geistSans.className,
        )}
      >
        <ClientProvider session={session}>
          <TRPCProvider>
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
          </TRPCProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
