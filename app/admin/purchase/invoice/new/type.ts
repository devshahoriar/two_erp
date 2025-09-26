import { z } from "zod";

export const newInvoiceSchema = z.object({
  invoiceNo: z
    .string({ message: "Invoice No required." })
    .nonempty({ message: "Invoice No required." }),
  challanId: z.union([
    z.string({ message: "Challan required." }).nonempty({ message: "Challan required." }),
    z.number({ message: "Challan required." })
  ]).optional(),
  invoiceDate: z
    .string({ message: "Invoice Date required." })
    .nonempty({ message: "Invoice Date required." }),
  supplierId: z.number({ message: "Supplier required." }),
  branchId: z.number({ message: "Branch required." }),
  warehouseId: z.number({ message: "Warehouse required." }),
  address: z.string().nonempty({ message: "Address required." }),
  remarks: z.string().optional(),
  products: z.array(
    z.object({
      item: z.union([
        z.string({ message: "Item required." }).nonempty({ message: "Item required." }),
        z.number({ message: "Item required." })
      ]),
      qeuntity: z.union([
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
      discount: z.union([
        z.string().default("0"),
        z.number().default(0)
      ]),
      amount: z.number({ message: "Amount required." }),
      batch: z.string().optional(),
      remarks: z.string().optional(),
    }),
  ),
});
