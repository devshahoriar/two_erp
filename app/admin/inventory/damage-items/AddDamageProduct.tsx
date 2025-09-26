/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AddButton } from "@/components/shared/CustomButton";
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
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { ProductGroupSelect } from "../../data/product-group/ExportComponents";
import ProductSelect from "../../data/products/ExportComponent";
import { InputWithLabel } from "@/components/ui/input";
import WarehouseSelect from "../../data/warehouse/ExportComponent";
import { toast } from "sonner";
import { DamageItemSchema } from "./type";
import { validateError } from "@/lib/utils";
import useMutate from "@/hooks/useMutate";
import { createDamageProduct } from "./action";
import { useRouter } from "next/navigation";

const AddDamageProduct = () => {
  const [open, setOpen] = useState(false);
  const { loading, mutate } = useMutate();

  const [input, setInput] = useState({
    groupId: "",
    productId: "",
    quentity: 0,
    rate: 0,
    warehouseId: "",
    remark: "",
  });
  const router = useRouter();
  const _hendelDamage = async () => {
    try {
      const data = DamageItemSchema.safeParse(input);

      if (!data.success) {
        toast.error(validateError(data));
        return;
      }
      const newDamaseProduct = data.data;
      await mutate({
        data: newDamaseProduct,
        sendData: createDamageProduct,
        next: () => {
          router.refresh();
          setOpen(false);
        },
      });
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong!");
      console.log(error);
    }
  };
  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <AddButton>Add</AddButton>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add your damage product</CredenzaTitle>
          <CredenzaDescription>
            Add product damage information to your inventory.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Product Group</Label>
              <ProductGroupSelect
                value={input.groupId + ""}
                setValue={(value: string) => {
                  setInput((prev) => ({
                    ...prev,
                    groupId: value + "",
                    productId: "",
                  }));
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Product</Label>
              <ProductSelect
                groupId={input?.groupId}
                value={input.productId}
                setValue={(value: string) => {
                  setInput((prev) => ({
                    ...prev,
                    productId: value + "",
                  }));
                }}
              />
            </div>
            <InputWithLabel
              placeholder="Quantity"
              title="Quantity"
              value={input.quentity}
              onChange={(v) =>
                setInput((p) => ({ ...p, quentity: Number(v.target.value) }))
              }
            />
            <InputWithLabel
              placeholder="Rate"
              title="Rate"
              value={input.rate}
              onChange={(v) =>
                setInput((p) => ({ ...p, rate: Number(v.target.value) }))
              }
            />

            <div className="space-y-2">
              <Label>Warehouse</Label>
              <WarehouseSelect
                value={input.warehouseId}
                setValue={(value: string) => {
                  setInput((prev) => ({
                    ...prev,
                    warehouseId: value + "",
                  }));
                }}
              />
            </div>
            <InputWithLabel
              placeholder="Remark"
              title="Remark"
              type="text"
              value={input.remark}
              onChange={(v) =>
                setInput((p) => ({ ...p, remark: v.target.value }))
              }
            />
            <InputWithLabel
              placeholder="Date"
              title="Date"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              disabled
            />
          </div>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button>Close</Button>
          </CredenzaClose>
          <Button disabled={loading} onClick={_hendelDamage}>
            Add
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};

export default AddDamageProduct;
