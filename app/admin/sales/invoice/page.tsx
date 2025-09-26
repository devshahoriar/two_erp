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
import { getAllInvoicesByDate } from './action';

const SalesInvoicePage = async (props: {
  searchParams?: Promise<{
    month?: string;
    year?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const month = searchParams?.month || new Date().getMonth() + 1 + "";
  const year = searchParams?.year || new Date().getFullYear() + "";
  const data = await getAllInvoicesByDate({ month, year });
  
  return (
    <ContentLayout>
      <AdminPageTopBar length={data?.length} title="Sales Invoice">
        <AdminPageFilter />
        <RefreshButton />
        <AddButton>
          <Link href="/admin/sales/invoice/new">Add Invoice</Link>
        </AddButton>
      </AdminPageTopBar>
      <AdminPageBody>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice No</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Invoice Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No invoices found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.invoiceNo}
                    </TableCell>
                    <TableCell>{invoice.remarks || "-"}</TableCell>
                    <TableCell>
                      {format(new Date(invoice.invoiceDate), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>{invoice.customer.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {invoice._count.SalesInvoiceItems} items
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
  )
}

export default SalesInvoicePage;
