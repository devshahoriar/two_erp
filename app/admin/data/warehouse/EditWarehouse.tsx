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
import { Label } from '@/components/ui/label'
import { useState, useEffect, useCallback } from 'react'
import { newBranceType } from './type'
import { toast } from 'sonner'
import { validateError } from '@/lib/utils'
import useMutate from '@/hooks/useMutate'
import { updateWarehouse, getWarehouseById } from './action'
import { useRouter } from 'next/navigation'
import { Edit } from 'lucide-react'
import { BranchSelect } from '../branch/ExportComponent'

interface EditWarehouseProps {
  warehouseId: number
}

const EditWarehouse = ({ warehouseId }: EditWarehouseProps) => {
  const [input, setInput] = useState({
    name: '',
    location: '',
    branchId: '',
  })
  const [open, setOpen] = useState(false)
  const [loadingWarehouse, setLoadingWarehouse] = useState(false)
  const { loading, mutate } = useMutate()
  const { refresh } = useRouter()

  const loadWarehouseData = useCallback(async () => {
    if (!open) return
    
    setLoadingWarehouse(true)
    try {
      const warehouseData = await getWarehouseById(warehouseId)
      if (warehouseData) {
        setInput({
          name: warehouseData.name,
          location: warehouseData.location,
          branchId: warehouseData.branchId.toString(),
        })
      } else {
        toast.error('Warehouse not found')
        setOpen(false)
      }
    } catch {
      toast.error('Failed to load warehouse data')
      setOpen(false)
    } finally {
      setLoadingWarehouse(false)
    }
  }, [open, warehouseId])

  useEffect(() => {
    loadWarehouseData()
  }, [loadWarehouseData])

  const handleUpdate = async () => {
    const d = newBranceType.safeParse(input)
    if (!d.success) {
      return toast.error(validateError(d))
    }
    
    await mutate({
      data: d.data,
      sendData: (data) => updateWarehouse(warehouseId, data),
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
        branchId: '',
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
          <CredenzaTitle>Edit Warehouse</CredenzaTitle>
          <CredenzaDescription>Update warehouse information</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          {loadingWarehouse ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Loading warehouse data...</div>
            </div>
          ) : (
            <>
              <InputWithLabel
                value={input.name}
                onChange={(e) => setInput({ ...input, name: e.target.value })}
                className="mt-0"
                title="Warehouse name"
                placeholder="Enter Warehouse name"
              />
              <InputWithLabel
                onChange={(e) => setInput({ ...input, location: e.target.value })}
                value={input.location}
                title="Warehouse location"
                placeholder="Enter Warehouse location"
              />
              <div className={"mt-3 flex flex-col gap-2"}>
                <Label>Branch</Label>
                <BranchSelect
                  width="100%"
                  value={input.branchId}
                  setValue={(v: string | number) => {
                    setInput({
                      ...input,
                      branchId: v+'',
                    });
                  }}
                />
              </div>
            </>
          )}
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant="outline">Cancel</Button>
          </CredenzaClose>
          <LoadingButton 
            disabled={loading || loadingWarehouse} 
            onClick={handleUpdate}
          >
            Update
          </LoadingButton>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}

export default EditWarehouse
