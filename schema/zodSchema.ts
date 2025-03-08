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

export const EditQuestionSchema = z.object({
  value: z.string().min(1, 'Question is required'),
  options: z.array(z.string().min(1, 'Option is required')).length(4),
  CorrectIdx: z.number().min(1).max(4),
})


export const loginSchema = registerSchema.omit({ name: true });

export type loginFormType = z.infer<typeof loginSchema>;
export type registerFormType = z.infer<typeof registerSchema>;
export type EditQuestionFormType = z.infer<typeof EditQuestionSchema>;