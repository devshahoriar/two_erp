/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  FileTypeSelect,
  MonthSelect,
  YearSelect,
} from "@/components/shared/AdminPageFilter";
import { LoadingButton } from "@/components/shared/CustomButton";
import {
  PrintHeader,
  tableToExcel,
  tableToPdf,
} from "@/components/shared/PrintTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { getDtaforPurchesReport } from "./action";

// Interface for normalized data
interface NormalizedProduct {
  id: number;
  name: string;
  unit: string;
  openingStock: number;
  receivedQuantity: number; // This will be calculated based on currentStock - openingStock
  currentStock: number;
  rate: number;
  discount: number; // This would come from the API, using 0 as default
  actualRate: number; // This will be calculated as rate - discount
  stockValue: number; // This will be calculated as currentStock * actualRate
}

// Function to normalize data
const normalizeData = (data: any): NormalizedProduct[] => {
  const { opningStock, currentStock } = data;

  // Create a map of products from opening stock
  const productsMap: Record<number, NormalizedProduct> = {};

  // Process opening stock
  opningStock[0]?.OpeningBalanceItem.forEach((item: any) => {
    productsMap[item.product.id] = {
      id: item.product.id,
      name: item.product.name,
      unit: item.product.unit.name,
      openingStock: item.quantity,
      receivedQuantity: 0, // Will calculate later
      currentStock: 0, // Will update from current stock data
      rate: 0, // Will update from current stock data
      discount: 0, // Default value
      actualRate: 0, // Will calculate later
      stockValue: 0, // Will calculate later
    };
  });

  // Update with current stock data

  currentStock.forEach((item: any) => {
    const productId = item.product.id;

    // If product exists in the map, update it
    if (productsMap[productId]) {
      productsMap[productId].currentStock = item.quantity;
      productsMap[productId].rate = item.rate;
      // Calculate received quantity (current - opening)
      productsMap[productId].receivedQuantity =
        item.quantity - productsMap[productId].openingStock;
      // Calculate actual rate (considering discount)
      productsMap[productId].actualRate =
        item.rate - productsMap[productId].discount;
      // Calculate stock value
      productsMap[productId].stockValue =
        item.quantity * productsMap[productId].actualRate;
    }
    // If product doesn't exist in opening stock, create new entry
    else {
      productsMap[productId] = {
        id: item.product.id,
        name: item.product.name,
        unit: item.product.unit.name,
        openingStock: 0,
        receivedQuantity: item.quantity,
        currentStock: item.quantity,
        rate: item.rate,
        discount: 0,
        actualRate: item.rate, // No discount
        stockValue: item.quantity * item.rate,
      };
    }
  });

  // Convert the map to array and sort by product name
  return Object.values(productsMap).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
};

const PrintPurchaseReport = () => {
  const [inputs, setInputs] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    fileType: "pdf",
  });

  const tableRef = useRef<HTMLTableElement>(null);
  const [data, setData] = useState<NormalizedProduct[]>([]);
  const [loading, setloading] = useState(false);

  const hendelPrint = async () => {
    try {
      setloading(true);
      const rawData = await getDtaforPurchesReport(inputs.month, inputs.year);
      if (
        rawData?.opningStock?.length === 0 ||
        rawData?.currentStock?.length === 0
      ) {
        toast.error("No data found!");
        setloading(false);
        return;
      }

      const normalizedData = normalizeData(rawData);
      setData(normalizedData);
      setloading(false);

      setTimeout(() => {
        const title = `Purchase Report ${inputs.month}-${inputs.year}`;
        if (inputs?.fileType === "pdf") {
          tableToPdf(title);
        } else {
          tableToExcel(tableRef as any, title);
        }
      }, 300);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message ? error?.message : "Something went wrong!");
    }
  };

  return (
    <>
      <div className="flex h-[90vh] items-center justify-center print:hidden">
        <Card className="w-[500px]">
          <CardHeader>
            <CardTitle>Purchase Report</CardTitle>
            <CardDescription>Fill information.</CardDescription>
          </CardHeader>
          <CardContent>
            <MonthSelect
              value={inputs.month + ""}
              onValueChange={(v) =>
                setInputs({
                  ...inputs,
                  month: Number.parseInt(v),
                })
              }
            />

            <YearSelect
              value={inputs.year + ""}
              onValueChange={(v) =>
                setInputs({
                  ...inputs,
                  year: Number.parseInt(v),
                })
              }
            />
            <FileTypeSelect
              value={inputs.fileType}
              onValueChange={(v) =>
                setInputs({
                  ...inputs,
                  fileType: v,
                })
              }
            />
          </CardContent>
          <CardFooter className="justify-center">
            <LoadingButton disabled={loading} onClick={hendelPrint}>
              Save
            </LoadingButton>
          </CardFooter>
        </Card>
      </div>

      <div className="hidden px-4 pt-5 print:block">
        <PrintHeader
          title="Purchase Report"
          reportDate={new Date(`${inputs.month}-01-${inputs.year}`)}
        />
        <Table className="w-full" ref={tableRef}>
          <TableHeader className="text-center">
            <TableRow>
              <TableCell>
                Sl.
                <br /> No.
              </TableCell>
              <TableCell>
                Product
                <br /> Name
              </TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>
                Opening <br />
                Stock
              </TableCell>
              <TableCell>
                Total
                <br /> Rcv <br />
                Quantity
              </TableCell>
              <TableCell>
                Current
                <br /> Stock
              </TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>
                Actual
                <br /> Rate
              </TableCell>
              <TableCell>
                Stock
                <br /> Product
                <br /> Value
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data && data.length > 0 ? (
              <>
                {data.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.openingStock}</TableCell>
                    <TableCell>{item.receivedQuantity}</TableCell>
                    <TableCell>{item.currentStock}</TableCell>
                    <TableCell>{item.rate}</TableCell>
                    <TableCell>{item.discount}</TableCell>
                    <TableCell>{item.actualRate}</TableCell>
                    <TableCell>{item.stockValue.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-slate-100 font-bold">
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell>
                    {data.reduce((sum, item) => sum + item.openingStock, 0)}
                  </TableCell>
                  <TableCell>
                    {data.reduce((sum, item) => sum + item.receivedQuantity, 0)}
                  </TableCell>
                  <TableCell>
                    {data.reduce((sum, item) => sum + item.currentStock, 0)}
                  </TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell>
                    {data
                      .reduce((sum, item) => sum + item.stockValue, 0)
                      .toFixed(2)}
                  </TableCell>
                </TableRow>
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  No data available. Please generate the report first.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default PrintPurchaseReport;
