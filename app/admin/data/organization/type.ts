import { z } from 'zod'

export const ogrType = z.object({
  orgName: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long' }),
  orgDesc: z
    .string()
    .min(5, { message: 'Description must be at least 5 characters long' }),
})

export const updateOrgType = ogrType

export type OrganizationFormData = z.infer<typeof ogrType>

export interface Organization {
  id: number
  name: string
  description: string | null
  _count: {
    OrganizationMembers: number
  }
}
