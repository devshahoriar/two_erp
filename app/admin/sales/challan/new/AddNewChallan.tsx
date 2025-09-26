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
import SalesOrderSelect from "../../order/ExportComponent";
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
        <p className="">{product.unit || "-"}</p>
      </TableCell>
      <TableCell>
        <Input
          placeholder="Remarks"
          value={product.remarks}
          onChange={(e) => handleProductChange(index, "remarks", e.target.value)}
        />
      </TableCell>
    </TableRow>
  );
};

const defaultData = {
  challanNo: "",
  orderId: "",
  challanDate: new Date().toISOString().split("T")[0],
  dueDate: new Date().toISOString().split("T")[0],
  branchId: "",
  warehouseId: "",
  contactPerson: "",
  contactNumber: "",
  address: "",
  designation: "",
  paleOfDelivery: "",
  poNo: "",
  poDate: new Date().toISOString().split("T")[0],
  driverName: "",
  driverPhone: "",
  transportationMode: "",
  vehicleNo: "",
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
          branchId: data.branchId,
          warehouseId: data.warehouseId,
          address: data.address,
          contactPerson: data.contactPerson,
          contactNumber: data.contactNumber,
          remarks: data.remarks,
          paleOfDelivery: data.placeOfDelivery,
          products: data.SalesOrderItems.map((item: any) => ({
            group: item.product.group.name,
            groupId: item.product.group.id,
            item: item.product.id,
            quantity: item.quantity,
            unit: item.product.unit.name,
            remarks: item?.remarks || "",
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
        dueDate: initialData.dueDate,
        branchId: initialData.branchId,
        warehouseId: initialData.warehouseId,
        contactPerson: initialData.contactPerson,
        contactNumber: initialData.contactNumber,
        address: initialData.address,
        designation: initialData.designation,
        paleOfDelivery: initialData.paleOfDelivery,
        poNo: initialData.poNo,
        poDate: initialData.poDate,
        driverName: initialData.driverName,
        driverPhone: initialData.driverPhone,
        transportationMode: initialData.transportationMode,
        vehicleNo: initialData.vehicleNo,
        remarks: initialData.remarks,
        products: initialData.products,
      });
    }
  }, [initialData]);

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
        router.push("/admin/sales/challan");
      },
    });
  };

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Sales Order</label>
            <SalesOrderSelect
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
            title="Due Date"
            placeholder="Due Date"
            value={input?.dueDate}
            onChange={(e) => handleInputChange("dueDate", e.target.value)}
          />
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
          <InputWithLabel
            className="mt-0"
            title="Contact Person"
            placeholder="Contact Person"
            value={input.contactPerson}
            onChange={(e) => handleInputChange("contactPerson", e.target.value)}
          />
          <InputWithLabel
            className="mt-0"
            title="Contact Number"
            placeholder="Contact Number"
            value={input.contactNumber}
            onChange={(e) => handleInputChange("contactNumber", e.target.value)}
          />
          <InputWithLabel
            className="mt-0"
            title="Address"
            placeholder="Address"
            value={input.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
          />
          <InputWithLabel
            className="mt-0"
            title="Designation"
            placeholder="Designation"
            value={input.designation}
            onChange={(e) => handleInputChange("designation", e.target.value)}
          />
          <InputWithLabel
            className="mt-0"
            title="Place of Delivery"
            placeholder="Place of Delivery"
            value={input.paleOfDelivery}
            onChange={(e) => handleInputChange("paleOfDelivery", e.target.value)}
          />
          <InputWithLabel
            className="mt-0"
            title="PO No"
            placeholder="PO No"
            value={input.poNo}
            onChange={(e) => handleInputChange("poNo", e.target.value)}
          />
          <InputWithLabel
            className="mt-0"
            type="date"
            title="PO Date"
            placeholder="PO Date"
            value={input.poDate}
            onChange={(e) => handleInputChange("poDate", e.target.value)}
          />
          <InputWithLabel
            className="mt-0"
            title="Driver Name"
            placeholder="Driver Name"
            value={input.driverName}
            onChange={(e) => handleInputChange("driverName", e.target.value)}
          />
          <InputWithLabel
            className="mt-0"
            title="Driver Phone"
            placeholder="Driver Phone"
            value={input.driverPhone}
            onChange={(e) => handleInputChange("driverPhone", e.target.value)}
          />
          <InputWithLabel
            className="mt-0"
            title="Transportation Mode"
            placeholder="Transportation Mode"
            value={input.transportationMode}
            onChange={(e) => handleInputChange("transportationMode", e.target.value)}
          />
          <InputWithLabel
            className="mt-0"
            title="Vehicle No"
            placeholder="Vehicle No"
            value={input.vehicleNo}
            onChange={(e) => handleInputChange("vehicleNo", e.target.value)}
          />
        </div>

        <InputWithLabel
          title="Remarks"
          placeholder="Challan Remarks"
          value={input.remarks || ''}
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
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/sales/challan")}
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
