"use server";
interface GUser extends User {
  googleId: string;
  name: string;
}

import { ApiError, ApiResponse, AuthResponse, User } from "@/types/server";

import { redirect } from "next/navigation";

export const initiateGoogleAuth = async (): Promise<never> => {
  redirect(`${process.env.SERVER_URL!}/auth/google`);
};

export const handleGoogleCallback = async (
  code: string,
): Promise<ApiResponse<AuthResponse>> => {
  try {
    const res = await fetch(`${process.env.SERVER_URL!}/auth/google/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    const data: AuthResponse | ApiError = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error:
          "message" in data ? data.message : "An unexpected error occurred",
      };
    }

    if ("user" in data && "accessToken" in data && "refreshToken" in data) {
      return {
        success: true,
        data: data,
      };
    }

    return {
      success: false,
      error: "Invalid response format from server",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

export const checkGoogleAuthStatus = async (): Promise<
  ApiResponse<{ isAuthenticated: boolean; user?: GUser }>
> => {
  try {
    const res = await fetch(`${process.env.SERVER_URL!}/profile`, {
      credentials: "include",
    });

    if (!res.ok) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const data = await res.json();

    return {
      success: true,
      data: {
        isAuthenticated: true,
        user: data.user,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};
