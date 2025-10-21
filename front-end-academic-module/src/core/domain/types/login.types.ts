export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  employee: {
    id: string;
    email: string;
  };
}

export interface LoginDto {
  email: string;
  password: string;
}