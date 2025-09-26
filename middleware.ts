import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getUser } from './lib/serverUtils'

const middleware = async (request: NextRequest) => {
  const response = NextResponse.next()
  if (request.nextUrl.pathname.includes('/admin')) {
    const user = await getUser(cookies)
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.nextUrl))
    }
  }

  return response
}

export default middleware
