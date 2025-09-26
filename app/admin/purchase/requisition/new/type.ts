import { z } from "zod";

export const newReqesition = z.object({
  no: z.string({ message: "Req No required." }).nonempty({ message: "Req No required." }),
  description: z.string(),
  reqDate: z
    .string({
      message: "Req Date required.",
    })
    .date(),
  products: z.array(
    z.object({
      item: z.string({ message: "Product required." }).nonempty({ message: "Product required." }),
      quantity: z.string({ message: "Quantity required." }).nonempty({ message: "Quantity required." }),
      remark: z.string(),
    }),
  ),
});
