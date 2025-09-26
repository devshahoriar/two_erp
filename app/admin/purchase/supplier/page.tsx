import { ContentLayout } from "@/components/admin-panel/content-layout";
import { AdminPageBody, AdminPageTopBar } from "@/components/shared/AdminPageElement";
import { RefreshButton } from "@/components/shared/CustomButton";
import AddNewSupplier from "./AddNewSupplier";
import { getAllSupplier } from "./action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

const PurchaseSupplierPage = async () => {
  const allSup = await getAllSupplier();
  return (
    <ContentLayout>
      <AdminPageTopBar title="Supplier" length={allSup.length}>
        <RefreshButton />
        <AddNewSupplier />
      </AdminPageTopBar>
      <AdminPageBody>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allSup.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No suppliers found
                  </TableCell>
                </TableRow>
              ) : (
                allSup.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.code}</TableCell>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.email || "-"}</TableCell>
                    <TableCell>{supplier.address}</TableCell>
                    <TableCell>{supplier.note || "-"}</TableCell>
                    <TableCell>{format(supplier.createdAt, "PPP")}</TableCell>
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

export default PurchaseSupplierPage;
