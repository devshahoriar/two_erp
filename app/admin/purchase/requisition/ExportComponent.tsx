/* eslint-disable @typescript-eslint/no-explicit-any */
import SelectAndFetch from "@/components/shared/SelectAndFetch";
import { getAllReqForSelect } from "./action";

const RequisitionSelect = ({ setValue, value, groupId, ...props }: any) => {
  return (
    <SelectAndFetch
      title="Requisition"
      width="100%"
      groupId={groupId}
      fetchFunction={getAllReqForSelect}
      value={value}
      setValue={setValue}
      {...props}
    />
  );
};

export default RequisitionSelect;
