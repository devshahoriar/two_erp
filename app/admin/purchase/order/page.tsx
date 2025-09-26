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

const PurchaseOrderPage = async (props: {
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
      <AdminPageTopBar length={data?.length} title="Order">
        <AdminPageFilter />
        <RefreshButton />
        <AddButton>
          <Link href="/admin/purchase/order/new">Add Order</Link>
        </AddButton>
      </AdminPageTopBar>
      <AdminPageBody>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order No</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                {/* <TableHead className="text-right">Actions</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.orderNo}
                    </TableCell>
                    <TableCell>{order.description || "-"}</TableCell>
                    <TableCell>
                      {format(new Date(order.orderDate), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.dueDate), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>{order.supplier.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {order._count.PurchaseOrderItems} items
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={order.post ? "default" : "outline"}>
                        {order.post ? "Posted" : "Draft"}
                      </Badge>
                    </TableCell>
                    {/* <TableCell className="text-right">
                      <Link
                        href={`/admin/purchase/order/new/?id=${order.id}`}
                      >
                        <Button variant="ghost" size="icon">
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell> */}
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

export default PurchaseOrderPage;
