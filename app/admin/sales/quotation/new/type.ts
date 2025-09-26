import { z } from "zod";

export const newQuotation = z.object({
  supplierId: z.string({ message: "Supplier required." }).nonempty({ message: "Supplier required." }),
  branchId: z.string({ message: "Branch required." }).nonempty({ message: "Branch required." }),
  quotationDate: z.string({ message: "Quotation Date required." }).date(),
  dueDate: z.string({ message: "Due Date required." }).date(),
  delivery: z.string({ message: "Delivery required." }).nonempty({ message: "Delivery required." }),
  support_warranty: z.string({ message: "Support/Warranty required." }).nonempty({ message: "Support/Warranty required." }),
  validity_of_quotation: z.string({ message: "Validity required." }).nonempty({ message: "Validity required." }),
  payment: z.string({ message: "Payment required." }).nonempty({ message: "Payment required." }),
  others: z.string().optional(),
  suppingAddress: z.string({ message: "Shipping Address required." }).nonempty({ message: "Shipping Address required." }),
  remarks: z.string().optional(),
  products: z.array(
    z.object({
      item: z.string({ message: "Product required." }).nonempty({ message: "Product required." }),
      quantity: z.string({ message: "Quantity required." }).nonempty({ message: "Quantity required." }),
      remarks: z.string().optional(),
    }),
  ),
});
