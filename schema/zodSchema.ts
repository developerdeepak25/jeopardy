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

export const EditQuestionSchema = z.object({
  value: z.string().min(1, "Question is required"),
  options: z.array(z.string().min(1, "Option is required")).length(4),
  CorrectIdx: z.number().min(1).max(4),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  captchaToken: z
    .string({
      required_error: "Please complete the CAPTCHA verification",
    }) // IDK but only this works  else give only 'requied in error
    .min(1, "Please complete the CAPTCHA verification"),
});

export type loginFormType = z.infer<typeof loginSchema>;
export type registerFormType = z.infer<typeof registerSchema>;
export type EditQuestionFormType = z.infer<typeof EditQuestionSchema>;
export type contactFormType = z.infer<typeof contactSchema>;
