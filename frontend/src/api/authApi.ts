import { apiFetch } from "./client";
import type { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from "../types/auth";

export function login(req: LoginRequest) {
  return apiFetch<LoginResponse, LoginRequest>("/auth/login", {
    method: "POST",
    body: req,
  });
}

export function signup(req: SignupRequest) {
  return apiFetch<SignupResponse, SignupRequest>("/auth/signup", {
    method: "POST",
    body: req,
  });
}
