import { z } from "zod";

export const newSalesOrderSchema = z.object({
  orderNo: z
    .string({ message: "Order No required." })
    .nonempty({ message: "Order No required." }),
  quotationId: z.union([
    z.string({ message: "Quotation required." }).nonempty({ message: "Quotation required." }),
    z.number({ message: "Quotation required." })
  ]).optional(),
  orderDate: z
    .string({ message: "Order Date required." })
    .nonempty({ message: "Order Date required." }),
  deliveryDate: z
    .string({ message: "Delivery Date required." })
    .nonempty({ message: "Delivery Date required." }),
  customerId: z.number({ message: "Customer required." }),
  branchId: z.number({ message: "Branch required." }),
  warehouseId: z.number({ message: "Warehouse required." }),
  address: z.string().nonempty({ message: "Address required." }),
  contactPerson: z.string().nonempty({ message: "Contact Person required." }),
  contactNumber: z.string().nonempty({ message: "Contact Number required." }),
  placeOfDelivery: z.string().nonempty({ message: "Place of Delivery required." }),
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
      unit: z.string().optional(),
      remark: z.string().optional(),
    })
  ),
});
