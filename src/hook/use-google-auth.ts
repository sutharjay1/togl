import {
  checkGoogleAuthStatus,
  handleGoogleCallback,
  initiateGoogleAuth,
} from "@/app/(auth)/_actions/google";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useGoogleAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: authData, isLoading: isCheckingAuth } = useQuery({
    queryKey: ["auth-status"],
    queryFn: async () => {
      const response = await checkGoogleAuthStatus();
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
    retry: false,
  });

  const { mutate: login, isLoading: isLoggingIn } = useMutation({
    mutationFn: async () => {
      await initiateGoogleAuth();
    },
    onError: (error) => {
      toast.error("Failed to initiate Google login");
      console.error("Google login error:", error);
    },
  });

  const { mutate: handleCallback, isLoading: isHandlingCallback } = useMutation(
    {
      mutationFn: async (code: string) => {
        const response = await handleGoogleCallback(code);
        if (!response.success) {
          throw new Error(response.error);
        }
        return response.data;
      },
      onSuccess: (data) => {
        queryClient.setQueryData(["auth-status"], {
          isAuthenticated: true,
          user: data?.user,
        });
        router.push("/dashboard");
        toast.success("Successfully logged in!");
      },
      onError: (error) => {
        toast.error("Failed to complete Google login");
        console.error("Google callback error:", error);
        router.push("/login");
      },
    },
  );

  return {
    authData,
    isCheckingAuth,
    isLoggingIn,
    isHandlingCallback,
    login,
    handleCallback,
    isAuthenticated: authData?.isAuthenticated ?? false,
    user: authData?.user,
  };
};
