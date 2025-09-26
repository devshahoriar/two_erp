import { z } from "zod";

export const openingBalanceItemSchema = z.object({
  productId: z.union([
    z.string().min(1, "Product is required"),
    z.number().int().positive("Product is required"),
  ]),
  quantity: z.number({
    message: "Quantity is required",
  }),
  rate: z.number().min(0, "Rate must be 0 or greater"),
  remarks: z.string().optional(),
});

export const openingBalance = z.object({
  opningBalanceId: z.string().min(1, "Opening balance ID is required"),
  createdAt: z.date(),
  remarks: z.string().optional(),
  product: z
    .array(openingBalanceItemSchema)
    .min(1, "At least one product is required"),
});

export type OpeningBalanceType = z.infer<typeof openingBalance>;
export type OpeningBalanceItemType = z.infer<typeof openingBalanceItemSchema>;
