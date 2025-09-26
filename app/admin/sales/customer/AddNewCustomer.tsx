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
import { newCustomerType } from "./type";
import { newCustomer } from "./action";

const dfData = {
  code: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  note: "",
};

const AddNewCustomer = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(dfData);
  const { refresh } = useRouter();
  const { loading, mutate } = useMutate();

  const _handleAdd = async () => {
    const inputs = newCustomerType.safeParse(input);
    if (!inputs.success) {
      return toast.error(validateError(inputs));
    }
    mutate({
      data: inputs.data,
      sendData: newCustomer,
      next() {
        setOpen(false);
        refresh();
      },
    });
  };
  
  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <AddButton>Add Customer</AddButton>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add new Customer</CredenzaTitle>
          <CredenzaDescription> </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <InputWithLabel
            value={input.code}
            onChange={(e) => setInput({ ...input, code: e.target.value })}
            title="Customer code"
            className="mt-0"
            placeholder="Enter Customer code"
          />
          <InputWithLabel
            value={input.name}
            onChange={(e) => setInput({ ...input, name: e.target.value })}
            title="Customer name"
            placeholder="Enter Customer name"
          />
          <InputWithLabel
            value={input.address}
            onChange={(e) => setInput({ ...input, address: e.target.value })}
            title="Customer address"
            placeholder="Enter Customer address"
          />
          <InputWithLabel
            value={input.email}
            onChange={(e) => setInput({ ...input, email: e.target.value })}
            title="Customer email"
            placeholder="Enter Customer email"
          />
          <InputWithLabel
            value={input.phone}
            onChange={(e) => setInput({ ...input, phone: e.target.value })}
            title="Customer phone"
            placeholder="Enter Customer phone"
          />
          <InputWithLabel
            value={input.note}
            onChange={(e) => setInput({ ...input, note: e.target.value })}
            title="Customer note"
            placeholder="Enter Customer note"
          />
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button>Close</Button>
          </CredenzaClose>
          <LoadingButton disabled={loading} onClick={_handleAdd}>
            Add
          </LoadingButton>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};

export default AddNewCustomer;