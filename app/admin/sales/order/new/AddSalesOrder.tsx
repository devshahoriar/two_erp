"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { BranchSelect } from "@/app/admin/data/branch/ExportComponent";
import ProductSelect from "@/app/admin/data/products/ExportComponent";
import WarehouseSelect from "@/app/admin/data/warehouse/ExportComponent";
import SelectCustomers from "@/app/admin/sales/customer/ExportComponent";
import QuotationSelect from "@/app/admin/sales/quotation/ExportComponent";
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
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { getQuotationById } from "../../quotation/action";
import { createNewSalesOrder, getSalesOrderNo } from "../action";
import { newSalesOrderSchema } from "../type";

const ProductRow = ({ product, index, handleProductChange }: any) => {
  return (
    <TableRow>
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        <ProductSelect
          disabled
          value={product.item + ""}
          setValue={(value: any) =>
            handleProductChange(index, "item", value + "")
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
        <p>{product?.amount?.toFixed(2) || "0.00"}</p>
      </TableCell>
      <TableCell>
        <p className="">{product.unit || "-"}</p>
      </TableCell>
      <TableCell>
        <Input
          placeholder="Remark"
          value={product.remark || ""}
          onChange={(e) => handleProductChange(index, "remark", e.target.value)}
        />
      </TableCell>
    </TableRow>
  );
};

const dfData = {
  orderNo: "",
  quotationId: "",
  orderDate: new Date().toISOString().split("T")[0],
  deliveryDate: new Date().toISOString().split("T")[0],
  customerId: "",
  branchId: "",
  warehouseId: "",
  address: "",
  contactPerson: "",
  contactNumber: "",
  placeOfDelivery: "",
  remarks: "",
  products: [],
};

const AddSalesOrder = () => {
  const [input, setInput] = useState<any>(dfData);
  const { isLoading: dataLoading } = useSWR(
    input?.quotationId ? "dataQuotation" : null,
    () => getQuotationById(Number(input.quotationId)),
    {
      onSuccess: (data: any) => {
        if (data) {
          setInput((prev: any) => ({
            ...prev,
            customerId: data.supplierId,
            branchId: data.branchId,
            address: data.suppingAddress || "",
            products: data.QuotationItems.map((item: any) => ({
              item: item.product.id,
              quantity: item.quantity,
              rate: 0,
              amount: 0,
              unit: item.product.unit.name,
              remark: item?.remarks || "",
            })),
          }));
        }
      },
    },
  );

  useSWR("orderNo", getSalesOrderNo, {
    onSuccess(data) {
      setInput((prev: any) => ({
        ...prev,
        orderNo: data + "",
      }));
    },
  });

  const { loading, mutate } = useMutate();
  const router = useRouter();

  const total = input?.products?.reduce((sum: number, product: any) => {
    const quantity = parseFloat(product.quantity + "") || 0;
    const rate = parseFloat(product.rate + "") || 0;
    return sum + quantity * rate;
  }, 0);

  const handleInputChange = (field: string, value: string) => {
    setInput((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProductChange = (index: number, field: string, value: string) => {
    setInput((prev: any) => {
      const updatedProducts = [...prev.products];

      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: value + "",
      };

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
    if (!input.products || input.products.length === 0) {
      return toast.error("Please add at least one product from a quotation");
    }

    const data = newSalesOrderSchema.safeParse(input);

    if (!data.success) {
      return toast.error(validateError(data));
    }

    await mutate({
      data: data.data,
      sendData: createNewSalesOrder,
      next() {
        router.push("/admin/sales/order");
      },
    });
  };

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Quotation</label>
            <QuotationSelect
              value={input.quotationId}
              setValue={(value: any) => handleInputChange("quotationId", value)}
            />
          </div>
          <InputWithLabel
            disabled
            className="mt-0"
            title="Sales Order No"
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
            title="Delivery Date"
            placeholder="Delivery Date"
            value={input?.deliveryDate}
            onChange={(e) => handleInputChange("deliveryDate", e.target.value)}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Customer</label>
            <SelectCustomers
              disabled
              value={input.customerId}
              setValue={(value: any) => handleInputChange("customerId", value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Branch</label>
            <BranchSelect
              disabled
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

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <InputWithLabel
            title="Contact Person"
            placeholder="Contact Person"
            value={input.contactPerson}
            onChange={(e) => handleInputChange("contactPerson", e.target.value)}
          />

          <InputWithLabel
            title="Contact Number"
            placeholder="Contact Number"
            value={input.contactNumber}
            onChange={(e) => handleInputChange("contactNumber", e.target.value)}
          />
        </div>

        <InputWithLabel
          title="Place of Delivery"
          placeholder="Place of Delivery"
          value={input.placeOfDelivery}
          onChange={(e) => handleInputChange("placeOfDelivery", e.target.value)}
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
                  <TableHead className="w-[20%]">Item</TableHead>
                  <TableHead className="w-[15%]">Quantity</TableHead>
                  <TableHead className="w-[15%]">Rate</TableHead>
                  <TableHead className="w-[15%]">Amount</TableHead>
                  <TableHead className="w-[10%]">Unit</TableHead>
                  <TableHead className="w-[22%]">Remark</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {input.products.map((product: any, index: number) => (
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
              <div></div>
              <div className="text-right">
                <p className="text-lg font-semibold">
                  Total: {total?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/sales/order")}
        >
          Cancel
        </Button>
        <LoadingButton
          disabled={loading}
          variant="default"
          onClick={handleSubmit}
        >
          Save Sales Order
        </LoadingButton>
      </div>
    </>
  );
};

export default AddSalesOrder;
