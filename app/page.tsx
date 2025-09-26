import { Button } from '@/components/ui/button'
import { getUser } from '@/lib/serverUtils'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
  const u = await getUser(cookies)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div className="mx-auto w-52 aspect-square overflow-hidden bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mb-6 transition-colors duration-300">
          <Image src="/logo.png" alt="GCo Logo" width={100} height={100} />
        </div>

        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">
          Welcome to GCO ERP System
        </h1>

        <div className="pt-6">
          <Link href={u ? '/admin' : '/login'} passHref>
            <Button size="lg" className="text-lg px-8 py-6">
              {u ? 'Go' : 'Login'} to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
