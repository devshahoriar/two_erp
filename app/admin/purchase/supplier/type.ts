import { z } from "zod";

export const newSupllayerType = z.object({
  code: z
    .string()
    .min(3, { message: "Code must be at least 3 characters long" }),
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters long" }),
  address: z
    .string()
    .min(3, { message: "Address must be at least 3 characters long" }),
  note: z
    .string()
    .min(3, { message: "Note must be at least 3 characters long" })
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),
});
