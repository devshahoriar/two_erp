/* eslint-disable @typescript-eslint/no-explicit-any */
import SelectAndFetch from "@/components/shared/SelectAndFetch";
import { getAllChallanForSelect } from "./action";

const SalesChallanSelect = ({ setValue, value, ...props }: any) => {
  return (
    <SelectAndFetch
      title="Challan"
      width="100%"
      fetchFunction={getAllChallanForSelect}
      value={value}
      setValue={setValue}
      {...props}
    />
  );
};

export default SalesChallanSelect;
