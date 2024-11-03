"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GrGoogle } from "react-icons/gr";
import { Button } from "../../../../components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useUser } from "@/hook/useUser";

const ContinueWithGoogle = () => {
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      router.push("/dashboard/projects");
    }
  }, [user, router]);

  const handleGoogleLogin = () => {
    setIsLoggingIn(true);
    signIn("google")
      .then(async () => {
        setIsLoggingIn(true);
        router.push(`/dashboard/projects`);
        setIsLoggingIn(false);
      })
      .catch((error) => {
        toast.error(error.message, {
          description: "Please try again",
          duration: 3000,
          style: {
            backgroundColor: "rgba(255, 0, 0, 0.2)",
            borderColor: "rgba(255, 0, 0, 0.4)",
          },
          className: "border",
        });
        setIsLoggingIn(false);
      })
      .finally(() => {
        setIsLoggingIn(false);
      });
  };

  return (
    <>
      <Button
        variant="gooeyLeft"
        className="w-full rounded-xl border border-input bg-transparent py-2 text-base text-primary hover:text-primary"
        onClick={handleGoogleLogin}
        disabled={isLoggingIn}
      >
        <GrGoogle className="mr-4 h-5 w-5" />
        {isLoggingIn ? "Connecting..." : "Continue with Google"}
      </Button>
    </>
  );
};

export default ContinueWithGoogle;
