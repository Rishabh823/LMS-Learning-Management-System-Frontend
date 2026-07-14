import { z } from "zod";

export const userAccountSchema = z
  .object({
    fullName: z.string().min(1, "Please enter your full name."),
    email: z
      .string()
      .min(1, "Please enter your email address.")
      .email("Please enter a valid email address."),
    phone: z
      .string()
      .min(1, "Please enter your phone number.")
      .length(10, "Please enter a valid 10-digit phone number."),
    gender: z.string().min(1, "Please select your gender."),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const orgSelectSchema = z.object({
  orgId: z.string().min(1, "Please select an organization to continue."),
});

export type UserAccountSchema = z.infer<typeof userAccountSchema>;
