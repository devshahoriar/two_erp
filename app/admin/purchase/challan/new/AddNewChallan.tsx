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
import PurchaseOrderSelect from "../../order/ExportComponent";
import SupplierSelect from "../../supplier/ExportComponent";
import { createNewChallan, getChallanNo, getOrderForChallan } from "./action";
import { newChallanSchema } from "./type";

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
          value={product.quantity}
          onChange={(e) =>
            handleProductChange(index, "quantity", e.target.value)
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
        <p>{product?.amount || 0}</p>
      </TableCell>
      <TableCell>
        <Input
          placeholder="Batch No"
          value={product.batchNo}
          onChange={(e) =>
            handleProductChange(index, "batchNo", e.target.value)
          }
        />
      </TableCell>
      <TableCell>
        <p className="">{product.unit || "-"}</p>
      </TableCell>
      <TableCell>
        <Input
          placeholder="Remark"
          value={product.remark}
          onChange={(e) => handleProductChange(index, "remark", e.target.value)}
        />
      </TableCell>
    </TableRow>
  );
};

const defaultData = {
  challanNo: "",
  description: "",
  orderId: "",
  challanDate: new Date().toISOString().split("T")[0],
  challanDueDate: new Date().toISOString().split("T")[0],
  supplierId: "",
  branchId: "",
  warehouseId: "",
  shippingAddress: "",
  remarks: "",
};

const AddNewChallan = ({ id, initialData }: { id?: string; initialData?: any }) => {
  const [input, setInput] = useState<z.infer<typeof newChallanSchema>>(
    defaultData as any,
  );
  const [isEdit, setIsEdit] = useState(false);

  const { isLoading: dataLoading } = useSWR(
    input?.orderId ? "dataOrder" : null,
    () => getOrderForChallan(Number(input.orderId)),
    {
      onSuccess: (data: any) => {
        setInput((prev) => ({
          ...prev,
          supplierId: data.supplierId,
          branchId: data.branchId,
          warehouseId: data.warehouseId,
          shippingAddress: data.suppingAddress,
          remarks: data.remarks,
          products: data.PurchaseOrderItems.map((item: any) => ({
            group: item.product.group.name,
            groupId: item.product.group.id,
            item: item.product.id,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.quantity * item.rate,
            batchNo: item.batchNo || "",
            unit: item.product.unit.name,
            remark: item?.remarks || "",
          })),
        }));
      },
    },
  );

  useSWR("challanNo", getChallanNo, {
    onSuccess(data) {
      setInput((prev) => ({
        ...prev,
        challanNo: data + "",
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
        orderId: initialData.id,
        challanNo: initialData.challanNo,
        challanDate: initialData.challanDate,
        challanDueDate: initialData.challanDueDate,
        supplierId: initialData.supplierId,
        branchId: initialData.branchId,
        warehouseId: initialData.warehouseId,
        shippingAddress: initialData.shippingAddress || "",
        remarks: initialData.remarks || "",
        products: initialData.products,
      });
    }
  }, [initialData]);

  const total = input?.products?.reduce((sum, product) => {
    const quantity = parseFloat(product.quantity + "") || 0;
    const rate = parseFloat(product.rate + "") || 0;
    return sum + quantity * rate;
  }, 0);

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

      // Calculate amount if quantity or rate changes
      if (field === "quantity" || field === "rate") {
        const quantity = parseFloat(updatedProducts[index].quantity + "") || 0;
        const rate = parseFloat(updatedProducts[index].rate + "") || 0;
        updatedProducts[index].amount = quantity * rate;
      }

      return {
        ...prev,
        products: updatedProducts,
      };
    });
  };

  const handleSubmit = async () => {
    const data = newChallanSchema.safeParse(input);

    if (!data.success) {
      return toast.error(validateError(data));
    }
    await mutate({
      data: data.data,
      sendData: createNewChallan,
      next() {
        router.push("/admin/purchase/challan");
      },
    });
  };

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Purchase Order</label>
            <PurchaseOrderSelect
              value={input.orderId}
              setValue={(value: any) => handleInputChange("orderId", value)}
            />
          </div>
          <InputWithLabel
            disabled
            className="mt-0"
            title="Challan No"
            placeholder="Challan No"
            value={input.challanNo}
            onChange={(e) => handleInputChange("challanNo", e.target.value)}
          />
          <InputWithLabel
            className="mt-0"
            type="date"
            title="Challan Date"
            placeholder="Challan Date"
            value={input?.challanDate}
            onChange={(e) => handleInputChange("challanDate", e.target.value)}
          />

          <InputWithLabel
            className="mt-0"
            type="date"
            title="Challan Due Date"
            placeholder="Due Date"
            value={input?.challanDueDate}
            onChange={(e) => handleInputChange("challanDueDate", e.target.value)}
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
          title="Shipping Address"
          placeholder="Shipping Address"
          value={input.shippingAddress}
          onChange={(e) => handleInputChange("shippingAddress", e.target.value)}
        />

        <InputWithLabel
          title="Remarks"
          placeholder="Challan Remarks"
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
                  <TableHead className="w-[10%]">Amount</TableHead>
                  <TableHead className="w-[10%]">Batch No</TableHead>
                  <TableHead className="w-[5%]">Unit</TableHead>
                  <TableHead className="w-[15%]">Remark</TableHead>
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
            <div className="mt-3 flex justify-between">
              <div className="text-right">
                <p className="text-lg font-semibold">
                  Total: {total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/purchase/challan")}
        >
          Cancel
        </Button>
        <LoadingButton
          disabled={loading}
          variant="default"
          onClick={handleSubmit}
        >
          {isEdit ? "Update Challan" : "Save Challan"}
        </LoadingButton>
      </div>
    </>
  );
};

export default AddNewChallan;