import { z } from "zod";

export const salesReturnSchema = z.object({
  invoiceId: z.union([
    z.string({ message: "Invoice required." }).nonempty({ message: "Invoice required." }),
    z.number({ message: "Invoice required." })
  ]),
  salesReturnDate: z
    .string({ message: "Return Date required." })
    .nonempty({ message: "Return Date required." }),
  dueDate: z
    .string({ message: "Due Date required." })
    .nonempty({ message: "Due Date required." }),
  customerId: z.number({ message: "Customer required." }),
  branchId: z.number({ message: "Branch required." }),
  warehouseId: z.number({ message: "Warehouse required." }),
  remarks: z.string().optional(),
  address: z.string({ message: "Address required." }).nonempty({ message: "Address required." }),
  totalQuantity: z.number(),
  totalAmount: z.number(),
  products: z.array(
    z.object({
      productId: z.number(),
      productName: z.string(),
      batch: z.string().optional(),
      originalQuantity: z.number(),
      returnQuantity: z.union([
        z.string(),
        z.number()
      ]),
      rate: z.number(),
      amount: z.number().optional(),
      unit: z.string().optional(),
      groupId: z.number().optional(),
      groupName: z.string().optional(),
    }),
  ),
});
