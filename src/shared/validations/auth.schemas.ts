import { z } from "zod";

//re-usable field validators

const emailField = z
  .string()
  .min(1, "Email is required")
  .email("Enter a valid email address");

const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(32, "Password cannot exceed 32 characters");

const phoneField = z
  .string()
  .min(10, "Phone number must be at least 10 digits long")
  .max(15, "Phone number cannot exceed 15 digits")
  .regex(/^[0-9]+$/, "Phone number must contain only digits");

//b2b auth schemas

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required"),
});
export type LoginFormData = z.infer<typeof loginSchema>;
const optionalUrlField = z
  .string()
  .url("Enter a valid URL")
  .optional()
  .or(z.literal(""));

export const bankRegisterSchema = z.object({
  name: z.string().min(3, "Institution name must be at least 3 characters"),
  type: z.enum(["BANK", "NBFC", "HFC"], {
    required_error: "Institution type is required",
  }),
  email: emailField,
  contactPhone: phoneField,
  gstin: z.string().max(20, "GSTIN cannot exceed 20 characters").optional(),
  licenceNumber: z
    .string()
    .max(40, "Licence number cannot exceed 40 characters")
    .optional(),
  websiteUrl: optionalUrlField,
  password: passwordField,
});
export type BankRegisterFormData = z.infer<typeof bankRegisterSchema>;

export const dsaRegisterSchema = z.object({
  companyName: z.string().min(3, "Company name must be at least 3 characters"),
  companyCode: z
    .string()
    .min(2, "Company code must be at least 2 characters")
    .max(30, "Company code cannot exceed 30 characters")
    .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, _ or -"),
  gstin: z.string().max(20, "GSTIN cannot exceed 20 characters").optional(),
  email: emailField,
  password: passwordField,
});
export type DsaRegisterFormData = z.infer<typeof dsaRegisterSchema>;

export const agentRegisterSchema = z.object({
  companyCode: z.string().min(2, "Company code is required"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: phoneField,
  email: emailField,
  pan: z.string().max(20, "PAN cannot exceed 20 characters").optional(),
  bankAccountNumber: z
    .string()
    .max(30, "Account number cannot exceed 30 characters")
    .optional(),
  ifscCode: z
    .string()
    .max(20, "IFSC code cannot exceed 20 characters")
    .optional(),
  password: passwordField,
});
export type AgentRegisterFormData = z.infer<typeof agentRegisterSchema>;

export const forgotPasswordSchema = z.object({
  email: emailField,
});
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

//customer portal auth schemas

export const portalLoginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required"),
});
export type PortalLoginFormData = z.infer<typeof portalLoginSchema>;

export const portalRegisterSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    phone: phoneField,
    email: emailField,
    password: passwordField,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: "You must agree to the Terms of Service" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type PortalRegisterFormData = z.infer<typeof portalRegisterSchema>;

export const portalForgotPasswordSchema = z.object({
  email: emailField,
});
export type PortalForgotPasswordFormData = z.infer<
  typeof portalForgotPasswordSchema
>;

export const portalResetPasswordSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type PortalResetPasswordFormData = z.infer<
  typeof portalResetPasswordSchema
>;
