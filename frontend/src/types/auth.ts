export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type SignupRequest = {
  name: string;
  nickname: string;
  phone: string;
  email: string;
  password: string;
};

export type SignupResponse = void;
