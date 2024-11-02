"use server";

import {
  ApiError,
  ApiResponse,
  AuthResponse,
  LoginCredentials,
} from "@/types/server";

const validateCredentials = (
  credentials: Partial<LoginCredentials>,
): credentials is LoginCredentials => {
  return Boolean(credentials.email && credentials.password);
};

export const login = async (
  credentials: Partial<LoginCredentials>,
): Promise<ApiResponse<AuthResponse>> => {
  if (!validateCredentials(credentials)) {
    return {
      success: false,
      error: "Email and password are required",
    };
  }

  try {
    const res = await fetch(`${process.env.SERVER_URL!}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
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
