/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
import { InputWithLabel } from "@/components/ui/input";
import useMutate from "@/hooks/useMutate";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductGroupSelect } from "../product-group/ExportComponents";
import { ProductUnitSelect } from "../product-unit/ExportComponent";
import { newProductType } from "./type";
import { toast } from "sonner";
import { validateError } from "@/lib/utils";
import { createNewProduct } from "./action";
import { Label } from "@/components/ui/label";

const dfData = {
  itemCode: "",
  name: "",
  description: "",
  unitId: "",
  groupId: "",
};

const AddNewProduct = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(dfData);
  const { refresh } = useRouter();
  const { loading, mutate } = useMutate();

  const _hendelAdd = async () => {
    const inputs = newProductType.safeParse(input);
    if (!inputs.success) {
      return toast.error(validateError(inputs));
    }
    await mutate({
      data: inputs.data,
      sendData: createNewProduct,
      next() {
        setOpen(false);
        setInput(dfData);
        refresh();
      },
    });
  };
  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <AddButton>New Product</AddButton>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add your new Product</CredenzaTitle>
          <CredenzaDescription> </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <InputWithLabel
            value={input.itemCode}
            onChange={(e) => setInput({ ...input, itemCode: e.target.value })}
            className="mt-0"
            title="Product code"
            placeholder="Enter Product code"
          />
          <InputWithLabel
            onChange={(e) => setInput({ ...input, name: e.target.value })}
            value={input.name}
            title="Product name"
            placeholder="Enter Product name"
          />

          <InputWithLabel
            onChange={(e) =>
              setInput({ ...input, description: e.target.value })
            }
            value={input.description}
            title="Product description"
            placeholder="Enter Product description"
          />

          <div className="mt-3 flex flex-col gap-2">
            <Label>Product Unit</Label>
            <ProductUnitSelect
              setValue={(v:any) => setInput({ ...input, unitId: v+'' })}
              value={input.unitId}
            />
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <Label>Product Group</Label>
            <ProductGroupSelect
              setValue={(v:any) => setInput({ ...input, groupId: v+'' })}
              value={input.groupId}
              className="!w-[100px]"
            />
          </div>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button>Close</Button>
          </CredenzaClose>
          <LoadingButton disabled={loading} onClick={_hendelAdd}>
            Add
          </LoadingButton>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};

export default AddNewProduct;
