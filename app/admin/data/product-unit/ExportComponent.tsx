/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import SelectAndFetch from "@/components/shared/SelectAndFetch";
import { getProductUnitForSelect } from "./action";

export const ProductUnitSelect = ({
  setValue,
  value,
  ...props
}: any) => {
  return (
    <SelectAndFetch
      title="Unit"
      fetchFunction={getProductUnitForSelect}
      value={value}
      setValue={setValue}
      width="100%"
      {...props}
    />
  );
};
