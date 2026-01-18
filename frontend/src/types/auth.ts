export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string; // httpOnly 쿠키로 내려주면 제거 가능
  // 필요하면 추가: userId, nickname 등
};

export type SignupRequest = {
  name: string;
  email: string;
  nickname: string;
  phone: string;
  password: string;
};

export type SignupResponse = {
  message?: string;
};
