import { ContentLayout } from '@/components/admin-panel/content-layout'
import {
  AdminPageBody,
  AdminPageTopBar,
} from '@/components/shared/AdminPageElement'

import { RefreshButton } from '@/components/shared/CustomButton'
import AddNewProduct from './AddProduct'
import { getAllProducts } from './action'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const ProductPage = async () => {
  const products = await getAllProducts()

  return (
    <ContentLayout>
      <AdminPageTopBar title="Total products" length={products.length}>
        <RefreshButton />
        <AddNewProduct />
      </AdminPageTopBar>
      <AdminPageBody>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Item Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product, i) => (
                  <TableRow key={product.id}>
                    <TableCell>{i+1}</TableCell>
                    <TableCell>{product.itemCode}</TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.description || '-'}</TableCell>
                    <TableCell>{product.unit.name}</TableCell>
                    <TableCell>{product.group.name}</TableCell>
                    <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
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

export default ProductPage
