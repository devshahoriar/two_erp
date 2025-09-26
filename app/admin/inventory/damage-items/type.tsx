import { z } from "zod";

export const DamageItemSchema = z.object({
  groupId: z.string().min(1, "Group ID is required"),
  productId: z.string().min(1, "Product ID is required"),
  quentity: z.number().min(1, "Quantity is required"),
  rate: z.number().min(1, "Rate is required"),
  warehouseId: z.string().min(1, "Warehouse ID is required"),
  remark: z.string({
    message: "Remark is required",
  }),
});
