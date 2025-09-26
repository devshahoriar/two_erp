import { ContentLayout } from '@/components/admin-panel/content-layout'
import { AdminPageBody, AdminPageTopBar } from '@/components/shared/AdminPageElement'
import { RefreshButton } from '@/components/shared/CustomButton'
import React from 'react'
import AddNewProductGroup from './AddNewProductGroup'
import { getAllProductGroups } from './action'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const ProductGroupPage = async () => {
  const listGroups = await getAllProductGroups()
  
  return (
    <ContentLayout>
      <AdminPageTopBar length={listGroups.length} title="Product Groups">
        <RefreshButton />
        <AddNewProductGroup />
      </AdminPageTopBar>
      <AdminPageBody>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listGroups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No product groups found
                  </TableCell>
                </TableRow>
              ) : (
                listGroups.map((group, i) => (
                  <TableRow key={group.id}>
                    <TableCell>{i+1}</TableCell>
                    <TableCell className="font-medium">{group.name}</TableCell>
                    <TableCell>{group.code}</TableCell>
                    <TableCell>{new Date(group.createdAt).toLocaleDateString()}</TableCell>
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

export default ProductGroupPage
