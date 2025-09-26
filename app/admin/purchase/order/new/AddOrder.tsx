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
import RequisitionSelect from "../../requisition/ExportComponent";
import SupplierSelect from "../../supplier/ExportComponent";
import { createNewOrder, getOrderNo, getReqForOrder } from "./action";
import { newOrderSchema } from "./type";

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
      {/* <TableCell>
        <button onClick={() => removeProduct(index)}>
          <X size={18} />
        </button>
      </TableCell> */}
    </TableRow>
  );
};

const dfData = {
  orderNo: "",
  description: "",
  reqId: "",
  orderDate: new Date().toISOString().split("T")[0],
  dueDate: new Date().toISOString().split("T")[0],
  supplierId: "",
  branchId: "",
  warehouseId: "",
  shippingAddress: "",
  remarks: "",
};

const AddOrder = ({ id, initialData }: { id?: string; initialData?: any }) => {
  const [input, setInput] = useState<z.infer<typeof newOrderSchema>>(
    dfData as any,
  );
  const [isEdit, setIsEdit] = useState(false);

  const { isLoading: dataLoading } = useSWR(
    input?.reqId ? "dataReq" : null,
    () => getReqForOrder(Number(input.reqId)),
    {
      onSuccess: (data: any) => {
        setInput((prev) => ({
          ...prev,
          products: data.PurchaseRequisitionItems.map((item: any) => ({
            group: item.product.group.name,
            groupId: item.product.group.id,
            item: item.product.id,
            quantity: item.quantity,
            rate: 0,
            amount: 0,
            batchNo: "",
            unit: item.product.unit.name,
            remark: item?.remarks || "",
          })),
        }));
      },
    },
  );

  useSWR("idNo", getOrderNo, {
    onSuccess(data) {
      setInput((prev) => ({
        ...prev,
        orderNo: data + "",
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
        reqId: initialData.id,
        orderNo: initialData.orderNo,
        description: initialData.description || "",
        orderDate: initialData.orderDate,
        dueDate: initialData.dueDate,
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

  const removeProduct = (index: number) => {
    setInput((prev) => {
      if (prev.products.length <= 1) {
        toast.error("At least one product is required.");
        return prev;
      }

      const updatedProducts = [...prev.products];
      updatedProducts.splice(index, 1);

      return {
        ...prev,
        products: updatedProducts,
      };
    });
  };

  const handleSubmit = async () => {
    const data = newOrderSchema.safeParse(input);

    if (!data.success) {
      return toast.error(validateError(data));
    }
    await mutate({
      data: data.data,
      sendData: createNewOrder,
      next() {
        router.push("/admin/purchase/order");
      },
    });
  };

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Requisition</label>
            <RequisitionSelect
              value={input.reqId}
              setValue={(value: any) => handleInputChange("reqId", value)}
            />
          </div>
          <InputWithLabel
            disabled
            className="mt-0"
            title="Purchase Order No"
            placeholder="Order No"
            value={input.orderNo}
            onChange={(e) => handleInputChange("orderNo", e.target.value)}
          />
          <InputWithLabel
            className="mt-0"
            type="date"
            title="Order Date"
            placeholder="Order Date"
            value={input?.orderDate}
            onChange={(e) => handleInputChange("orderDate", e.target.value)}
          />

          <InputWithLabel
            className="mt-0"
            type="date"
            title="Due Date"
            placeholder="Due Date"
            value={input?.dueDate}
            onChange={(e) => handleInputChange("dueDate", e.target.value)}
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
          placeholder="Order Remarks"
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
                  {/* <TableHead className="w-[3%]"></TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {input.products.map((product, index) => (
                  <ProductRow
                    key={index}
                    product={product}
                    index={index}
                    handleProductChange={handleProductChange}
                    removeProduct={removeProduct}
                  />
                ))}
              </TableBody>
            </Table>
            <div className="mt-3 flex justify-between">
              {/* <AddButton size="sm" variant="outline" onClick={addProduct}>
              Add Product
            </AddButton> */}
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
          onClick={() => router.push("/admin/purchase/order")}
        >
          Cancel
        </Button>
        <LoadingButton
          disabled={loading}
          variant="default"
          onClick={handleSubmit}
        >
          {isEdit ? "Update Order" : "Save Order"}
        </LoadingButton>
      </div>
    </>
  );
};

export default AddOrder;
