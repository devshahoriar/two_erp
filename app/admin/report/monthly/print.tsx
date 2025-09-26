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
import { getDataForMonthlyReport } from "./action";

// Interface for normalized data
interface NormalizedProduct {
  id: number;
  name: string;
  unit: string;
  openingStock: number;
  receivedQuantity: number;
  totalStock: number;
  totalSales: number;
  totalReturn: number;
  returnValue: number;
  salesValue: number;
  currentStock: number;
  purchaseRateStockValue: number;
}

// Function to normalize data
const normalizeData = (data: any): NormalizedProduct[] => {
  const { openingStock, currentStock, purchaseData, salesData, returnData } = data;

  // Create a map of products
  const productsMap: Record<number, NormalizedProduct> = {};

  // Process opening stock
  openingStock[0]?.OpeningBalanceItem.forEach((item: any) => {
    productsMap[item.product.id] = {
      id: item.product.id,
      name: item.product.name,
      unit: item.product.unit.name,
      openingStock: item.quantity,
      receivedQuantity: 0,
      totalStock: item.quantity,
      totalSales: 0,
      totalReturn: 0,
      returnValue: 0,
      salesValue: 0,
      currentStock: 0,
      purchaseRateStockValue: 0,
    };
  });

  // Process purchase data
  purchaseData.forEach((item: any) => {
    const productId = item.product.id;
    
    if (productsMap[productId]) {
      productsMap[productId].receivedQuantity += item.qeuntity;
      productsMap[productId].totalStock += item.qeuntity;
    } else {
      productsMap[productId] = {
        id: productId,
        name: item.product.name,
        unit: "", // Will be updated from current stock
        openingStock: 0,
        receivedQuantity: item.qeuntity,
        totalStock: item.qeuntity,
        totalSales: 0,
        totalReturn: 0,
        returnValue: 0,
        salesValue: 0,
        currentStock: 0,
        purchaseRateStockValue: 0,
      };
    }
  });

  // Process sales data
  salesData.forEach((item: any) => {
    const productId = item.product.id;
    
    if (productsMap[productId]) {
      productsMap[productId].totalSales += item.quantity;
      productsMap[productId].salesValue += item.quantity * (item.rate - item.discount);
    } else {
      productsMap[productId] = {
        id: productId,
        name: item.product.name,
        unit: "", // Will be updated from current stock
        openingStock: 0,
        receivedQuantity: 0,
        totalStock: 0,
        totalSales: item.quantity,
        totalReturn: 0,
        returnValue: 0,
        salesValue: item.quantity * (item.rate - item.discount),
        currentStock: 0,
        purchaseRateStockValue: 0,
      };
    }
  });

  // Process return data
  returnData.forEach((item: any) => {
    const productId = item.product.id;
    
    if (productsMap[productId]) {
      productsMap[productId].totalReturn += item.quantity;
      productsMap[productId].returnValue += item.quantity * item.rate;
    } else {
      productsMap[productId] = {
        id: productId,
        name: item.product.name,
        unit: "", // Will be updated from current stock
        openingStock: 0,
        receivedQuantity: 0,
        totalStock: 0,
        totalSales: 0,
        totalReturn: item.quantity,
        returnValue: item.quantity * item.rate,
        salesValue: 0,
        currentStock: 0,
        purchaseRateStockValue: 0,
      };
    }
  });

  // Update with current stock data
  currentStock.forEach((item: any) => {
    const productId = item.product.id;
    
    if (productsMap[productId]) {
      productsMap[productId].currentStock = item.quantity;
      productsMap[productId].unit = item.product.unit.name;
      productsMap[productId].purchaseRateStockValue = item.quantity * item.rate;
    } else {
      productsMap[productId] = {
        id: productId,
        name: item.product.name,
        unit: item.product.unit.name,
        openingStock: 0,
        receivedQuantity: 0,
        totalStock: 0,
        totalSales: 0,
        totalReturn: 0,
        returnValue: 0,
        salesValue: 0,
        currentStock: item.quantity,
        purchaseRateStockValue: item.quantity * item.rate,
      };
    }
  });

  // Convert the map to array and sort by product name
  return Object.values(productsMap).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};

const PrintReportMonthly = () => {
  const [inputs, setInputs] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    fileType: "pdf",
  });

  const tableRef = useRef<HTMLTableElement>(null);
  const [data, setData] = useState<NormalizedProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const handlePrint = async () => {
    try {
      setLoading(true);
      const rawData = await getDataForMonthlyReport(inputs.month, inputs.year);
      
      if (
        !rawData?.openingStock ||
        !rawData?.currentStock ||
        !rawData?.purchaseData ||
        !rawData?.salesData ||
        !rawData?.returnData
      ) {
        toast.error("No data found!");
        setLoading(false);
        return;
      }

      const normalizedData = normalizeData(rawData);
      setData(normalizedData);
      setLoading(false);

      setTimeout(() => {
        const title = `Monthly Report ${inputs.month}-${inputs.year}`;
        if (inputs.fileType === "pdf") {
          tableToPdf(title);
        } else {
          tableToExcel(tableRef as any, title);
        }
      }, 300);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message ? error.message : "Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex h-[90vh] items-center justify-center print:hidden">
        <Card className="w-[500px]">
          <CardHeader>
            <CardTitle>Monthly Report</CardTitle>
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
              Generate Report
            </LoadingButton>
          </CardFooter>
        </Card>
      </div>

      <div className="px-4 pt-5 hidden print:block">
        <PrintHeader
          title="Monthly Report"
          reportDate={new Date(`${inputs.month}-01-${inputs.year}`)}
        />
        <Table className="w-full" ref={tableRef}>
          <TableHeader className="text-center">
            <TableRow>
              <TableCell>Sl.<br/>No</TableCell>
              <TableCell>Product<br/>Name</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Opening<br/>Stock</TableCell>
              <TableCell>Total<br/>Rcv<br/>Quantity</TableCell>
              <TableCell>Total<br/>Stock</TableCell>
              <TableCell>Total<br/>Sales</TableCell>
              <TableCell>Total<br/>Return</TableCell>
              <TableCell>Return<br/>Value</TableCell>
              <TableCell>Sales<br/>Product Value</TableCell>
              <TableCell>Current<br/>Stock</TableCell>
              <TableCell>Purchase<br/>Rate<br/>Stock<br/>Value</TableCell>
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
                    <TableCell>{item.totalStock}</TableCell>
                    <TableCell>{item.totalSales}</TableCell>
                    <TableCell>{item.totalReturn}</TableCell>
                    <TableCell>{item.returnValue.toFixed(2)}</TableCell>
                    <TableCell>{item.salesValue.toFixed(2)}</TableCell>
                    <TableCell>{item.currentStock}</TableCell>
                    <TableCell>{item.purchaseRateStockValue.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-muted">
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell>{data.reduce((sum, item) => sum + item.openingStock, 0)}</TableCell>
                  <TableCell>{data.reduce((sum, item) => sum + item.receivedQuantity, 0)}</TableCell>
                  <TableCell>{data.reduce((sum, item) => sum + item.totalStock, 0)}</TableCell>
                  <TableCell>{data.reduce((sum, item) => sum + item.totalSales, 0)}</TableCell>
                  <TableCell>{data.reduce((sum, item) => sum + item.totalReturn, 0)}</TableCell>
                  <TableCell>{data.reduce((sum, item) => sum + item.returnValue, 0).toFixed(2)}</TableCell>
                  <TableCell>{data.reduce((sum, item) => sum + item.salesValue, 0).toFixed(2)}</TableCell>
                  <TableCell>{data.reduce((sum, item) => sum + item.currentStock, 0)}</TableCell>
                  <TableCell>{data.reduce((sum, item) => sum + item.purchaseRateStockValue, 0).toFixed(2)}</TableCell>
                </TableRow>
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={12} className="text-center">
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

export default PrintReportMonthly;
