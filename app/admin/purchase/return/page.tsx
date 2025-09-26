import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  AdminPageBody,
  AdminPageTopBar,
} from "@/components/shared/AdminPageElement";
import AdminPageFilter from "@/components/shared/AdminPageFilter";
import { AddButton, RefreshButton } from "@/components/shared/CustomButton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import Link from "next/link";
import { getAllReturnsByDate } from "./action";

const PurchaseReturnPage = async (props: {
  searchParams?: Promise<{
    month?: string;
    year?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const month = searchParams?.month || new Date().getMonth() + 1 + "";
  const year = searchParams?.year || new Date().getFullYear() + "";
  const returns = await getAllReturnsByDate({ month, year });
  
  return (
    <ContentLayout>
      <AdminPageTopBar length={returns?.length} title="Purchase Returns">
        <AdminPageFilter />
        <RefreshButton />
        <AddButton>
          <Link href="/admin/purchase/return/new">New Return</Link>
        </AddButton>
      </AdminPageTopBar>
      <AdminPageBody>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Return ID</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Items</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {returns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No returns found
                  </TableCell>
                </TableRow>
              ) : (
                returns.map((returnItem) => (
                  <TableRow key={returnItem.id}>
                    <TableCell className="font-medium">
                      #{returnItem.id}
                    </TableCell>
                    <TableCell>{returnItem.supplier.name}</TableCell>
                    <TableCell>
                      {format(new Date(returnItem.returnDate), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(returnItem.dueDate), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>{returnItem.remarks || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {returnItem._count.ReturnItems} items
                      </Badge>
                    </TableCell>
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

export default PurchaseReturnPage;
