"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/hook/useUser";
import { useWorkspace } from "@/hook/useWorkspace";
import { TRPCClientError } from "@trpc/client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GrGithub } from "react-icons/gr";
import { toast } from "sonner";

const ContinueWithGithub = () => {
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { user } = useUser();
  const { setWorkspaceId } = useWorkspace();

  useEffect(() => {
    if (user?.workspaceId) {
      setWorkspaceId(user.id);
      router.push(`/dashboard/${user.workspaceId}/projects`);
    }
  }, [user, router, setWorkspaceId]);

  const handleGithubLogin = async () => {
    try {
      setIsLoggingIn(true);
      const result = await signIn("github", {
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error("Github login failed", {
          description: "Please try again",
          duration: 3000,
          position: "bottom-left",
          style: {
            backgroundColor: "rgba(255, 0, 0, 0.2)",
            borderColor: "rgba(255, 0, 0, 0.4)",
            color: "white",
          },
          className: "border-[1px]",
        });
      } else {
        toast.error("Unexpected Error", {
          description: "Something went wrong. Please try again.",
          duration: 3000,
          position: "bottom-left",
          style: {
            backgroundColor: "rgba(255, 0, 0, 0.2)",
            borderColor: "rgba(255, 0, 0, 0.4)",
            color: "white",
          },
          className: "border-[1px]",
        });
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Button
      variant="gooeyRight"
      className="w-full rounded-xl border border-input bg-transparent py-2 text-base text-primary hover:text-primary"
      onClick={handleGithubLogin}
      disabled={isLoggingIn}
    >
      <GrGithub className="mr-4 h-5 w-5" />
      {isLoggingIn ? "Connecting..." : "Continue with Github"}
    </Button>
  );
};

export default ContinueWithGithub;