import { z } from "zod";

export const newOrderSchema = z.object({
  orderNo: z
    .string({ message: "Order No required." })
    .nonempty({ message: "Order No required." }),
  description: z.string().optional(),
  reqId: z.union([
    z.string({ message: "Req No required." }).nonempty({ message: "Req No required." }),
    z.number({ message: "Req No required." })
  ]),
  orderDate: z
    .string({ message: "Order Date required." })
    .nonempty({ message: "Order Date required." }),
  dueDate: z
    .string({ message: "Due Date required." })
    .nonempty({ message: "Due Date required." }),
  supplierId: z.number({ message: "Supplier required." }),
  branchId: z.number({ message: "Branch required." }),
  warehouseId: z.number({ message: "Warehouse required." }),
  shippingAddress: z.string().nonempty({ message: "Shipping Address required." }),
  remarks: z.string().optional(),
  products: z.array(
    z.object({
      item: z.union([
        z.string({ message: "Item required." }).nonempty({ message: "Item required." }),
        z.number({ message: "Item required." })
      ]),
      quantity: z.union([
        z.string({ message: "Quantity required." }).nonempty({ message: "Quantity required." }),
        z.number({ message: "Quantity required." })
      ]),
      rate: z.union([
        z.string({ message: "Rate required." })
          .nonempty({ message: "Rate required." })
          .refine((val) => val !== "0" && parseFloat(val) > 0, { message: "Rate cannot be 0" }),
        z.number({ message: "Rate required." })
          .refine((val) => val > 0, { message: "Rate cannot be 0" })
      ]),
      amount: z.number({ message: "Amount required." }),
      batchNo: z.string().optional(),
      remark: z.string().optional(),
    }),
  ),
});
