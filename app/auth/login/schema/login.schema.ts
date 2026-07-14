import { z } from "zod";

export const loginSchema = z.object({
  emailId: z
    .string()
    .min(1, "Please enter your email address.")
    .email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
});

export type LoginSchema = z.infer<typeof loginSchema>;
