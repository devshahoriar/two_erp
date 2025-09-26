"use client";

import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/Credenza";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { LoadingButton } from "./CustomButton";

const currentYear = new Date().getFullYear();
const years = [currentYear - 1, currentYear];
const currentMonth = new Date().getMonth();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getMonthName = (monthNumber: string) => {
  const index = parseInt(monthNumber) - 1;
  return months[index] || "Select month";
};

export const MonthSelect = ({
  value,
  onValueChange,
}: {
  value?: string;
  onValueChange: (value: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Label>Month</Label>
      <Select value={value || currentMonth + ""} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue>{getMonthName(value || currentMonth + "")}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {months.map((month, index) => (
            <SelectItem key={index} value={(index + 1).toString()}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export const YearSelect = ({
  value,
  onValueChange,
}: {
  value?: string;
  onValueChange: (value: string) => void;
}) => {
  return (
    <div className="mt-3 flex flex-col gap-2">
      <Label>Year</Label>
      <Select value={value || currentYear + ""} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export const FileTypeSelect = ({
  value,
  onValueChange,
}: {
  value?: string;
  onValueChange: (value: string) => void;
}) => {
  return (
    <div className="mt-3 flex flex-col gap-2">
      <Label>File Type</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={"pdf"}>PDF</SelectItem>
          <SelectItem value={"excel"}>EXCEL</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

const AdminPageFilter = () => {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const month = searchParams.get("month") || (currentMonth + 1).toString();
  const year = searchParams.get("year") || currentYear.toString();
  const [selectedMonth, setSelectedMonth] = useState<string>(
    Number(month) <= 12 ? month : (currentMonth + 1).toString(),
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    years.includes(parseInt(year)) ? year : currentYear.toString(),
  );

  const [loading, setLoading] = useState(false);

  const pathname = usePathname();
  const { replace } = useRouter();

  const _hendelChange = () => {
    const params = new URLSearchParams(searchParams);

    params.set("month", selectedMonth);
    params.set("year", selectedYear);

    replace(`${pathname}?${params.toString()}`);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 1300);
  };

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button>
          <span className="hidden md:block">Filter</span>
          <SlidersHorizontal className="md:hidden" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Select month and year.</CredenzaTitle>
          <CredenzaDescription> </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <MonthSelect onValueChange={setSelectedMonth} value={selectedMonth} />
          <YearSelect onValueChange={setSelectedYear} value={selectedYear} />
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button>Close</Button>
          </CredenzaClose>
          <LoadingButton disabled={loading} onClick={_hendelChange}>
            Apply
          </LoadingButton>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};

export default AdminPageFilter;
