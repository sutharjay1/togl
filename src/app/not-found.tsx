import NavBar from "@/components/global/nav-bar";
import { Button } from "@/components/ui/button";
import { H1, P } from "@/components/ui/typography";
import { geistSans } from "@/features/font";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Component() {
  return (
    <>
      <NavBar />
      <main
        className={cn(
          "relative z-10 min-h-screen bg-background",
          geistSans.className,
        )}
      >
        <div className="relative isolate flex flex-col items-center justify-center px-6 pt-24 md:justify-start md:pt-14 lg:px-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#048060] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>
        </div>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[size:50px_50px] bg-grid-white/[0.02]" />
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 blur-[100px]" />
        </div>
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="animate-float absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                width: `${Math.random() * 40 + 20}px`,
                height: `${Math.random() * 40 + 20}px`,
              }}
            >
              <div className="h-full w-full rotate-[25deg] rounded-sm bg-gray-800/10 dark:bg-gray-800/20" />
            </div>
          ))}
        </div>

        <section
          className={cn(
            "relative mx-auto flex h-[calc(100vh-20rem)] w-full max-w-5xl flex-col items-center justify-center pt-20 md:pt-24",
          )}
        >
          <main className="z-10 flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-4 py-12 lg:justify-start">
            <div className="relative w-full">
              <H1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                <span className="inline-block bg-gradient-to-br from-primary to-primary-foreground bg-clip-text text-transparent">
                  Lost in space
                </span>
              </H1>
              <P className="mt-4 max-w-prose bg-gradient-to-br from-primary to-primary-foreground bg-clip-text text-base text-transparent md:text-lg">
                404 error. Sorry, but the page you&apos;re looking for
                doesn&apos;t exist.
              </P>

              <Button
                size="lg"
                className="group mt-8 w-full gap-2 border border-input bg-transparent px-6 pl-1 text-primary hover:text-primary sm:w-fit"
                asChild
                variant="gooeyLeft"
              >
                <Link href="/">Return home</Link>
              </Button>
            </div>
          </main>
        </section>
      </main>
    </>
  );
}
