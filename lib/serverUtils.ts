/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { cookies } from 'next/headers'
import { cache } from 'react'
import { verify } from './jwt'

export const getUser = cache(async (c: typeof cookies) => {
  const cookie = await c()
  const t: any = cookie.get('token')

  if (!t && !t?.value) {
    return false
  }

  try {
    const d = verify(t?.value)
    if (!d) {
      return false
    }
    return d
  } catch (error: any) {
    console.log('user token verify error ->', error)
    return false
  }
})
