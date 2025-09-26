"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ComponentProps, useState } from "react";
import { RefreshCcwDot } from "lucide-react";

export const LoadingButton = ({
  disabled,
  children,
  size = "sm",
  className,
  ...props
}: ComponentProps<typeof Button>) => {
  return (
    <Button
      size={size}
      {...props}
      className={cn("active:scale-[0.98]", className)}
    >
      <div className="relative">
        <Loader2
          className={cn(
            "absolute top-0 right-0 bottom-0 left-0 m-auto opacity-0 transition-opacity",
            disabled && "animate-spin opacity-100",
          )}
        />

        <span
          className={cn(
            "opacity-100 transition-opacity",
            disabled && "opacity-0",
          )}
        >
          {children}
        </span>
      </div>
    </Button>
  );
};

export const RefreshButton = () => {
  const [loading, setLoading] = useState(false);
  const { refresh } = useRouter();
  return (
    <LoadingButton
      onClick={() => {
        setLoading(true);
        refresh();
        setTimeout(() => {
          setLoading(false);
        }, 2500);
      }}
      disabled={loading}
    >
      <RefreshCcwDot className={cn("md:hidden", loading && "animate-spin")} />
      <span className="hidden md:block">Refresh</span>
    </LoadingButton>
  );
};

export const AddButton = ({
  children,
  ...props
}: ComponentProps<typeof Button>) => {
  return (
    <Button {...props}>
      <>
        <PlusCircle className="md:hidden" />
        <span className="hidden md:block">{children}</span>
      </>
    </Button>
  );
};
