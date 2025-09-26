/* eslint-disable @typescript-eslint/no-explicit-any */
import SelectAndFetch from "@/components/shared/SelectAndFetch";
import { getSuppForSelect } from "./action";

const SupplierSelect = ({ setValue, value, groupId, ...props }: any) => {
  return (
    <SelectAndFetch
      title="Supplier"
      width="100%"
      groupId={groupId}
      fetchFunction={getSuppForSelect}
      value={value}
      setValue={setValue}
      {...props}
    />
  );
};

export default SupplierSelect;
