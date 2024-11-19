import { geistSans } from "@/features/font";

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
import { ThemeProvider } from "@/providers/theme-provider";

export const metadata: Metadata = {
  title: "Togl - Feature Management for Scalable Growth",
  description:
    "Togl is a reliable feature management platform designed to support your growth. Streamline feature deployment and run A/B tests effortlessly with efficient caching support for modern development needs.",
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
