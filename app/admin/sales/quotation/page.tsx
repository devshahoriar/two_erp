import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  AdminPageBody,
  AdminPageTopBar,
} from "@/components/shared/AdminPageElement";
import AdminPageFilter from "@/components/shared/AdminPageFilter";
import { AddButton, RefreshButton } from "@/components/shared/CustomButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { getAllQuotationsByDate } from "./action";

const SalesQuotationPage = async (props: {
  searchParams?: Promise<{
    month?: string;
    year?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const month = searchParams?.month || new Date().getMonth() + 1 + "";
  const year = searchParams?.year || new Date().getFullYear() + "";
  const data = await getAllQuotationsByDate({ month, year });
  
  return (
    <ContentLayout>
      <AdminPageTopBar length={data?.length} title="Quotation">
        <AdminPageFilter />
        <RefreshButton />
        <Link href="/admin/sales/quotation/new">
          <AddButton>Add Quotation</AddButton>
        </Link>
      </AdminPageTopBar>
      <AdminPageBody>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No quotations found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell className="font-medium">
                      {quotation.supplier.name}
                    </TableCell>
                    <TableCell>{quotation.branch.name}</TableCell>
                    <TableCell>
                      {format(new Date(quotation.quotationDate), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(quotation.dueDate), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {quotation._count.QuotationItems} items
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/admin/sales/quotation/new/?id=${quotation.id}`}
                      >
                        <Button variant="ghost" size="icon">
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </Link>
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

export default SalesQuotationPage;
