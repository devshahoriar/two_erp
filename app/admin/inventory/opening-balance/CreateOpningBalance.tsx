/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ProductGroupSelect } from "@/app/admin/data/product-group/ExportComponents";
import ProductSelect from "@/app/admin/data/products/ExportComponent";
import { AddButton, LoadingButton } from "@/components/shared/CustomButton";
import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/Credenza";
import { Input, InputWithLabel } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import {
  getAllCurrentStock,
  getOplanceBalanceNumber,
  saveOpeningBalance,
} from "./action";
import { toast } from "sonner";
import { openingBalance } from "./type";
import { validateError } from "@/lib/utils";
import useMutate from "@/hooks/useMutate";

// Define types for our component
interface ProductItem {
  groupId: string;
  productId: string;
  quantity: number;
  rate: number;
  unit?: string;
  remarks?: string;
  customAdded?: boolean;
}

interface OpeningBalanceData {
  opningBalanceId: string;
  createdAt: Date;
  product: ProductItem[];
  remarks?: string;
}

interface ProductRowProps {
  product: ProductItem;
  index: number;
  handleProductChange: (
    index: number,
    field: keyof ProductItem,
    value: string,
    data?: any,
  ) => void;
  removeProduct: (index: number) => void;
}

const ProductRow = ({
  product,
  index,
  handleProductChange,
  removeProduct,
}: ProductRowProps) => {
  // Calculate the total value of the product
  const totalValue = (product?.quantity || 0) * (product?.rate || 0);

  return (
    <TableRow>
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        <ProductGroupSelect
          value={product?.groupId + ""}
          setValue={(value: string) => {
            handleProductChange(index, "groupId", value + "");
            handleProductChange(index, "productId", "");
          }}
          disabled={!product?.customAdded}
        />
      </TableCell>
      <TableCell>
        <ProductSelect
          groupId={product?.groupId}
          value={product?.productId + ""}
          setValue={(value: string, data: any) =>
            handleProductChange(index, "productId", value + "", data)
          }
          disabled={!product?.customAdded}
        />
      </TableCell>
      <TableCell>
        <Input
          placeholder="Quantity"
          type="number"
          value={product?.quantity}
          onChange={(e) =>
            handleProductChange(index, "quantity", e.target.value)
          }
        />
      </TableCell>
      <TableCell>
        <p className="text-center">{product?.unit || "-"}</p>
      </TableCell>
      <TableCell>
        <Input
          placeholder="Rate"
          type="number"
          value={product?.rate}
          onChange={(e) => handleProductChange(index, "rate", e.target.value)}
        />
      </TableCell>
      <TableCell>
        <Input
          placeholder="Remarks"
          value={product?.remarks || ""}
          onChange={(e) =>
            handleProductChange(index, "remarks", e.target.value)
          }
        />
      </TableCell>
      <TableCell>
        <p className="text-center font-medium">{totalValue.toFixed(2)}</p>
      </TableCell>
      <TableCell>
        {product?.customAdded && (
          <button onClick={() => removeProduct(index)}>
            <X size={18} />
          </button>
        )}
      </TableCell>
    </TableRow>
  );
};

const dfData: OpeningBalanceData = {
  opningBalanceId: "",
  createdAt: new Date(),
  remarks: "",
  product: [
    {
      groupId: "",
      productId: "",
      quantity: 0,
      rate: 0,
      unit: "-",
      remarks: "",
    },
  ],
};

const CreateOpningBalance = () => {
  const [input, setInput] = useState<OpeningBalanceData>(dfData);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const { mutate: muForId } = useSWR(
    open ? "opening-balance-id" : null,
    getOplanceBalanceNumber,
    {
      onSuccess: (data) => {
        setInput((prev) => ({
          ...prev,
          opningBalanceId: `${data}`,
        }));
      },
    },
  );

  const { mutate: muForProductStock, isLoading } = useSWR(
    open ? "current-stock" : null,
    getAllCurrentStock,
    {
      onSuccess: (data) => {
        setInput((prev) => ({
          ...prev,
          product:
            data?.map((item: any) => ({
              groupId: item?.product?.group?.id,
              productId: item?.product?.id,
              quantity: item?.quantity,
              rate: item?.rate,
              unit: item?.product?.unit?.name,
              remarks: item?.remarks || "",
            })) || [],
        }));
      },
    },
  );

  const handleProductChange = (
    index: number,
    field: keyof ProductItem,
    value: string,
    data?: any,
  ) => {
    setInput((prev) => {
      const updatedProducts = [...prev.product];

      if (field === "productId" && data) {
        updatedProducts[index] = {
          ...updatedProducts[index],
          [field]: value,
          unit: data?.unit?.name || "-",
        };
      } else {
        updatedProducts[index] = {
          ...updatedProducts[index],
          [field]:
            field === "groupId" || field === "productId" || field === "unit"
              ? value
              : Number(value),
        };
      }
      setIsEdit(true);
      return {
        ...prev,
        product: updatedProducts,
      };
    });
  };

  const addProduct = () => {
    setInput((prev) => ({
      ...prev,
      product: [
        ...prev.product,
        {
          groupId: "",
          productId: "",
          quantity: 0,
          rate: 0,
          unit: "-",
          remarks: "",
          customAdded: true,
        },
      ],
    }));
  };

  const removeProduct = (index: number) => {
    setInput((prev) => {
      if (prev.product.length <= 1) {
        return prev;
      }
      const updatedProducts = [...prev.product];
      updatedProducts.splice(index, 1);
      return {
        ...prev,
        product: updatedProducts,
      };
    });
  };
  const { loading, mutate } = useMutate();
  const hendelSubmit = async () => {
    if (!isEdit) {
      toast.error("No changes made to save.");
      return;
    }
    try {
      const data = openingBalance.safeParse(input);

      if (!data.success) {
        toast.error(validateError(data));
        return;
      }

      await mutate({
        data: input,
        sendData: saveOpeningBalance,
        next: () => {
          setOpen(false);
          setInput(dfData);
        },
      });
    } catch (error: any) {
      console.error("Error creating opening balance:", error);
      toast.error(error?.message || "Failed to create opening balance");
    }
  };

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <AddButton>New Opening Balance</AddButton>
      </CredenzaTrigger>
      <CredenzaContent className="md:max-w-4xl">
        <CredenzaHeader>
          <CredenzaTitle>Create New Opening balance.</CredenzaTitle>
          <CredenzaDescription> </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <InputWithLabel
              title="Opening Balance id"
              value={input?.opningBalanceId}
              onChange={(e) =>
                setInput({ ...input, opningBalanceId: e.target.value })
              }
              placeholder="Enter Opening Balance id"
              disabled
            />
            <InputWithLabel
              title="Created At"
              type="date"
              disabled
              value={input?.createdAt?.toISOString().split("T")[0]}
              onChange={(e) =>
                setInput({
                  ...input,
                  createdAt: new Date(e.target.value),
                })
              }
            />
            <InputWithLabel
              title="Remark"
              placeholder="Enter remarks"
              defaultValue={input?.remarks}
              onChange={(e) =>
                setInput({
                  ...input,
                  remarks: e.target.value,
                })
              }
            />
          </div>

          {isLoading ? (
            <Loader2 className="mx-auto mt-5 animate-spin" />
          ) : (
            <div className="mt-3">
              <h1 className="text-center font-semibold">
                Set products for current stock
              </h1>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[5%]">SL</TableHead>
                    <TableHead className="w-[12%]">Group</TableHead>
                    <TableHead className="w-[16%]">Product</TableHead>
                    <TableHead className="w-[10%]">Quantity</TableHead>
                    <TableHead className="w-[8%] text-center">Unit</TableHead>
                    <TableHead className="w-[10%]">Rate</TableHead>
                    <TableHead className="w-[15%]">Remarks</TableHead>
                    <TableHead className="w-[12%] text-center">
                      Total Value
                    </TableHead>
                    <TableHead className="w-[5%]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {input?.product?.map((product, index) => (
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

              {/* Display grand total at the bottom */}
              <div className="mt-3 flex">
                <div className="rounded-md p-2">
                  <span className="font-semibold">Grand Total: </span>
                  <span className="font-bold">
                    {input?.product
                      ?.reduce(
                        (sum, item) =>
                          sum + (item?.quantity || 0) * (item?.rate || 0),
                        0,
                      )
                      .toFixed(2)}
                  </span>
                </div>
              </div>

              <AddButton
                size="sm"
                variant="outline"
                onClick={addProduct}
                className="mt-3"
              >
                Add Product
              </AddButton>
            </div>
          )}
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button>Close</Button>
          </CredenzaClose>
          <Button
            onClick={() => {
              muForId();
              muForProductStock();
            }}
          >
            Refresh
          </Button>
          <LoadingButton disabled={loading} onClick={hendelSubmit}>
            Save
          </LoadingButton>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};

export default CreateOpningBalance;
