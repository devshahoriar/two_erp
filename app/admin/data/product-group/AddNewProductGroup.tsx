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

import { toast } from 'sonner'
import { validateError } from '@/lib/utils'
import { productGroupType } from './type'
import { addNewProductGroup } from './action'

const dfData = {
  name: '',
  code: '',
}

const AddNewProductGroup = () => {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState(dfData)
  const { refresh } = useRouter()
  const { loading, mutate } = useMutate()

  const _handleAdd = async () => {
    const inputs = productGroupType.safeParse(input)
    if (!inputs.success) {
      return toast.error(validateError(inputs))
    }
    mutate({
      data: inputs.data,
      sendData: addNewProductGroup,
      next() {
        setOpen(false)
        setInput(dfData)
        refresh()
      },
    })
  }
  
  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <AddButton>New product group</AddButton>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add your new product group</CredenzaTitle>
          <CredenzaDescription>Add a new product classification group</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <InputWithLabel
            value={input.name}
            onChange={(e) => setInput({ ...input, name: e.target.value })}
            className="mt-0"
            title="Product Group Name"
            placeholder="Enter product group name"
          />
          <InputWithLabel
            onChange={(e) => setInput({ ...input, code: e.target.value })}
            value={input.code}
            title="Product Group Code"
            placeholder="Enter product group code"
          />
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button>Close</Button>
          </CredenzaClose>
          <LoadingButton disabled={loading} onClick={_handleAdd}>
            Add
          </LoadingButton>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}

export default AddNewProductGroup
