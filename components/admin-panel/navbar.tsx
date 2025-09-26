/* eslint-disable @typescript-eslint/no-explicit-any */
import { SheetMenu } from '@/components/admin-panel/sheet-menu'
import { UserNav } from '@/components/admin-panel/user-nav'
import { getUser } from '@/lib/serverUtils'
import { cookies } from 'next/headers'
import SelectOrg from '../shared/SelectOrg'
import { getActiveOrg } from '@/app/admin/data/organization/action'

interface NavbarProps {
  title?: string
}

export async function Navbar({ title }: NavbarProps) {
  const user: any = await getUser(cookies)
  const activeOrg = await getActiveOrg()
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary print:hidden">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          {title && <h1 className="font-bold">{title}</h1>}
        </div>
        <div className="flex flex-1 items-center justify-end">
          <SelectOrg activeOrg={activeOrg}/>
          <UserNav name={user?.name} email={user?.email} />
        </div>
      </div>
    </header>
  )
}
