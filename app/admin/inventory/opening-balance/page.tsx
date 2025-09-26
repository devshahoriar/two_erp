import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  AdminPageBody,
  AdminPageTopBar,
} from "@/components/shared/AdminPageElement";
import AdminPageFilter from "@/components/shared/AdminPageFilter";
import { RefreshButton } from "@/components/shared/CustomButton";
import CreateOpningBalance from "./CreateOpningBalance";
import { allOpningBalanceAndProduct } from "./action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const OpningBalance = async (props: {
  searchParams?: Promise<{
    month?: string;
    year?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const month = searchParams?.month || new Date().getMonth() + 1 + "";
  const year = searchParams?.year || new Date().getFullYear() + "";
  
  const openingBalances = await allOpningBalanceAndProduct(month, year);

  return (
    <ContentLayout>
      <AdminPageTopBar length={openingBalances.length} title="Opening Balance">
        <AdminPageFilter />
        <RefreshButton />
        <CreateOpningBalance />
      </AdminPageTopBar>
      <AdminPageBody>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Opening Balance No</TableHead>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="w-[150px]">Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {openingBalances.length > 0 ? (
                openingBalances.map((balance) => (
                  <TableRow key={balance.id} className="group hover:bg-muted/50">
                    <TableCell className="font-medium">{balance.opningBalanceId}</TableCell>
                    <TableCell>{format(new Date(balance.createdAt), "dd MMM yyyy")}</TableCell>
                    <TableCell>
                      <div className="grid gap-2">
                        {balance.OpeningBalanceItem.map((item, index) => (
                          <div 
                            key={index} 
                            className={cn(
                              "flex flex-col p-2 rounded-md",
                              index % 2 === 0 ? "bg-muted/30" : "bg-background"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-primary">{item.product.name}</span>
                              <Badge variant="outline" className="ml-2">
                                {item.quantity} {item.product.unit.name}
                              </Badge>
                            </div>
                            <div className="mt-1 text-sm text-muted-foreground flex items-center">
                              <span className="inline-block w-16">Rate:</span>
                              <span className="font-medium text-foreground">${item.rate.toFixed(2)}</span>
                              <span className="mx-2">|</span>
                              <span className="inline-block w-16">Value:</span>
                              <span className="font-medium text-foreground">${(item.quantity * item.rate).toFixed(2)}</span>
                            </div>
                            {item.remarks && (
                              <div className="mt-1 text-sm italic text-muted-foreground">
                                Note: {item.remarks}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {balance.remarks || "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No opening balances found for this period.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </AdminPageBody>
    </ContentLayout>
  );
};

export default OpningBalance;
