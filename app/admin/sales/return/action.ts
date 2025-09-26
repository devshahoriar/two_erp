/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/prisma/db";
import { ACTION } from "@/types/actionType";
import { getActiveOrg } from "../../data/organization/action";

export const getAllSalesReturnsByDate = async ({
  month,
  year,
}: {
  month: string;
  year: string;
}) => {
  const returns = await db.sealsReturn.findMany({
    where: {
      salesReturnDate: {
        gte: new Date(`${year}-${month}-01`),
        lt: new Date(
          `${year}-${parseInt(month) + 1 <= 12 ? parseInt(month) + 1 : 1}-01`,
        ),
      },
    },
    select: {
      id: true,
      salesReturnDate: true,
      dueDate: true,
      remarks: true,
      customer: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          SealsReturnItems: true,
        },
      },
    },
  });
  return returns;
};

export const getSalesReturnNo = async () => {
  const org = await getActiveOrg();
  
  const lastReturn = await db.sealsReturn.findFirst({
    where: {
      customerId: Number(org.orgId),
    },
    orderBy: {
      id: "desc",
    },
    select: {
      id: true,
    },
  });

  return lastReturn ? lastReturn.id + 1 : 1;
};

export const getInvoiceDetailsForSalesReturn = async (invoiceId: number) => {
  const org = await getActiveOrg();

  const invoice = await db.salesInvoice.findFirst({
    where: {
      id: invoiceId,
      orgId: Number(org.orgId),
    },
    include: {
      customer: true,
      branch: true,
      warehouse: true,
      SalesInvoiceItems: {
        include: {
          product: {
            include: {
              unit: true,
              group: true,
            },
          },
        },
      },
    },
  });

  return invoice;
};

export const createSalesReturnWithStockUpdate = async (data: any): Promise<ACTION> => {
  const activeOrg = await getActiveOrg();
  const orgId = Number(activeOrg.orgId);
  
  try {
    // Execute everything in a transaction with a longer timeout (30 seconds)
    await db.$transaction(
      async (prisma) => {
        // Create the return record
        const returnRecord = await prisma.sealsReturn.create({
          data: {
            salesReturnNo: String(data.returnNo || ""),
            salesReturnDate: new Date(data.salesReturnDate),
            dueDate: new Date(data.dueDate),
            branchId: Number(data.branchId),
            warehouseId: Number(data.warehouseId),
            customerId: Number(data.customerId),
            address: data.address,
            remarks: data.remarks,
            orgId: orgId,
          },
        });

        // Process each returned product
        for (const item of data.products) {
          if (!item.returnQuantity || Number(item.returnQuantity) <= 0) continue;
          
          const productId = Number(item.productId);
          const returnQuantity = Number(item.returnQuantity);
          const rate = Number(item.rate);

          // Create return item
          await prisma.sealsReturnItems.create({
            data: {
              productId,
              quantity: returnQuantity,
              rate,
              returnId: returnRecord.id,
            },
          });

          // Update stock (increase quantity as the product is returned back to stock)
          const existingStock = await prisma.stockProduct.findFirst({
            where: {
              productId: productId,
              orgId: orgId,
            },
          });

          if (existingStock) {
            await prisma.stockProduct.update({
              where: {
                id: existingStock.id,
              },
              data: {
                quantity: existingStock.quantity + returnQuantity,
              },
            });
          } else {
            // Create new stock record if it doesn't exist
            await prisma.stockProduct.create({
              data: {
                productId,
                quantity: returnQuantity,
                rate,
                orgId,
              },
            });
          }
        }

        return returnRecord;
      },
      {
        timeout: 30000,
      }
    );
    
    return { success: true, message: "Sales return processed and stock updated successfully" };
  } catch (error: any) {
    console.error("Error processing sales return:", error);
    
    return {
      success: false,
      message: error.message || "Failed to process sales return",
    };
  }
};
