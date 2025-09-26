import { ContentLayout } from '@/components/admin-panel/content-layout'
import { AdminPageBody, AdminPageTopBar } from '@/components/shared/AdminPageElement'
import { RefreshButton } from '@/components/shared/CustomButton'
import React from 'react'
import AddNewProductUnit from './AddProductUnit'
import EditProductUnit from './EditProductUnit'
import { getAllProductUnit } from './action'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const ProductUnitPage =async () => {
  const listUnit = await getAllProductUnit()
  return (
    <ContentLayout>
      <AdminPageTopBar length={listUnit.length} title="Product unit">
        <RefreshButton />
        <AddNewProductUnit />
      </AdminPageTopBar>
      <AdminPageBody>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listUnit.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No product units found
                  </TableCell>
                </TableRow>
              ) : (
                listUnit.map((unit,i) => (
                  <TableRow key={unit.id}>
                    <TableCell>{i+1}</TableCell>
                    <TableCell className="font-medium">{unit.name}</TableCell>
                    <TableCell>{unit.description || '-'}</TableCell>
                    <TableCell>{new Date(unit.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <EditProductUnit productUnitId={unit.id} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </AdminPageBody>
    </ContentLayout>
  )
}

export default ProductUnitPage
