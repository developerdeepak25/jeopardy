import { z } from "zod";
const PASS_LENGTH = 8;

// Input validation schema
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(PASS_LENGTH, `Password must be at least ${PASS_LENGTH} characters`),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const loginSchema = registerSchema.omit({ name: true });

export type loginFormType = z.infer<typeof loginSchema>;
export type registerFormType = z.infer<typeof registerSchema>;