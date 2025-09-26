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
  dueDate: z
    .string({ message: "Due Date required." })
    .nonempty({ message: "Due Date required." }),
  branchId: z.number({ message: "Branch required." }),
  warehouseId: z.number({ message: "Warehouse required." }),
  contactPerson: z.string().nonempty({ message: "Contact Person required." }),
  contactNumber: z.string().nonempty({ message: "Contact Number required." }),
  address: z.string().nonempty({ message: "Address required." }),
  designation: z.string().nonempty({ message: "Designation required." }),
  paleOfDelivery: z.string().nonempty({ message: "Place of Delivery required." }),
  poNo: z.string().nonempty({ message: "PO No required." }),
  poDate: z.string().nonempty({ message: "PO Date required." }),
  driverName: z.string().nonempty({ message: "Driver Name required." }),
  driverPhone: z.string().nonempty({ message: "Driver Phone required." }),
  transportationMode: z.string().nonempty({ message: "Transportation Mode required." }),
  vehicleNo: z.string().nonempty({ message: "Vehicle No required." }),
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
      remarks: z.string().optional(),
    }),
  ),
});
