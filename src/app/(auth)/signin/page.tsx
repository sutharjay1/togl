import Logo from "@/features/_global/logo";

import { Button } from "@/components/ui/button";
import { H1, P } from "@/components/ui/typography";
import ContinueWithGithub from "@/features/auth/continue-with-github";
import ContinueWithGoogle from "@/features/auth/continue-with-google";
import { geistSans } from "@/features/font";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";

import Link from "next/link";

const SignIn = () => {
  return (
    <main
      className={cn(
        "relative z-10 h-screen bg-background",
        geistSans.className,
      )}
    >
      <div className="relative isolate flex flex-col items-center justify-start px-6 lg:px-8">
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

      <div className="flex h-screen flex-col items-center justify-center bg-black">
        <div className="w-full max-w-[400px] space-y-8 px-4">
          <div className="flex flex-col items-center space-y-4">
            <Logo text="text-4xl sm:text-5xl lg:text-5xl" show={false} />
            <H1 className="mb-6 font-inter text-xl font-semibold tracking-tight sm:text-2xl lg:text-2xl">
              Login to Platform
            </H1>
          </div>

          <div className="space-y-3">
            <ContinueWithGoogle />

            <ContinueWithGithub />

            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-black px-4 text-sm text-white/60">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              className="w-full rounded-xl border border-input bg-transparent py-2 text-base text-primary hover:text-primary"
              variant="gooeyLeft"
            >
              <Mail className="mr-4 h-5 w-5" />
              Continue with email
            </Button>

            <div className="flex justify-center">
              <P className="w-full text-center text-sm text-muted-foreground [&:not(:first-child)]:mt-0">
                By continuing, you agree to our
                <Button
                  asChild
                  variant="link"
                  className="h-auto p-0 text-sm font-normal"
                >
                  <Link href="#">Terms</Link>
                </Button>
                and
                <Button
                  asChild
                  variant="link"
                  className="h-auto p-0 pt-1 text-sm font-normal"
                >
                  <Link href="#">Privacy Policy</Link>
                </Button>
              </P>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignIn;
