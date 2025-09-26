/* eslint-disable @typescript-eslint/no-explicit-any */
import { AsyncSelect } from "../ui/async-select";

type PROPS_ASYNCSELECT = {
  title?: string;
  className?: string;
  fetchData: (
    input?: string,
  ) => Promise<Array<{ name: string; id: number } | any>>;
  label?: string;
  value: string;
  setValue: (value: string, data?: any) => void;
  triggerClassName?: string;
  optionWidth?: string;
};

export type ASYNCSELECT = Omit<
  PROPS_ASYNCSELECT,
  "fetchData"
>;

const SelectComponent = ({
  title,
  className,
  fetchData,
  label,
  setValue,
  value,
  triggerClassName,
}: PROPS_ASYNCSELECT) => {
  return (
    <>
      <AsyncSelect
        fetcher={fetchData}
        renderOption={(item) => <>{item.name}</>}
        getOptionValue={(item) => item.id + ""}
        getDisplayValue={(item) => item.name}
        label={label ? label : ""}
        value={value}
        onChange={setValue}
        className={className}
        triggerClassName={triggerClassName}
        placeholder={title ? `Select ${title}` : "Select"}
      />
    </>
  );
};

export default SelectComponent;
