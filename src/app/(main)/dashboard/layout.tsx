"use client";

import { P } from "@/components/ui/typography";
import { useWorkspace } from "@/hook/useWorkspace";
import { geistSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Header from "../_components/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const { setWorkspaceId } = useWorkspace();

  useEffect(() => {
    setWorkspaceId(pathname?.split("/")[2]);
  }, [pathname, setWorkspaceId]);

  return (
    <>
      <main
        className={cn(
          "relative z-10 min-h-screen bg-background",
          geistSans.className,
        )}
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[size:50px_50px] opacity-30 bg-grid-white/[0.02]" />
        </div>

        <section className={cn("relative flex h-full flex-1 flex-col")}>
          <Header />

          {children}
        </section>
      </main>
      <footer className="h-fit w-full border-t border-border/40 bg-card p-4 text-center text-sm text-muted-foreground">
        <P>© {new Date().getFullYear()} Togl. All rights reserved.</P>
      </footer>
    </>
  );
}
