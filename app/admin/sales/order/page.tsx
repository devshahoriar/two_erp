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
import { getAllOrdersByDate } from "./action";


const SalesOrderPage = async (props: {
  searchParams?: Promise<{
    month?: string;
    year?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const month = searchParams?.month || new Date().getMonth() + 1 + "";
  const year = searchParams?.year || new Date().getFullYear() + "";
  const data = await getAllOrdersByDate({ month, year });

  return (
    <ContentLayout>
      <AdminPageTopBar length={data?.length} title="Sales Orders">
        <AdminPageFilter />
        <RefreshButton />
        <AddButton>
          <Link href="/admin/sales/order/new">Add Sales Order</Link>
        </AddButton>
      </AdminPageTopBar>
      <AdminPageBody>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order No</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Items</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No sales orders found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.orderNo}
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.orderDate), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.deliveryDate), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>{order.customer.name}</TableCell>
                    <TableCell>{order.address}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {order._count.SalesOrderItems} items
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

export default SalesOrderPage;
