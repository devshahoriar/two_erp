"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { AddButton, LoadingButton } from "@/components/shared/CustomButton";
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
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProductGroupSelect } from "../../../data/product-group/ExportComponents";
import ProductSelect from "../../../data/products/ExportComponent";

import { createQuotation, updateQuotation } from "./action";
import { newQuotation } from "./type";
import { BranchSelect } from "@/app/admin/data/branch/ExportComponent";
import SupplierSelect from "@/app/admin/purchase/supplier/ExportComponent";

const ProductRow = ({
  product,
  index,
  handleProductChange,
  removeProduct,
}: any) => {
  return (
    <TableRow>
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        <ProductGroupSelect
          value={product?.groupId + ""}
          setValue={(value: any) => {
            handleProductChange(index, "groupId", value + "");
            handleProductChange(index, "item", "");
          }}
        />
      </TableCell>
      <TableCell>
        <ProductSelect
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
      <TableCell>
        <button onClick={() => removeProduct(index)}>
          <X size={18} />
        </button>
      </TableCell>
    </TableRow>
  );
};

const dfData = {
  supplierId: "",
  branchId: "",
  quotationDate: new Date().toISOString().split("T")[0],
  dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split("T")[0],
  delivery: "",
  support_warranty: "",
  validity_of_quotation: "",
  payment: "",
  others: "",
  suppingAddress: "",
  remarks: "",
  products: [
    {
      group: "",
      groupId: "",
      item: "",
      quantity: "",
      unit: "-",
      remarks: "",
    },
  ],
};

const AddQuotation = ({
  id,
  initialData,
}: {
  id?: string;
  initialData?: any;
}) => {
  const [input, setInput] = useState(dfData);
  const [isEdit, setIsEdit] = useState(false);

  const { loading, mutate } = useMutate();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      setIsEdit(true);
    }
  }, [id]);

  useEffect(() => {
    if (initialData) {
      setInput(initialData);
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
        };
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

  const addProduct = () => {
    setInput((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          group: "",
          groupId: "",
          item: "",
          quantity: "",
          unit: "-",
          remarks: "",
        },
      ],
    }));
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
    const data = newQuotation.safeParse(input);
    if (!data.success) {
      toast.error(validateError(data));
      return;
    }

    if (isEdit && id) {
      await mutate({
        data: data.data,
        sendData: async (formData: any) => updateQuotation(id, formData),
        next() {
          router.push("/admin/sales/quotation");
          setInput(dfData);
        },
      });
    } else {
      await mutate({
        data: data.data,
        sendData: createQuotation,
        next() {
          router.push("/admin/sales/quotation");
          setInput(dfData);
        },
      });
    }
  };

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <p className="mb-1 text-sm">Supplier</p>
            <SupplierSelect
              value={input.supplierId}
              setValue={(value: any) => handleInputChange("supplierId", value+'')}
            />
          </div>
          <div>
            <p className="mb-1 text-sm">Branch</p>
            <BranchSelect
              value={input.branchId}
              setValue={(value: any) => handleInputChange("branchId", value+'')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <InputWithLabel
            className="mt-0"
            type="date"
            title="Quotation Date"
            placeholder="Quotation Date"
            value={input?.quotationDate}
            onChange={(e) => handleInputChange("quotationDate", e.target.value)}
          />
          <InputWithLabel
            className="mt-0"
            type="date"
            title="Due Date"
            placeholder="Due Date"
            value={input?.dueDate}
            onChange={(e) => handleInputChange("dueDate", e.target.value)}
          />
        </div>

        <InputWithLabel
          title="Delivery"
          placeholder="Delivery Terms"
          value={input.delivery}
          onChange={(e) => handleInputChange("delivery", e.target.value)}
        />
        
        <InputWithLabel
          title="Support/Warranty"
          placeholder="Support/Warranty Details"
          value={input.support_warranty}
          onChange={(e) => handleInputChange("support_warranty", e.target.value)}
        />
        
        <InputWithLabel
          title="Validity of Quotation"
          placeholder="Validity Period"
          value={input.validity_of_quotation}
          onChange={(e) => handleInputChange("validity_of_quotation", e.target.value)}
        />
        
        <InputWithLabel
          title="Payment Terms"
          placeholder="Payment Terms"
          value={input.payment}
          onChange={(e) => handleInputChange("payment", e.target.value)}
        />
        
        <InputWithLabel
          title="Others (Optional)"
          placeholder="Other Terms and Conditions"
          value={input.others || ""}
          onChange={(e) => handleInputChange("others", e.target.value)}
        />

        <InputWithLabel
          title="Shipping Address"
          placeholder="Shipping Address"
          value={input.suppingAddress}
          onChange={(e) => handleInputChange("suppingAddress", e.target.value)}
        />
        
        <InputWithLabel
          placeholder="Remarks"
          value={input.remarks || ""}
          onChange={(e) => handleInputChange("remarks", e.target.value)}
        />

        <div className="mt-3">
          <h1 className="text-center font-semibold">Products</h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[5%]">SL</TableHead>
                <TableHead className="w-[20%]">Group</TableHead>
                <TableHead className="w-[25%]">Item</TableHead>
                <TableHead className="w-[15%]">Quantity</TableHead>
                <TableHead className="w-[10%]">Unit</TableHead>
                <TableHead className="w-[20%]">Remarks</TableHead>
                <TableHead className="w-[5%]"></TableHead>
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
          <AddButton
            size="sm"
            variant="outline"
            onClick={addProduct}
            className="mt-3"
          >
            Add Product
          </AddButton>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/sales/quotation")}
        >
          Cancel
        </Button>
        <LoadingButton
          disabled={loading}
          variant="default"
          onClick={handleSubmit}
        >
          {isEdit ? "Update Quotation" : "Save Quotation"}
        </LoadingButton>
      </div>
    </>
  );
};

export default AddQuotation;
