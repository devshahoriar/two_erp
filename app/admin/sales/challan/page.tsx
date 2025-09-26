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
import { getAllChallansByDate } from "./action";

const SalesChallanPage = async (props: {
  searchParams?: Promise<{
    month?: string;
    year?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const month = searchParams?.month || new Date().getMonth() + 1 + "";
  const year = searchParams?.year || new Date().getFullYear() + "";
  const data = await getAllChallansByDate({ month, year });

  return (
    <ContentLayout>
      <AdminPageTopBar length={data?.length} title="Sales Challans">
        <AdminPageFilter />

        <RefreshButton />
        <AddButton>
          <Link
            href="/admin/sales/challan/new"
            className="flex items-center gap-2"
          >
            Add Challan
          </Link>
        </AddButton>
      </AdminPageTopBar>
      <AdminPageBody>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Challan No</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Challan Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No challans found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((challan) => (
                  <TableRow key={challan.id}>
                    <TableCell className="font-medium">
                      {challan.challanNo}
                    </TableCell>
                    <TableCell>{challan.contactPerson}</TableCell>
                    <TableCell>{challan.branch.name}</TableCell>
                    <TableCell>
                      {format(new Date(challan.challanDate), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(challan.dueDate), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {challan._count.SalesChallanItems} items
                      </Badge>
                    </TableCell>
                    <TableCell>{challan.remarks || "-"}</TableCell>
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

export default SalesChallanPage;
