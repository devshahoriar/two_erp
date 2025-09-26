'use client'
import { AddButton, LoadingButton } from '@/components/shared/CustomButton'
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
import { addBranceType } from './type'
import { toast } from 'sonner'
import { validateError } from '@/lib/utils'
import useMutate from '@/hooks/useMutate'
import { createBranch } from './action'
import { useRouter } from 'next/navigation'

const dfData = {
  name: '',
  location: '',
}

const AddNewBranceh = () => {
  const [input, setInput] = useState(dfData)
  const [open, setOpen] = useState(false)
  const { loading, mutate } = useMutate()
  const { refresh } = useRouter()

  const _hendelAdd = async () => {
    const d = addBranceType.safeParse(input)
    if (!d.success) {
      return toast.error(validateError(d))
    }
    await mutate({
      data: d.data,
      sendData: createBranch,
      next() {
        setInput(dfData)
        setOpen(false)
        refresh()
      },
    })
  }
  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <AddButton>Add Branch</AddButton>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add Branch</CredenzaTitle>
          <CredenzaDescription> </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <InputWithLabel
            value={input.name}
            onChange={(e) => setInput({ ...input, name: e.target.value })}
            className="mt-0"
            title="Branch name"
            placeholder="Enter Branch name"
          />
          <InputWithLabel
            onChange={(e) => setInput({ ...input, location: e.target.value })}
            value={input.location}
            title="Branch description"
            placeholder="Enter Branch description"
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

export default AddNewBranceh
