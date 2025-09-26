/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";



import SelectAndFetch from "@/components/shared/SelectAndFetch";
import { getProductGroupForSelect } from "./action";

export const ProductGroupSelect = ({ setValue, value, ...p }: any) => {
  return (
    <SelectAndFetch
      title="Group"
      width="100%"
      fetchFunction={getProductGroupForSelect}
      value={value}
      setValue={setValue}
      {...p}
    />
  );
};
