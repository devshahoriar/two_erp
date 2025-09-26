/* eslint-disable @typescript-eslint/no-explicit-any */
import SelectAndFetch from "@/components/shared/SelectAndFetch";
import { getAllQuotationsForSelect } from "./action";

const QuotationSelect = ({ setValue, value, ...props }: any) => {
  return (
    <SelectAndFetch
      title="Quotation"
      width="100%"
      fetchFunction={getAllQuotationsForSelect}
      value={value}
      setValue={setValue}
      {...props}
    />
  );
};

export default QuotationSelect;
