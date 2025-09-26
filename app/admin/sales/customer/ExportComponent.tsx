/* eslint-disable @typescript-eslint/no-explicit-any */
import SelectAndFetch from "@/components/shared/SelectAndFetch";
import { getAllCustomerForSelect } from "./action";

const SelectCustomers = ({ setValue, value, ...props }: any) => {
  return (
    <SelectAndFetch
      title="Customers"
      width="100%"
      fetchFunction={getAllCustomerForSelect}
      value={value}
      setValue={setValue}
      {...props}
    />
  );
};

export default SelectCustomers;
