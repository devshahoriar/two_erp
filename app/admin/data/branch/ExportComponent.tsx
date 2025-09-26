/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import SelectAndFetch from "@/components/shared/SelectAndFetch";
import { getBrancesForSelect } from "./action";

export const BranchSelect = ({ setValue, value, ...props }: any) => {
  return (
    <SelectAndFetch
    width="100%"
      title="Branch"
      fetchFunction={getBrancesForSelect}
      value={value}
      setValue={setValue}
      {...props}
    />
  );
};
