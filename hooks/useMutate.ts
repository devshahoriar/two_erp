/* eslint-disable @typescript-eslint/no-explicit-any */
import { ACTION } from '@/types/actionType'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

type Mutate = {
  data: any
  sendData: (data: any) => Promise<ACTION>
  next?: () => void
}

const useMutate = () => {
  const [loading, setLoading] = useState(false)
  const { refresh } = useRouter()
  const mutate = async ({ data, sendData, next }: Mutate) => {
    setLoading(true)
    toast.info('Please wait...')
    const res = await sendData(data)
    if (res.success) {
      toast.success(res.message)
      refresh()
      if (next) {
        next()
      }
    } else {
      toast.error(res.message)
    }
    setLoading(false)
  }
  return { mutate, loading }
}

export default useMutate
