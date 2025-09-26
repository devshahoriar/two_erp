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
import useSWR from "swr";
import { ProductGroupSelect } from "../../../data/product-group/ExportComponents";
import ProductSelect from "../../../data/products/ExportComponent";
import {
  createReq,
  getReqeSitionNumber,
  updateReq
} from "./action";
import { newReqesition } from "./type";

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
          placeholder="Remark"
          value={product.remark}
          onChange={(e) => handleProductChange(index, "remark", e.target.value)}
        />
      </TableCell>
      <TableCell>
        <button onClick={() => removeProduct(index)}>
          <X size={18} />
        </button>{" "}
      </TableCell>
    </TableRow>
  );
};

const dfData = {
  no: "",
  description: "",
  reqDate: new Date().toISOString().split("T")[0],
  products: [
    {
      group: "",
      groupId: "",
      item: "",
      quantity: "",
      unit: "-",
      remark: "",
    },
  ],
};

const AddRequisition = ({
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
  const { data: reqNumber, mutate: mt } = useSWR(
    !id ? "getReqeSitionNumber" : null,
    getReqeSitionNumber,
  );

  useEffect(() => {
    if (id) {
      setIsEdit(true);
    }
  }, [id]);

  useEffect(() => {
    if (initialData) {
      setInput({
        no: initialData.no,
        description: initialData.description || "",
        reqDate: initialData.reqDate,
        products: initialData.products,
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (reqNumber && !isEdit) {
      setInput((prev) => ({
        ...prev,
        no: reqNumber + "",
      }));
    }
  }, [reqNumber, isEdit]);

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
          remark: "",
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
    const data = newReqesition.safeParse(input);
    if (!data.success) {
      toast.error(validateError(data));
      return;
    }

    if (isEdit && id) {
      await mutate({
        data: data.data,
        sendData: async (formData: any) => updateReq(id, formData),
        next() {
          router.push("/admin/purchase/requisition");
          setInput(dfData);
        },
      });
    } else {
      await mutate({
        data: data.data,
        sendData: createReq,
        next() {
          router.push("/admin/purchase/requisition");
          setInput(dfData);
          mt();
        },
      });
    }
  };

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <InputWithLabel
            className="mt-0"
            title="Requisition No"
            placeholder="Requisition No"
            value={input.no}
            onChange={(e) => handleInputChange("no", e.target.value)}
          />
          <InputWithLabel
            className="mt-0"
            type="date"
            title="Requisition Date"
            placeholder="Requisition Date"
            value={input?.reqDate}
            onChange={(e) => handleInputChange("reqDate", e.target.value)}
          />
        </div>
        <InputWithLabel
          title="Remarks"
          placeholder="Requisition Remarks"
          value={input.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
        <div className="mt-3">
          <h1 className="text-center font-semibold">Products</h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[5%]">SL</TableHead>
                <TableHead className="w-[25%]">Group</TableHead>
                <TableHead className="w-[25%]">Item</TableHead>
                <TableHead className="w-[20%]">Quantity</TableHead>
                <TableHead className="w-[5%]">Unit</TableHead>
                <TableHead className="w-[15%]">Remark</TableHead>
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
          onClick={() => router.push("/admin/purchase/requisition")}
        >
          Cancel
        </Button>
        <LoadingButton
          disabled={loading}
          variant="default"
          onClick={handleSubmit}
        >
          {isEdit ? "Update Requisition" : "Save Requisition"}
        </LoadingButton>
      </div>
    </>
  );
};

export default AddRequisition;
