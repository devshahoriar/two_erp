import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  AdminPageBody,
  AdminPageTopBar,
} from "@/components/shared/AdminPageElement";
import { RefreshButton } from "@/components/shared/CustomButton";
import { db } from "@/prisma/db";
import { getActiveOrg } from "../../data/organization/action";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const StockProductPage = async () => {
  const org = await getActiveOrg();
  const allProduct = await db.stockProduct.findMany({
    where: {
      orgId: Number(org.orgId),
    },
    select: {
      id: true,
      quantity: true,
      rate: true,
      product: {
        select: {
          id: true,
          name: true,
          unit: {
            select: {
              id: true,
              name: true,
            },
          },
          group: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return (
    <ContentLayout>
      <AdminPageTopBar length={allProduct?.length} title="Stock Products">
        <RefreshButton />
      </AdminPageTopBar>
      <AdminPageBody>
        <div className="w-full">
          <Table className="border rounded-md">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-medium">#</TableHead>
                <TableHead className="font-medium">Product Name</TableHead>
                <TableHead className="font-medium">Group</TableHead>
                <TableHead className="font-medium">Unit</TableHead>
                <TableHead className="font-medium">Quantity</TableHead>
                <TableHead className="font-medium">Rate</TableHead>
                <TableHead className="font-medium">Total Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allProduct.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No stock items found
                  </TableCell>
                </TableRow>
              ) : (
                allProduct.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell>{item.product.group.name}</TableCell>
                    <TableCell>{item.product.unit.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.rate.toFixed(2)}</TableCell>
                    <TableCell>${(item.quantity * item.rate).toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </AdminPageBody>
    </ContentLayout>
  );
};

export default StockProductPage;
