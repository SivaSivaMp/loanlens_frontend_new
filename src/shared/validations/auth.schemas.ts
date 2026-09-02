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
export const bankRegisterSchema = z.object({
  bankName: z.string().min(3, "Institution name must be at least 3 characters"),
  department: z.string().min(1, "Department is required"),
  workEmail: emailField,
  employeeId: z
    .string()
    .min(3, "Employee ID is required")
    .regex(/^[A-Za-z0-9\-]+$/, "Employee ID must be alphanumeric"),
  password: passwordField,
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the Terms of Service" }),
  }),
});
export type BankRegisterFormData = z.infer<typeof bankRegisterSchema>;

export const dsaRegisterSchema = z.object({
  companyName: z.string().min(3, "Company name must be at least 3 characters"),
  gstPan: z
    .string()
    .min(10, "Enter a valid GSTIN or PAN")
    .max(20, "Enter a valid GSTIN or PAN"),
  workEmail: emailField,
  phone: phoneField,
  city: z.string().min(1, "City is required"),
  password: passwordField,
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the DSA Partner Terms" }),
  }),
});
export type DsaRegisterFormData = z.infer<typeof dsaRegisterSchema>;

export const agentRegisterSchema = z.object({
  dsaCompany: z.string().min(1, "Please select a DSA company"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  agentId: z
    .string()
    .min(3, "Agent ID is required")
    .regex(/^[A-Za-z0-9\-]+$/, "Agent ID must be alphanumeric"),
  mobile: phoneField,
  email: emailField,
  password: passwordField,
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the Agent Conduct Policy" }),
  }),
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
