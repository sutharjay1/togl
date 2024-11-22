import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { geistSans } from "@/features/font";
import { cn } from "@/lib/utils";
import NextTopLoader from "nextjs-toploader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <NextTopLoader
          color="#EEEEEC65"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #EEEEEC65,0 0 5px #EEEEEC65"
          template='<div class="bar" role="bar"><div class="peg"></div></div> 
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
          zIndex={1600}
          showAtBottom={false}
        />
        <main
          className={cn(
            "relative z-10 min-h-screen w-full",
            geistSans.className,
          )}
        >
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[size:50px_50px] opacity-30 bg-grid-white/[0.02]" />
          </div>

          <section
            className={cn(
              "relative flex h-[calc(100vh-5rem)] flex-1 flex-col",
              // "h-full overflow-scroll border-b-[1px] border-l-[1px] border-r-[1px] border-t-[1px] border-muted-foreground/30 bg-card shadow-2xl dark:bg-background/80 md:rounded-l-3xl md:border-r-0",
              "h-full overflow-scroll",
            )}
          >
            <div className="my-2">{children}</div>
          </section>
        </main>
      </SidebarProvider>
    </>
  );
}
