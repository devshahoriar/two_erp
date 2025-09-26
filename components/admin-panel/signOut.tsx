'use client'
import { logoutUser } from '@/app/login/action'
import { cn } from '@/lib/utils'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LoadingButton } from '../shared/CustomButton'


const SignOutButton = ({
  className,
  isOpen = true,
}: {
  className?: string
  isOpen?: boolean
}) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const _hendelSignout = async () => {
    setLoading(true)
    localStorage.clear()
    await logoutUser()
    router.push('/login')
    setLoading(false)
  }
  return (
    <LoadingButton
      variant="link"
      className={cn(
        'w-full justify-start hover:no-underline hover:bg-black/5 dark:hover:bg-white/5',
        className
      )}
      onClick={_hendelSignout}
      disabled={loading}
    >
      <div className="flex items-center">
        <LogOut className="w-4 h-4 mr-5 text-muted-foreground" />
        {isOpen && <span className="text-sm font-normal ">Sign out</span>}
      </div>
    </LoadingButton>
  )
}

export default SignOutButton
