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
import { getAllReqByDate } from "./action";

const PurchaseRequisitionPage = async (props: {
  searchParams?: Promise<{
    month?: string;
    year?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const month = searchParams?.month || new Date().getMonth() + 1 + "";
  const year = searchParams?.year || new Date().getFullYear() + "";
  const data = await getAllReqByDate({ month, year });
  return (
    <ContentLayout>
      <AdminPageTopBar length={data?.length} title="Requisition">
        <AdminPageFilter />
        <RefreshButton />
        <Link href="/admin/purchase/requisition/new">
          <AddButton>Add Requisition</AddButton>
        </Link>
      </AdminPageTopBar>
      <AdminPageBody>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requisition No</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No requisitions found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((requisition) => (
                  <TableRow key={requisition.id}>
                    <TableCell className="font-medium">
                      {requisition.no}
                    </TableCell>
                    <TableCell>{requisition.description || "-"}</TableCell>
                    <TableCell>
                      {format(new Date(requisition.reqDate), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {requisition._count.PurchaseRequisitionItems} items
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={requisition.post ? "default" : "outline"}>
                        {requisition.post ? "Posted" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={requisition.isOrdered ? "default" : "outline"}
                      >
                        {requisition.isOrdered ? "Ordered" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {!requisition.isOrdered && (
                        <Link
                          href={`/admin/purchase/requisition/new/?id=${requisition.id}`}
                        >
                          <Button variant="ghost" size="icon">
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
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

export default PurchaseRequisitionPage;
