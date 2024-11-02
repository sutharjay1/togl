export type User = {
  id: string;
  email: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = {
  user: User;
} & AuthTokens;

export type ApiError = {
  message: string;
  details?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};
