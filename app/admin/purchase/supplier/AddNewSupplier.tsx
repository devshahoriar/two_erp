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
import { validateError } from "@/lib/utils";
import { useRouter } from "next/navigation";

import React, { useState } from "react";
import { toast } from "sonner";
import { newSupllayerType } from "./type";
import { newSupplayer } from "./action";

const dfData = {
  code: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  note: "",
};

const AddNewSupplier = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(dfData);
  const { refresh } = useRouter();
  const { loading, mutate } = useMutate();

  const _hendelAdd = async () => {
    const inputs = newSupllayerType.safeParse(input);
    if (!inputs.success) {
      return toast.error(validateError(inputs));
    }
    mutate({
      data: inputs.data,
      sendData: newSupplayer,
      next() {
        setOpen(false);
        refresh();
      },
    });
  };
  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <AddButton>Add Supplier</AddButton>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add new Supplayer</CredenzaTitle>
          <CredenzaDescription> </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
        <InputWithLabel
            value={input.code}
            onChange={(e) => setInput({ ...input, code: e.target.value })}
            title="Supplier code"
            className="mt-0"
            placeholder="Enter Supplier code"
          />
          <InputWithLabel
            value={input.name}
            onChange={(e) => setInput({ ...input, name: e.target.value })}
            
            title="Supplier name"
            placeholder="Enter Supplier name"
          />
          <InputWithLabel
            value={input.address}
            onChange={(e) => setInput({ ...input, address: e.target.value })}
            title="Supplier address"
            placeholder="Enter Supplier address"
          />
          <InputWithLabel
            value={input.email}
            onChange={(e) => setInput({ ...input, email: e.target.value })}
            title="Supplier email"
            placeholder="Enter Supplier email"
          />
          <InputWithLabel
            value={input.phone}
            onChange={(e) => setInput({ ...input, phone: e.target.value })}
            title="Supplier phone"
            placeholder="Enter Supplier phone"
          />
          
          <InputWithLabel
            value={input.note}
            onChange={(e) => setInput({ ...input, note: e.target.value })}
            title="Supplier note"
            placeholder="Enter Supplier note"
          />
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

export default AddNewSupplier;
