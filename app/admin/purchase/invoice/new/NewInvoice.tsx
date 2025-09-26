"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { BranchSelect } from "@/app/admin/data/branch/ExportComponent";
import ProductSelect from "@/app/admin/data/products/ExportComponent";
import WarehouseSelect from "@/app/admin/data/warehouse/ExportComponent";
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
import { z } from "zod";
import { ProductGroupSelect } from "../../../data/product-group/ExportComponents";
import PucrcheseChallanSelect from "../../challan/ExpoerComponent";
import SupplierSelect from "../../supplier/ExportComponent";
import { createNewInvoice, getChallanForInvoice, getInvoiceNo } from "./action";
import { newInvoiceSchema } from "./type";

const ProductRow = ({ product, index, handleProductChange }: any) => {
  return (
    <TableRow>
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        <ProductGroupSelect
          disabled
          value={product?.groupId + ""}
          setValue={(value: any) => {
            handleProductChange(index, "groupId", value + "");
            handleProductChange(index, "item", "");
          }}
        />
      </TableCell>
      <TableCell>
        <ProductSelect
          disabled
          groupId={product.groupId}
          value={product.item + ""}
          setValue={(value: any, data: any) =>
            handleProductChange(index, "item", value + "", data)
          }
        />
      </TableCell>
      <TableCell>
        <Input
          placeholder="Quantity"
          value={product.qeuntity}
          onChange={(e) =>
            handleProductChange(index, "qeuntity", e.target.value)
          }
        />
      </TableCell>
      <TableCell>
        <Input
          placeholder="Rate"
          value={product.rate}
          onChange={(e) => handleProductChange(index, "rate", e.target.value)}
        />
      </TableCell>
      <TableCell>
        <Input
          placeholder="Discount %"
          value={product.discount || "0"}
          onChange={(e) =>
            handleProductChange(index, "discount", e.target.value)
          }
        />
      </TableCell>
      <TableCell>
        <p>{product?.amount || 0}</p>
      </TableCell>
      <TableCell>
        <Input
          placeholder="Batch No"
          value={product.batch || ""}
          onChange={(e) => handleProductChange(index, "batch", e.target.value)}
        />
      </TableCell>
      <TableCell>
        <p className="">{product.unit || "-"}</p>
      </TableCell>
      <TableCell>
        <Input
          placeholder="Remarks"
          value={product.remarks || ""}
          onChange={(e) =>
            handleProductChange(index, "remarks", e.target.value)
          }
        />
      </TableCell>
    </TableRow>
  );
};

const defaultData = {
  invoiceNo: "",
  challanId: "",
  invoiceDate: new Date().toISOString().split("T")[0],
  supplierId: "",
  branchId: "",
  warehouseId: "",
  address: "",
  remarks: "",
  products: [],
};

const NewInvoice = ({
  id,
  initialData,
}: {
  id?: string;
  initialData?: any;
}) => {
  const [input, setInput] = useState<z.infer<typeof newInvoiceSchema>>(
    defaultData as any,
  );
  const [isEdit, setIsEdit] = useState(false);

  const { isLoading: dataLoading } = useSWR(
    input?.challanId ? "dataChallan" : null,
    () => getChallanForInvoice(Number(input.challanId)),
    {
      onSuccess: (data: any) => {
        if (!data) return;

        setInput((prev) => ({
          ...prev,
          supplierId: data.supplierId,
          branchId: data.branchId,
          warehouseId: data.warehouseId,
          address: data.suppingAddress,
          remarks: data.remarks,
          products: data.PurchaseChallanItems.map((item: any) => ({
            group: item.product.group.name,
            groupId: item.product.group.id,
            item: item.product.id,
            qeuntity: item.quantity,
            rate: item.rate,
            discount: "0",
            amount: item.quantity * item.rate,
            batch: item.batchNo || "",
            unit: item.product.unit.name,
            remarks: item?.remarks || "",
          })),
        }));
      },
    },
  );

  useSWR("invoiceNo", getInvoiceNo, {
    onSuccess(data) {
      setInput((prev) => ({
        ...prev,
        invoiceNo: data.toString(), // Convert number to string for form input
      }));
    },
  });

  const { loading, mutate } = useMutate();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      setIsEdit(true);
    }
  }, [id]);

  useEffect(() => {
    if (initialData) {
      setInput({
        challanId: initialData.id,
        invoiceNo: initialData.invoiceNo,
        invoiceDate: initialData.invoiceDate,
        supplierId: initialData.supplierId,
        branchId: initialData.branchId,
        warehouseId: initialData.warehouseId,
        address: initialData.address || "",
        remarks: initialData.remarks || "",
        products: initialData.products,
      });
    }
  }, [initialData]);

  // Calculate totals
  const subtotal =
    input?.products?.reduce((sum, product) => {
      const quantity = parseFloat(product.qeuntity + "") || 0;
      const rate = parseFloat(product.rate + "") || 0;
      return sum + quantity * rate;
    }, 0) || 0;

  const totalDiscount =
    input?.products?.reduce((sum, product) => {
      const quantity = parseFloat(product.qeuntity + "") || 0;
      const rate = parseFloat(product.rate + "") || 0;
      const discount = parseFloat(product.discount + "") || 0;
      return sum + (quantity * rate * discount) / 100;
    }, 0) || 0;

  const total = subtotal - totalDiscount;

  const handleInputChange = (field: string, value: string) => {
    setInput((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProductChange = (
    index: number,
    field: string,
    value: string,
    data?: any,
  ) => {
    setInput((prev) => {
      const updatedProducts = [...prev.products];

      if (field === "item" && data) {
        updatedProducts[index] = {
          ...updatedProducts[index],
          item: value + "",
          group: data.group?.name || "",
          groupId: data.group?.id + "" || "",
          unit: data.unit?.name || "-",
        } as any;
      } else {
        updatedProducts[index] = {
          ...updatedProducts[index],
          [field]: value + "",
        };
      }

      // Calculate amount if quantity or rate or discount changes
      if (field === "qeuntity" || field === "rate" || field === "discount") {
        const quantity = parseFloat(updatedProducts[index].qeuntity + "") || 0;
        const rate = parseFloat(updatedProducts[index].rate + "") || 0;
        const discount = parseFloat(updatedProducts[index].discount + "") || 0;
        const rawAmount = quantity * rate;
        const discountAmount = (rawAmount * discount) / 100;
        updatedProducts[index].amount = rawAmount - discountAmount;
      }

      return {
        ...prev,
        products: updatedProducts,
      };
    });
  };

  const handleSubmit = async () => {
    const data = newInvoiceSchema.safeParse(input);

    if (!data.success) {
      return toast.error(validateError(data));
    }

    await mutate({
      data: data.data,
      sendData: createNewInvoice,
      next() {
        toast.success("Invoice created and stock updated successfully");
        router.push("/admin/purchase/invoice");
      },
    });
  };

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Purchase Challan</label>
            <PucrcheseChallanSelect
              value={input.challanId}
              setValue={(value: any) => handleInputChange("challanId", value)}
            />
          </div>
          <InputWithLabel
            disabled
            className="mt-0"
            title="Invoice No"
            placeholder="Invoice No"
            value={input.invoiceNo}
            onChange={(e) => handleInputChange("invoiceNo", e.target.value)}
          />
          <InputWithLabel
            className="mt-0"
            type="date"
            title="Invoice Date"
            placeholder="Invoice Date"
            value={input?.invoiceDate}
            onChange={(e) => handleInputChange("invoiceDate", e.target.value)}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Supplier</label>
            <SupplierSelect
              value={input.supplierId}
              setValue={(value: any) => handleInputChange("supplierId", value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Branch</label>
            <BranchSelect
              value={input.branchId}
              setValue={(value: any) => handleInputChange("branchId", value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Warehouse</label>
            <WarehouseSelect
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
          placeholder="Invoice Remarks"
          value={input.remarks}
          onChange={(e) => handleInputChange("remarks", e.target.value)}
        />

        {dataLoading && <Loader2 className="mx-auto mt-10 animate-spin" />}

        {input?.products?.length > 0 && (
          <div className="mt-3">
            <h1 className="text-center font-semibold">Products</h1>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[3%]">SL</TableHead>
                  <TableHead className="w-[15%]">Group</TableHead>
                  <TableHead className="w-[15%]">Item</TableHead>
                  <TableHead className="w-[10%]">Quantity</TableHead>
                  <TableHead className="w-[10%]">Rate</TableHead>
                  <TableHead className="w-[10%]">Discount %</TableHead>
                  <TableHead className="w-[10%]">Amount</TableHead>
                  <TableHead className="w-[10%]">Batch No</TableHead>
                  <TableHead className="w-[5%]">Unit</TableHead>
                  <TableHead className="w-[15%]">Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {input.products.map((product, index) => (
                  <ProductRow
                    key={index}
                    product={product}
                    index={index}
                    handleProductChange={handleProductChange}
                  />
                ))}
              </TableBody>
            </Table>
            <div className="mt-3 flex flex-col gap-1">
              <div className="text-right">
                <p className="text-sm">Subtotal: {subtotal.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm">
                  Total Discount: {totalDiscount.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">
                  Net Total: {total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/purchase/invoice")}
        >
          Cancel
        </Button>
        <LoadingButton
          disabled={loading }
          variant="default"
          onClick={handleSubmit}
        >
          {isEdit ? "Update Invoice" : "Save Invoice"}
        </LoadingButton>
      </div>
    </>
  );
};

export default NewInvoice;
