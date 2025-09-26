/* eslint-disable @typescript-eslint/no-explicit-any */
import * as jose from 'jose'

const secret = new TextEncoder().encode(process.env.SECRET!)
const alg = 'HS256'

export const sign = async (payload: any) => {
  const jwt = await new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(secret)
  return jwt
}

export type USER_JWT = {
  id: number
  email: string
  name: string
  iat: number
  exp: number
}
export const verify = async (token: string): Promise<boolean | USER_JWT> => {
  try {
    const { payload } = await jose.jwtVerify(token, secret)

    return payload as USER_JWT
  } catch (error: any) {
    console.log('jwt verify error ->', error)
    return false
  }
}
