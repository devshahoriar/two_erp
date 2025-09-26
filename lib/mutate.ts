import { ACTION } from '@/types/actionType'
import { toast } from 'sonner'

/* eslint-disable @typescript-eslint/no-explicit-any */
type Mutate = {
  data: any
  sendData: (data: any) => Promise<ACTION>
  next?: () => void
}

const mutate = async ({ data, sendData, next }: Mutate) => {
  toast.info('Please wait...')
  const res = await sendData(data)

  if (res.success) {
    toast.success(res.message)
    if (next) {
      next()
    }
    return
  } else {
    toast.error(res.message)
  }
}

export default mutate
