import { ContentLayout } from '@/components/admin-panel/content-layout';
import { AdminPageBody, AdminPageTopBar } from '@/components/shared/AdminPageElement';
import AdminPageFilter from '@/components/shared/AdminPageFilter';
import { AddButton, RefreshButton } from '@/components/shared/CustomButton';
import FullPageLoder from '@/components/shared/FullPageLoder';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import Link from 'next/link';
import { Suspense } from 'react';
import { getAllSalesReturnsByDate } from './action';

const SalesReturnPage =async (props: {
  searchParams?: Promise<{
    month?: string;
    year?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const month = searchParams?.month || "";
  const year = searchParams?.year || "";
  return (
    <ContentLayout>
      <AdminPageTopBar length={0} title="Sales Returns">
        <AdminPageFilter />
        <RefreshButton />
        <AddButton>
          <Link href="/admin/sales/return/new">New Return</Link>
        </AddButton>
      </AdminPageTopBar>
      <AdminPageBody>
        <Suspense key={month + year} fallback={<FullPageLoder/>}>
          <LoadingComponent month={month} year={year} />
        </Suspense>
      </AdminPageBody>
    </ContentLayout>
  )
}
const LoadingComponent = async ({month,year}:{month: string,year:string}) => {
  const returns = await getAllSalesReturnsByDate({ 
    month: month || new Date().getMonth() + 1 + "", 
    year: year || new Date().getFullYear() + "" 
  });
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Return ID</TableHead>
            <TableHead>Customer</TableHead>
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
                <TableCell>{returnItem.customer.name}</TableCell>
                <TableCell>
                  {format(new Date(returnItem.salesReturnDate), "dd MMM yyyy")}
                </TableCell>
                <TableCell>
                  {format(new Date(returnItem.dueDate), "dd MMM yyyy")}
                </TableCell>
                <TableCell>{returnItem.remarks || "-"}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {returnItem._count.SealsReturnItems} items
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SalesReturnPage