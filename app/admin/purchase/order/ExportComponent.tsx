/* eslint-disable @typescript-eslint/no-explicit-any */
import SelectAndFetch from "@/components/shared/SelectAndFetch";
import { getAllOrderForSelect } from "./action";

const SelectPurchesOrder = ({ setValue, value, groupId, ...props }: any) => {
  return (
    <SelectAndFetch
      title="Order"
      width="100%"
      groupId={groupId}
      fetchFunction={getAllOrderForSelect}
      value={value}
      setValue={setValue}
      {...props}
    />
  );
};

export default SelectPurchesOrder;
