import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  AdminPageBody,
  AdminPageTopBar,
} from "@/components/shared/AdminPageElement";
import AdminPageFilter from "@/components/shared/AdminPageFilter";
import { RefreshButton } from "@/components/shared/CustomButton";
import React from "react";
import AddDamageProduct from "./AddDamageProduct";
import { getAllDamageProductByMontyhOrYear } from "./action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const DamageProduct = async (props: {
  searchParams?: Promise<{
    month?: string;
    year?: string;
  }>
}) => {
  const { month, year } = await props.searchParams || {};
  const currentMonth = month || (new Date().getMonth() + 1).toString();
  const currentYear = year || new Date().getFullYear().toString();
  
  const damagedProducts = await getAllDamageProductByMontyhOrYear(currentMonth, currentYear);

  return (
    <ContentLayout>
      <AdminPageTopBar length={damagedProducts.length} title="Damaged Products">
        <AdminPageFilter/>
        <RefreshButton />
        <AddDamageProduct/>
      </AdminPageTopBar>
      <AdminPageBody>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Product Code</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead className="w-[120px] text-right">Quantity</TableHead>
                <TableHead className="w-[100px] text-right">Rate</TableHead>
                <TableHead className="w-[120px] text-right">Total Value</TableHead>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead className="w-[150px]">Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {damagedProducts.length > 0 ? (
                damagedProducts.map((product) => (
                  <TableRow key={product.id} className="group hover:bg-muted/50">
                    <TableCell>{product.product.itemCode}</TableCell>
                    <TableCell className="font-medium text-primary">{product.product.name}</TableCell>
                    <TableCell>{product.warehouse.name}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">
                        {product.quantity} {product.product.unit?.name || "units"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">${product.rate.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${(product.quantity * product.rate).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(product.createdAt), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {product.remarks || "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No damaged products found for this period.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </AdminPageBody>
    </ContentLayout>
  );
};

export default DamageProduct;
