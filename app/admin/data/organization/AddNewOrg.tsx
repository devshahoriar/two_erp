'use client'
import { Button } from '@/components/ui/button'
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from '@/components/ui/Credenza'
import { InputWithLabel } from '@/components/ui/input'
import { useState } from 'react'

import { AddButton, LoadingButton } from '@/components/shared/CustomButton'
import useMutate from '@/hooks/useMutate'
import { useRouter } from 'next/navigation'
import { ogrType } from './type'
import { toast } from 'sonner'
import { validateError } from '@/lib/utils'
import { createNewOrg } from './action'

const dfData = {
  orgName: '',
  orgDesc: '',
}

const AddNewOrg = () => {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState(dfData)
  const { refresh } = useRouter()
  const { loading, mutate } = useMutate()

  const _hendelAdd = async () => {
    const inputs = ogrType.safeParse(input)
    if (!inputs.success) {
      return toast.error(validateError(inputs))
    }
    mutate({
      data: inputs.data,
      sendData: createNewOrg,
      next() {
        setOpen(false)
        refresh()
      },
    })
  }
  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <AddButton>New Organization</AddButton>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add your new Organization</CredenzaTitle>
          <CredenzaDescription> </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <InputWithLabel
            value={input.orgName}
            onChange={(e) => setInput({ ...input, orgName: e.target.value })}
            className="mt-0"
            title="Organization name"
            placeholder="Enter Organization name"
          />
          <InputWithLabel
            onChange={(e) => setInput({ ...input, orgDesc: e.target.value })}
            value={input.orgDesc}
            title="Organization description"
            placeholder="Enter Organization description"
          />
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button>Close</Button>
          </CredenzaClose>
          <LoadingButton disabled={loading} onClick={_hendelAdd}>
            Add
          </LoadingButton>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}

export default AddNewOrg
