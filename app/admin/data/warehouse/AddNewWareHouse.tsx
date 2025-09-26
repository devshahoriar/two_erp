/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AddButton, LoadingButton } from "@/components/shared/CustomButton";
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
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/ui/input";
import useMutate from "@/hooks/useMutate";
import { validateError } from "@/lib/utils";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";
import { BranchSelect } from "../branch/ExportComponent";
import { createWareHouse } from "./action";
import { newBranceType } from "./type";

const dfInput = {
  name: "",
  location: "",
  branchId: "",
};

const AddNewWareHouse = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(dfInput);
  const { loading, mutate } = useMutate();
  const _handelSave = async () => {
    const data = newBranceType.safeParse(input);
    if (!data.success) {
      return toast.error(validateError(data));
    }
    await mutate({
      data: input,
      sendData: createWareHouse,
      next: () => {
        setInput(dfInput);
        setOpen(false);
      },
    });
  };
  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <AddButton>New Warehouse</AddButton>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add new warehouse</CredenzaTitle>
          <CredenzaDescription> </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <InputWithLabel
            value={input.name}
            onChange={(e) => setInput({ ...input, name: e.target.value })}
            className="mt-0"
            title="Warehouse name"
            placeholder="Enter Warehouse name"
          />
          <InputWithLabel
            onChange={(e) => setInput({ ...input, location: e.target.value })}
            value={input.location}
            title="Warehouse location"
            placeholder="Enter Warehouse location"
          />
          <div className={"mt-3 flex flex-col gap-2"}>
            <Label>Branch</Label>
            <BranchSelect
              width="100%"
              value={input.branchId}
              setValue={(v:any) => {
                setInput({
                  ...input,
                  branchId: v+'',
                });
              }}
            />
          </div>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button>Close</Button>
          </CredenzaClose>
          <LoadingButton disabled={loading} onClick={_handelSave}>
            Save
          </LoadingButton>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};

export default AddNewWareHouse;
