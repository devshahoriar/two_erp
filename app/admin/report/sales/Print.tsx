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
import { useRef, useState, useMemo } from "react";
import { toast } from "sonner";
import { getDataForSalesReport } from "./action";

// Interface for normalized sales data
interface NormalizedSalesProduct {
  id: number;
  name: string;
  unit: string;
  openingStock: number;
  currentStock: number;
  totalSales: number;
  totalReturns: number;
  rate: number;
  salesValue: number;
  actualValue: number;
  stockValue: number;
}

// Function to normalize data
const normalizeData = (data: any): NormalizedSalesProduct[] => {
  const { openingStock, currentStock, salesInvoices, salesReturns } = data;


  const productsMap: Record<number, NormalizedSalesProduct> = {};


  openingStock[0]?.OpeningBalanceItem.forEach((item: any) => {
    productsMap[item.product.id] = {
      id: item.product.id,
      name: item.product.name,
      unit: item.product.unit.name,
      openingStock: item.quantity,
      currentStock: 0, // Will update from current stock data
      totalSales: 0,   // Will update from sales data
      totalReturns: 0, // Will update from returns data
      rate: 0,         // Will update from current stock data
      salesValue: 0,   // Will calculate later
      actualValue: 0,  // Will calculate later
      stockValue: 0,   // Will calculate later
    };
  });

  // Update with current stock data
  currentStock.forEach((item: any) => {
    const productId = item.product.id;

    // If product exists in the map, update it
    if (productsMap[productId]) {
      productsMap[productId].currentStock = item.quantity;
      productsMap[productId].rate = item.rate;
      productsMap[productId].stockValue = item.quantity * item.rate;
    }
    // If product doesn't exist in opening stock, create new entry
    else {
      productsMap[productId] = {
        id: item.product.id,
        name: item.product.name,
        unit: item.product.unit.name,
        openingStock: 0,
        currentStock: item.quantity,
        totalSales: 0,
        totalReturns: 0,
        rate: item.rate,
        salesValue: 0,
        actualValue: 0,
        stockValue: item.quantity * item.rate,
      };
    }
  });

  // Process sales invoices
  salesInvoices.forEach((item: any) => {
    const productId = item.product.id;
    
    if (productsMap[productId]) {
      productsMap[productId].totalSales += item.quantity;
      // Calculate sales value (price * quantity)
      productsMap[productId].salesValue += item.quantity * (item.rate - item.discount);
    } else {
      // If product not found in the map (unlikely case)
      productsMap[productId] = {
        id: item.product.id,
        name: item.product.name,
        unit: "N/A",
        openingStock: 0,
        currentStock: 0,
        totalSales: item.quantity,
        totalReturns: 0,
        rate: item.rate,
        salesValue: item.quantity * (item.rate - item.discount),
        actualValue: 0,
        stockValue: 0,
      };
    }
  });

  // Process sales returns
  salesReturns.forEach((item: any) => {
    const productId = item.product.id;
    
    if (productsMap[productId]) {
      productsMap[productId].totalReturns += item.quantity;
    }
  });

  // Calculate actual value (sales value - returns value)
  Object.values(productsMap).forEach((product) => {
    product.actualValue = product.salesValue - (product.totalReturns * product.rate);
  });

  // Convert the map to array and sort by product name
  return Object.values(productsMap).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};

const PrintSalesReport = () => {
  const [inputs, setInputs] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    fileType: "pdf",
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<NormalizedSalesProduct[]>([]);
  const tableRef = useRef<HTMLTableElement>(null);

  // Optimized calculateTotals function - uses useMemo to avoid recalculation on each render
  const totals = useMemo(() => {
    if (!data || data.length === 0) return null;
    
    return data.reduce((totals, item) => ({
      openingStock: totals.openingStock + item.openingStock,
      currentStock: totals.currentStock + item.currentStock,
      totalSales: totals.totalSales + item.totalSales,
      totalReturns: totals.totalReturns + item.totalReturns,
      salesValue: totals.salesValue + item.salesValue,
      actualValue: totals.actualValue + item.actualValue,
      stockValue: totals.stockValue + item.stockValue,
    }), {
      openingStock: 0,
      currentStock: 0,
      totalSales: 0,
      totalReturns: 0,
      salesValue: 0,
      actualValue: 0,
      stockValue: 0,
    });
  }, [data]);

  const handlePrint = async () => {
    try {
      setLoading(true);
      const rawData = await getDataForSalesReport(inputs.month, inputs.year);
      
      if (
        rawData?.openingStock?.length === 0 ||
        rawData?.currentStock?.length === 0
      ) {
        toast.error("No data found!");
        setLoading(false);
        return;
      }

      const normalizedData = normalizeData(rawData);
      setData(normalizedData);
      setLoading(false);

      setTimeout(() => {
        const title = `Sales Report ${inputs.month}-${inputs.year}`;
        if (inputs?.fileType === "pdf") {
          tableToPdf(title);
        } else {
          tableToExcel(tableRef as any, title);
        }
      }, 300);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message ? error?.message : "Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex h-[90vh] items-center justify-center print:hidden">
        <Card className="w-[500px]">
          <CardHeader>
            <CardTitle>Sales Report</CardTitle>
            <CardDescription>Fill information.</CardDescription>
          </CardHeader>
          <CardContent>
            <MonthSelect
              value={inputs.month + ""}
              onValueChange={(v) =>
                setInputs({
                  ...inputs,
                  month: parseInt(v),
                })
              }
            />

            <YearSelect
              value={inputs.year + ""}
              onValueChange={(v) =>
                setInputs({
                  ...inputs,
                  year: parseInt(v),
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
            <LoadingButton disabled={loading} onClick={handlePrint}>
              Save
            </LoadingButton>
          </CardFooter>
        </Card>
      </div>

      <div className="hidden px-4 pt-5 print:block">
        <PrintHeader
          title="Sales Report"
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
                Opening
                <br /> Stock
              </TableCell>
              <TableCell>
                Current
                <br /> Stock
              </TableCell>
              <TableCell>
                Total
                <br /> Sales
              </TableCell>
              <TableCell>
                Total
                <br /> Return
              </TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>
                Sales
                <br /> Value
              </TableCell>
              <TableCell>
                Actual
                <br /> Value
              </TableCell>
              <TableCell>
                Stock
                <br /> Value
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.openingStock}</TableCell>
                  <TableCell>{item.currentStock}</TableCell>
                  <TableCell>{item.totalSales}</TableCell>
                  <TableCell>{item.totalReturns}</TableCell>
                  <TableCell>{item.rate}</TableCell>
                  <TableCell>{item.salesValue.toFixed(2)}</TableCell>
                  <TableCell>{item.actualValue.toFixed(2)}</TableCell>
                  <TableCell>{item.stockValue.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} className="text-center">
                  No data available. Please generate the report first.
                </TableCell>
              </TableRow>
            )}
            {data && data.length > 0 && (
              <TableRow>
                <TableCell colSpan={3} className="font-bold text-right">
                  Totals
                </TableCell>
                <TableCell>{totals?.openingStock}</TableCell>
                <TableCell>{totals?.currentStock}</TableCell>
                <TableCell>{totals?.totalSales}</TableCell>
                <TableCell>{totals?.totalReturns}</TableCell>
                <TableCell></TableCell>
                <TableCell>{totals?.salesValue.toFixed(2)}</TableCell>
                <TableCell>{totals?.actualValue.toFixed(2)}</TableCell>
                <TableCell>{totals?.stockValue.toFixed(2)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default PrintSalesReport;
