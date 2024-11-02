"use client";

import { useGoogleAuth } from "@/hook/use-google-auth";
import { GrGoogle } from "react-icons/gr";
import { Button } from "../ui/button";

const ContinueWithGoogle = () => {
  const { login, isLoggingIn } = useGoogleAuth();

  const handleGoogleLogin = () => {
    login();
    console.log("isLoggingIn", isLoggingIn);
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
