export interface RegisterUserDto {
  email: string;
  password: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
}
