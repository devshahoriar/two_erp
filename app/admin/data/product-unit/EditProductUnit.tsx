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
import { productUnitType } from './type'
import { toast } from 'sonner'
import { validateError } from '@/lib/utils'
import useMutate from '@/hooks/useMutate'
import { updateProductUnit, getProductUnitById } from './action'
import { useRouter } from 'next/navigation'
import { Edit } from 'lucide-react'

interface EditProductUnitProps {
  productUnitId: number
}

const EditProductUnit = ({ productUnitId }: EditProductUnitProps) => {
  const [input, setInput] = useState({
    name: '',
    description: '',
  })
  const [open, setOpen] = useState(false)
  const [loadingProductUnit, setLoadingProductUnit] = useState(false)
  const { loading, mutate } = useMutate()
  const { refresh } = useRouter()

  const loadProductUnitData = useCallback(async () => {
    if (!open) return
    
    setLoadingProductUnit(true)
    try {
      const productUnitData = await getProductUnitById(productUnitId)
      if (productUnitData) {
        setInput({
          name: productUnitData.name,
          description: productUnitData.description || '',
        })
      } else {
        toast.error('Product unit not found')
        setOpen(false)
      }
    } catch {
      toast.error('Failed to load product unit data')
      setOpen(false)
    } finally {
      setLoadingProductUnit(false)
    }
  }, [open, productUnitId])

  useEffect(() => {
    loadProductUnitData()
  }, [loadProductUnitData])

  const handleUpdate = async () => {
    const d = productUnitType.safeParse(input)
    if (!d.success) {
      return toast.error(validateError(d))
    }
    
    await mutate({
      data: d.data,
      sendData: (data) => updateProductUnit(productUnitId, data),
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
        description: '',
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
          <CredenzaTitle>Edit Product Unit</CredenzaTitle>
          <CredenzaDescription>
            Update the product unit information below.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          {loadingProductUnit ? (
            <div className="flex justify-center py-4">
              <div className="text-sm text-muted-foreground">Loading product unit data...</div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <InputWithLabel
                  id="name"
                  placeholder="Enter product unit name"
                  value={input.name}
                  onChange={(e) => setInput({ ...input, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <InputWithLabel
                  id="description"
                  placeholder="Enter product unit description"
                  value={input.description}
                  onChange={(e) => setInput({ ...input, description: e.target.value })}
                />
              </div>
            </div>
          )}
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant="outline">Cancel</Button>
          </CredenzaClose>
          <LoadingButton
            onClick={handleUpdate}
            disabled={loading || loadingProductUnit}
          >
            Update Product Unit
          </LoadingButton>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}

export default EditProductUnit
