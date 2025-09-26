/* eslint-disable @typescript-eslint/no-explicit-any */
import SelectAndFetch from "@/components/shared/SelectAndFetch";
import { getAllInvoicesForSelect } from "./action";

const PurchaseInvoiceSelect = ({ setValue, value, ...props }: any) => {
  return (
    <SelectAndFetch
      title="Invoice"
      width="100%"
      fetchFunction={getAllInvoicesForSelect}
      value={value}
      setValue={setValue}
      {...props}
    />
  );
};

export default PurchaseInvoiceSelect;
