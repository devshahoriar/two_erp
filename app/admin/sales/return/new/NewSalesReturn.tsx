"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { BranchSelect } from "@/app/admin/data/branch/ExportComponent";
import WarehouseSelect from "@/app/admin/data/warehouse/ExportComponent";
import CustomerSelect from "@/app/admin/sales/customer/ExportComponent";
import SalesInvoiceSelect from "@/app/admin/sales/invoice/ExportComponent";
import { LoadingButton } from "@/components/shared/CustomButton";
import { Button } from "@/components/ui/button";
import { Input, InputWithLabel } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useMutate from "@/hooks/useMutate";
import { validateError } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { createSalesReturnWithStockUpdate, getInvoiceDetailsForSalesReturn, getSalesReturnNo } from "../action";
import { salesReturnSchema } from "../type";

const defaultData = {
  invoiceId: "",
  salesReturnDate: new Date().toISOString().split("T")[0],
  dueDate: new Date().toISOString().split("T")[0],
  customerId: "",
  branchId: "",
  warehouseId: "",
  address: "",
  remarks: "",
  totalQuantity: 0,
  totalAmount: 0,
  products: [],
};

const ReturnProductRow = ({ product, index, handleReturnChange }: any) => {
  return (
    <TableRow>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{product.productName}</TableCell>
      <TableCell>{product.batch || "-"}</TableCell>
      <TableCell>{product.originalQuantity}</TableCell>
      <TableCell>{product.unit || "-"}</TableCell>
      <TableCell>{product.rate.toFixed(2)}</TableCell>
      <TableCell>
        <Input
          type="number"
          min="0"
          max={product.originalQuantity}
          placeholder="Return Qty"
          value={product.returnQuantity || ""}
          onChange={(e) => {
            const value = e.target.value;
            const numValue = parseFloat(value);
            
            // Validate that return quantity doesn't exceed original quantity
            if (numValue > product.originalQuantity) {
              toast.error("Return quantity cannot exceed original quantity");
              return;
            }
            
            handleReturnChange(index, "returnQuantity", value);
          }}
        />
      </TableCell>
      <TableCell>{product.amount ? product.amount.toFixed(2) : "0.00"}</TableCell>
    </TableRow>
  );
};

const NewSalesReturn = () => {
  const [input, setInput] = useState<any>(defaultData);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();
  const { loading, mutate } = useMutate();

  // Get return number
  useSWR("salesReturnNo", getSalesReturnNo, {
    onSuccess: (data) => {
      setInput((prev:any) => ({
        ...prev,
        returnNo: data
      }));
    },
  });

  // Load invoice data when invoice is selected
  const { isLoading: dataLoading } = useSWR(
    input?.invoiceId ? "invoiceData" : null,
    () => getInvoiceDetailsForSalesReturn(Number(input.invoiceId)),
    {
      onSuccess: (data: any) => {
        if (!data) return;
        setProcessing(true);
        
        setInput((prev: any) => ({
          ...prev,
          customerId: data.customerId,
          branchId: data.branchId,
          warehouseId: data.warehouseId,
          address: data.address || "",
          remarks: `Return for Invoice #${data.invoiceNo}`,
          products: data.SalesInvoiceItems.map((item: any) => ({
            productId: item.product.id,
            productName: item.product.name,
            batch: item.batchNo || "",
            originalQuantity: item.quantity,
            returnQuantity: "",
            rate: item.rate,
            amount: 0, // Will be calculated when return quantity is entered
            unit: item.product.unit.name,
            groupId: item.product.groupId,
            groupName: item.product.group.name,
          })),
        }));
        
        setProcessing(false);
      },
      onError: () => {
        setProcessing(false);
      },
    }
  );

  const handleInputChange = (field: string, value: string) => {
    setInput((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReturnChange = (index: number, field: string, value: string) => {
    setInput((prev: any) => {
      const updatedProducts = [...prev.products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: value,
      };
      
      // Calculate amount when return quantity changes
      if (field === "returnQuantity" && value) {
        const returnQty = parseFloat(value) || 0;
        const rate = updatedProducts[index].rate;
        updatedProducts[index].amount = returnQty * rate;
      }
      
      // Calculate totals
      const totalQuantity = updatedProducts.reduce((sum, item) => {
        return sum + (parseFloat(item.returnQuantity) || 0);
      }, 0);
      
      const totalAmount = updatedProducts.reduce((sum, item) => {
        return sum + (item.amount || 0);
      }, 0);

      return {
        ...prev,
        products: updatedProducts,
        totalQuantity,
        totalAmount,
      };
    });
  };

  const handleSubmit = async () => {
    // Validate that at least one product has a return quantity
    const hasReturnItems = input.products.some(
      (product: any) => product.returnQuantity && parseFloat(product.returnQuantity) > 0
    );
    
    if (!hasReturnItems) {
      return toast.error("Please specify return quantity for at least one product");
    }
    
    // Validate the form data
    const data = salesReturnSchema.safeParse(input);

    if (!data.success) {
      return toast.error(validateError(data));
    }

    await mutate({
      data: data.data,
      sendData: createSalesReturnWithStockUpdate,
      next() {
        router.push("/admin/sales/return");
      },
    });
  };

  useEffect(() => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
    }, 1000);
  }, []);

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Sales Invoice</label>
            <SalesInvoiceSelect
              value={input.invoiceId}
              setValue={(value: any) => handleInputChange("invoiceId", value)}
            />
          </div>
          <InputWithLabel
            disabled
            className="mt-0"
            title="Return #"
            placeholder="Return Number"
            value={input.returnNo || ""}
           
          />
          <InputWithLabel
            className="mt-0"
            type="date"
            title="Return Date"
            placeholder="Return Date"
            value={input.salesReturnDate}
            onChange={(e) => handleInputChange("salesReturnDate", e.target.value)}
          />
          <InputWithLabel
            className="mt-0"
            type="date"
            title="Due Date"
            placeholder="Due Date"
            value={input.dueDate}
            onChange={(e) => handleInputChange("dueDate", e.target.value)}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Customer</label>
            <CustomerSelect
              disabled={!!input.invoiceId}
              value={input.customerId}
              setValue={(value: any) => handleInputChange("customerId", value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Branch</label>
            <BranchSelect
              disabled={!!input.invoiceId}
              value={input.branchId}
              setValue={(value: any) => handleInputChange("branchId", value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Warehouse</label>
            <WarehouseSelect
              disabled={!!input.invoiceId}
              branchId={input.branchId}
              value={input.warehouseId}
              setValue={(value: any) => handleInputChange("warehouseId", value)}
            />
          </div>
        </div>

        <InputWithLabel
          title="Address"
          placeholder="Address"
          value={input.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
        />

        <InputWithLabel
          title="Remarks"
          placeholder="Return Remarks"
          value={input.remarks}
          onChange={(e) => handleInputChange("remarks", e.target.value)}
        />

        {dataLoading && (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {processing && (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!dataLoading && !processing && input?.products?.length > 0 && (
          <div className="mt-3">
            <h1 className="text-center font-semibold">Products to Return</h1>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[5%]">SL</TableHead>
                  <TableHead className="w-[20%]">Product</TableHead>
                  <TableHead className="w-[10%]">Batch</TableHead>
                  <TableHead className="w-[10%]">Original Qty</TableHead>
                  <TableHead className="w-[10%]">Unit</TableHead>
                  <TableHead className="w-[10%]">Rate</TableHead>
                  <TableHead className="w-[15%]">Return Qty</TableHead>
                  <TableHead className="w-[10%]">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {input.products.map((product: any, index: number) => (
                  <ReturnProductRow
                    key={index}
                    product={product}
                    index={index}
                    handleReturnChange={handleReturnChange}
                  />
                ))}
              </TableBody>
            </Table>
            <div className="mt-3 flex flex-col gap-1">
              <div className="text-right">
                <p className="text-lg font-semibold">
                  Total Return Quantity: {input.totalQuantity}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">
                  Total Return Amount: {input.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/sales/return")}
        >
          Cancel
        </Button>
        <LoadingButton
          disabled={loading}
          variant="default"
          onClick={handleSubmit}
        >
          Process Return
        </LoadingButton>
      </div>
    </>
  );
};

export default NewSalesReturn;
