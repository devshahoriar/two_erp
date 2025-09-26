import { z } from 'zod'

export const loginType = z.object({
  email: z.string().email({
    message: 'Invalid email address format',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters',
  }),
})
