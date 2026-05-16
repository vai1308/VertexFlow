import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  password: z.string().min(8).max(100)
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1)
});

export const googleLoginSchema = z.object({
  credential: z.string().min(1)
});

export const verifyEmailSchema = z.object({
  token: z.string().min(20)
});

export const supportSchema = z.object({
  subject: z.string().trim().min(5).max(120),
  message: z.string().trim().min(10).max(2000)
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email()
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20),
  password: z.string().min(8).max(100)
});
