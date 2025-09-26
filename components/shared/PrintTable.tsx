/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { format } from "date-fns";
import { RefObject } from "react";
import { toast } from "sonner";
import { utils, writeFileXLSX } from "xlsx";

export const PrintHeader = ({
  title,
  reportDate,
}: {
  title: string;
  reportDate: Date;
}) => {
  return (
    <div>
      <h1 className="text-center text-2xl font-bold">
        GLOBAL COMMUNITY ORGANIZATION
      </h1>
      <p className="text-center">Hasan Nagar, Kamrangirchar, Dhaka-1211, +8801715343484</p>
      <div className="flex justify-between">
        <p>Date: {format(new Date(), "dd-MM-yy")}</p>
        <p className="font-semibold">{title}</p>
        <p>Report: {format(new Date(reportDate), "MMM-yy")}</p>
      </div>
    </div>
  );
};

export const tableToExcel = (
  tableRef: RefObject<HTMLTableElement>,
  title: string,
) => {
  const table_elt = tableRef.current;
  if (!table_elt) return toast.error("Table not found!");
  const wb = utils.table_to_book(table_elt);
  writeFileXLSX(wb, `${title}.xlsx`);
};

export const tableToPdf = (title: string) => {
  document.title = title;
  window.print();
};
