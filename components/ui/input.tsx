/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./label";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

const InputWithLabel = ({
  title,
  className,
  placeholder,
  value,
  onChange,

  ...props
}: React.ComponentProps<typeof Input>) => {
  return (
    <div className={cn("mt-3 flex flex-col gap-2", className)}>
      <Label>{title}</Label>

      <Input
        {...props}
        data-date-format="DD MMMM YYYY"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export { Input, InputWithLabel };
