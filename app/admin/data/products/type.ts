import { z } from 'zod'

export const newProductType = z.object({
  itemCode: z.string().min(1, { message: 'Item code is required' }),
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  unitId: z.string().min(1, { message: 'Unit is required' }),
  groupId: z.string().min(1, { message: 'Group is required' }),
})
