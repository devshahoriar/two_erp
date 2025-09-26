import { z } from 'zod'

export const addBranceType = z.object({
  name: z
    .string()
    .min(3, { message: 'Branch name must be at least 3 characters' }),
    location: z.string().min(3, {
    message: 'Branch location must be at least 3 characters',
  }),
})

export const updateBranchType = addBranceType

export type BranchFormData = z.infer<typeof addBranceType>

export interface Branch {
  id: number
  name: string
  location: string
  createdAt: Date
  _count: {
    WareHouse: number
  }
}
