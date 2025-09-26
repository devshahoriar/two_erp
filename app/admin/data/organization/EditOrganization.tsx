'use client'
import { LoadingButton } from '@/components/shared/CustomButton'
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
import { useState, useCallback, useEffect } from 'react'
import { ogrType } from './type'
import { toast } from 'sonner'
import { validateError } from '@/lib/utils'
import useMutate from '@/hooks/useMutate'
import { updateOrganization } from './action'
import { useRouter } from 'next/navigation'
import { Edit } from 'lucide-react'

interface EditOrganizationProps {
  organizationId: number
  initialData: {
    name: string
    description: string | null
  }
}

const EditOrganization = ({ organizationId, initialData }: EditOrganizationProps) => {
  const [input, setInput] = useState({
    orgName: '',
    orgDesc: '',
  })
  const [open, setOpen] = useState(false)
  const { loading, mutate } = useMutate()
  const { refresh } = useRouter()

  const loadOrganizationData = useCallback(() => {
    if (!open) return
    
    // Use the initial data passed as props
    setInput({
      orgName: initialData.name,
      orgDesc: initialData.description || '',
    })
  }, [open, initialData])

  useEffect(() => {
    loadOrganizationData()
  }, [loadOrganizationData])

  const handleUpdate = async () => {
    const d = ogrType.safeParse(input)
    if (!d.success) {
      return toast.error(validateError(d))
    }
    
    await mutate({
      data: d.data,
      sendData: (data) => updateOrganization(organizationId, data),
      next() {
        setOpen(false)
        refresh()
      },
    })
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      loadOrganizationData()
    } else {
      // Reset form when closing
      setInput({
        orgName: '',
        orgDesc: '',
      })
    }
  }

  return (
    <Credenza open={open} onOpenChange={handleOpenChange}>
      <CredenzaTrigger asChild>
        <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
          <Edit className="h-4 w-4" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Edit Organization</CredenzaTitle>
          <CredenzaDescription>Update organization information</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <InputWithLabel
            value={input.orgName}
            onChange={(e) => setInput({ ...input, orgName: e.target.value })}
            className="mt-0"
            title="Organization name"
            placeholder="Enter organization name"
          />
          <InputWithLabel
            onChange={(e) => setInput({ ...input, orgDesc: e.target.value })}
            value={input.orgDesc}
            title="Organization description"
            placeholder="Enter organization description"
          />
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant="outline">Cancel</Button>
          </CredenzaClose>
          <LoadingButton 
            disabled={loading} 
            onClick={handleUpdate}
          >
            Update
          </LoadingButton>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}

export default EditOrganization
