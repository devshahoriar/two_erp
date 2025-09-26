/* eslint-disable @typescript-eslint/no-explicit-any */
import SelectAndFetch from "@/components/shared/SelectAndFetch";
import { getWareHouseForSelect } from "./action";

const WarehouseSelect = ({ setValue, value, groupId, ...props }: any) => {
  return (
    <SelectAndFetch
      title="Warehouse"
      width="100%"
      groupId={groupId}
      fetchFunction={getWareHouseForSelect}
      value={value}
      setValue={setValue}
      {...props}
    />
  );
};

export default WarehouseSelect;
