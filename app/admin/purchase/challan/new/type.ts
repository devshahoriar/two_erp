import { z } from "zod";

export const newChallanSchema = z.object({
  challanNo: z
    .string({ message: "Challan No required." })
    .nonempty({ message: "Challan No required." }),
  orderId: z.union([
    z.string({ message: "Order No required." }).nonempty({ message: "Order No required." }),
    z.number({ message: "Order No required." })
  ]).optional(),
  challanDate: z
    .string({ message: "Challan Date required." })
    .nonempty({ message: "Challan Date required." }),
  challanDueDate: z
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
