/* eslint-disable @typescript-eslint/no-explicit-any */
import SelectAndFetch from "@/components/shared/SelectAndFetch";
import { getProductForSelect } from "./action";

const ProductSelect = ({ setValue, value, groupId,...props }: any) => {

  return (
    <SelectAndFetch
      title="Product"
      width="100%"
      groupId={groupId}
      fetchFunction={getProductForSelect}
      value={value}
      setValue={setValue}
      {...props}
    />
  );
};

export default ProductSelect;
