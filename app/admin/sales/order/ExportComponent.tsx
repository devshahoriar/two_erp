/* eslint-disable @typescript-eslint/no-explicit-any */
import SelectAndFetch from "@/components/shared/SelectAndFetch";
import { getAllOrderForSelect } from "./action";

const SalesOrderSelect = ({ setValue, value, ...props }: any) => {
  return (
    <SelectAndFetch
      title="Order"
      width="100%"
      fetchFunction={getAllOrderForSelect}
      value={value}
      setValue={setValue}
      {...props}
    />
  );
};

export default SalesOrderSelect;
