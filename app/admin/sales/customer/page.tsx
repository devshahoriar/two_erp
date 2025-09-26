import { ContentLayout } from "@/components/admin-panel/content-layout";
import { AdminPageBody, AdminPageTopBar } from "@/components/shared/AdminPageElement";
import { RefreshButton } from "@/components/shared/CustomButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import AddNewCustomer from "./AddNewCustomer";
import { getAllCustomers } from "./action";

const SalesCustomerPage = async () => {
  const customers = await getAllCustomers();
  
  return (
    <ContentLayout>
      <AdminPageTopBar title="Customer" length={customers.length}>
        <RefreshButton />
        <AddNewCustomer />
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
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.code}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.email || "-"}</TableCell>
                    <TableCell>{customer.address}</TableCell>
                    <TableCell>{customer.note || "-"}</TableCell>
                    <TableCell>{format(customer.createdAt, "PPP")}</TableCell>
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

export default SalesCustomerPage;
