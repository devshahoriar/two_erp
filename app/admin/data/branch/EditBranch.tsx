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
import { useState, useEffect, useCallback } from 'react'
import { addBranceType } from './type'
import { toast } from 'sonner'
import { validateError } from '@/lib/utils'
import useMutate from '@/hooks/useMutate'
import { updateBranch, getBranchById } from './action'
import { useRouter } from 'next/navigation'
import { Edit } from 'lucide-react'

interface EditBranchProps {
  branchId: number
}

const EditBranch = ({ branchId }: EditBranchProps) => {
  const [input, setInput] = useState({
    name: '',
    location: '',
  })
  const [open, setOpen] = useState(false)
  const [loadingBranch, setLoadingBranch] = useState(false)
  const { loading, mutate } = useMutate()
  const { refresh } = useRouter()

  const loadBranchData = useCallback(async () => {
    if (!open) return
    
    setLoadingBranch(true)
    try {
      const branchData = await getBranchById(branchId)
      if (branchData) {
        setInput({
          name: branchData.name,
          location: branchData.location,
        })
      } else {
        toast.error('Branch not found')
        setOpen(false)
      }
    } catch {
      toast.error('Failed to load branch data')
      setOpen(false)
    } finally {
      setLoadingBranch(false)
    }
  }, [open, branchId])

  useEffect(() => {
    loadBranchData()
  }, [loadBranchData])

  const handleUpdate = async () => {
    const d = addBranceType.safeParse(input)
    if (!d.success) {
      return toast.error(validateError(d))
    }
    
    await mutate({
      data: d.data,
      sendData: (data) => updateBranch(branchId, data),
      next() {
        setOpen(false)
        refresh()
      },
    })
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      // Reset form when closing
      setInput({
        name: '',
        location: '',
      })
    }
  }

  return (
    <Credenza open={open} onOpenChange={handleOpenChange}>
      <CredenzaTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Edit Branch</CredenzaTitle>
          <CredenzaDescription>Update branch information</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          {loadingBranch ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Loading branch data...</div>
            </div>
          ) : (
            <>
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
                title="Branch location"
                placeholder="Enter Branch location"
              />
            </>
          )}
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant="outline">Cancel</Button>
          </CredenzaClose>
          <LoadingButton 
            disabled={loading || loadingBranch} 
            onClick={handleUpdate}
          >
            Update
          </LoadingButton>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}

export default EditBranch
