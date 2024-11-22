import { H1, P } from "@/components/ui/typography";
import { geistSans } from "@/features/font";
import { cn } from "@/lib/utils";
import NextTopLoader from "nextjs-toploader";

const Settings = () => {
  return (
    <>
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
          "relative z-10 min-h-screen bg-background",
          geistSans.className,
        )}
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[size:50px_50px] opacity-30 bg-grid-white/[0.02]" />
        </div>

        <section className={cn("relative flex h-full flex-1 flex-col")}>
          <div className="mt-24 flex-1 overflow-hidden">
            <div className="mx-auto max-w-5xl px-4">
              <div className="flex items-center justify-between border-b">
                <H1 className="text-4xl font-bold">Settings</H1>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="h-fit w-full border-t border-border/40 bg-card p-4 text-center text-sm text-muted-foreground">
        <P>© {new Date().getFullYear()} Togl. All rights reserved.</P>
      </footer>
    </>
  );
};

export default Settings;
