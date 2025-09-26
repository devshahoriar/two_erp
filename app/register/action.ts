/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { validateError } from '@/lib/utils'
import { db } from '@/prisma/db'
import { ACTION } from '@/types/actionType'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { registerType } from './type'

export const registerUse = async (
  data: z.infer<typeof registerType>
): Promise<ACTION> => {
  const res = registerType.safeParse(data)
  if (!res.success) {
    return {
      success: false,
      message: validateError(res),
    }
  }
  try {
    const hashPassword = await bcrypt.hash(data.password, 10)
    await db.adminUsers.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashPassword,
      },
      select: {
        id: true,
      },
    })
    return {
      success: true,
      message: 'Register success',
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.message ? error.message : 'Server error',
    }
  }
}
