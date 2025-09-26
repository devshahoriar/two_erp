/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/use-debounce";
import useSWR from "swr";
import { Input } from "../ui/input";

export type SelectAndFetchProps = {
  width?: string;
  title?: string;
  groupId?: string;
  fetchFunction: (
    search?: string,
    groupId?: string,
  ) => Promise<{ id: string; name: string } | any>;
  value: string;
  setValue: (value: string, data?: any) => void;
  disabled?: boolean;
};

function SelectAndFetch({
  width = "200px",
  title,
  fetchFunction,
  setValue,
  value,
  groupId,
  disabled
}: SelectAndFetchProps) {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const dInput = useDebounce(input, 500);
  const key = `${title}-${dInput}-${groupId}`;
  const { data, isLoading, mutate } = useSWR(
    key,
    async () => await fetchFunction(dInput, groupId),
    {
      onSuccess(data) {
        localStorage.setItem(key, JSON.stringify(data));
      },
      fallbackData: JSON.parse(localStorage.getItem(key) || "[]"),
    },
  );
  React.useEffect(() => {
    if (dInput.length >= 1) setValue?.("");
    mutate();
  }, [dInput]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          style={{ width: width }}
          className="justify-between bg-transparent"
          disabled={disabled}
        >
          {value
            ? data?.find((item: any) => item.id == value)?.name 
            : `Select ${title || ""}`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent style={{ width: width }} className="p-2">
        <Input
          className="h-8 py-0 focus-visible:ring-0"
          placeholder="Search.."
          onChange={(e) => {
            setInput(e.target.value);
          }}
          value={input}
        />

        <div className="mt-1 space-y-1">
          {data?.length === 0 ? (
            <p className="text-center">No {title}.</p>
          ) : (
            data?.map((item: any) => (
              <button
                className="hover:bg-accent/80 flex w-full items-center px-2 py-1 text-start"
                key={item.id}
                onClick={() => {
                  if (value == item.id) {
                    setValue?.("");
                    setOpen(false);
                    return;
                  }
                  setValue?.(item.id, item);
                  setOpen(false);
                }}
              >
                <span className="mr-2 size-3">
                  {value == item.id && <Check size={15} />}
                </span>
                {item.name}
              </button>
            ))
          )}
        </div>
        {isLoading && (
          <div className="mt-1 flex items-center justify-center">
            <Loader2 className="animate-spin" size={15} />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default SelectAndFetch;
