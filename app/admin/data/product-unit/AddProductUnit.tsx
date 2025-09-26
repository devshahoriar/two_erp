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
import { productUnitType } from './type'
import { addNewProductUnit } from './action'

const dfData = {
  name: '',
  description: '',
}

const AddNewProductUnit = () => {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState(dfData)
  const { refresh } = useRouter()
  const { loading, mutate } = useMutate()

  const _hendelAdd = async () => {
    const inputs = productUnitType.safeParse(input)
    if (!inputs.success) {
      return toast.error(validateError(inputs))
    }
    mutate({
      data: inputs.data,
      sendData: addNewProductUnit,
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
        <AddButton>New product unit</AddButton>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add your new product unit</CredenzaTitle>
          <CredenzaDescription> </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <InputWithLabel
            value={input.name}
            onChange={(e) => setInput({ ...input, name: e.target.value })}
            className="mt-0"
            title="Product unit"
            placeholder="Enter Product unit"
          />
          <InputWithLabel
            onChange={(e) =>
              setInput({ ...input, description: e.target.value })
            }
            value={input.description}
            title="Product unit description"
            placeholder="Enter Product unit description"
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

export default AddNewProductUnit
