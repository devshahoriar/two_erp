import { z } from 'zod'

export const newBranceType = z.object({
  name: z
    .string()
    .min(3, {
      message: 'Name is 3 characters long',
    })
    .max(255),
  location: z
    .string()
    .min(3, {
      message: 'Location is 3 characters long',
    })
    .max(255),
  branchId: z
    .string()
    .min(1, {
      message: 'Branch is 3 characters long',
    })
    .max(255),
})
