/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/prisma/db";
import { ACTION } from "@/types/actionType";
import { getActiveOrg } from "../../data/organization/action";

export const getAllReturnsByDate = async ({
  month,
  year,
}: {
  month: string;
  year: string;
}) => {
  const returns = await db.retuenProduct.findMany({
    where: {
      returnDate: {
        gte: new Date(`${year}-${month}-01`),
        lt: new Date(
          `${year}-${parseInt(month) + 1 <= 12 ? parseInt(month) + 1 : 1}-01`,
        ),
      },
    },
    select: {
      id: true,
      returnDate: true,
      dueDate: true,
      remarks: true,
      supplier: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          ReturnItems: true,
        },
      },
    },
  });
  return returns;
};

export const getReturnNo = async () => {
  const org = await getActiveOrg();
  
  const lastReturn = await db.retuenProduct.findFirst({
    where: {
      orgId: Number(org.orgId),
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

export const getInvoiceDetailsForReturn = async (invoiceId: number) => {
  const org = await getActiveOrg();

  const invoice = await db.purchaseInvoice.findFirst({
    where: {
      id: invoiceId,
      orgId: Number(org.orgId),
    },
    include: {
      supplier: true,
      branch: true,
      warehouse: true,
      PurchaseInvoiceItem: {
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

export const createReturnWithStockUpdate = async (data: any): Promise<ACTION> => {
  const activeOrg = await getActiveOrg();
  const orgId = Number(activeOrg.orgId);
  
  try {
    // Execute everything in a transaction with a longer timeout (30 seconds)
    await db.$transaction(
      async (prisma) => {
        // Create the return record
        const returnRecord = await prisma.retuenProduct.create({
          data: {
            returnDate: new Date(data.returnDate),
            dueDate: new Date(data.dueDate),
            branchId: Number(data.branchId),
            warehouseId: Number(data.warehouseId),
            supplierId: Number(data.supplierId),
            remarks: data.remarks,
            quantity: Number(data.totalQuantity),
            rate: Number(data.totalAmount),
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
          await prisma.returnItems.create({
            data: {
              productId,
              quantity: returnQuantity,
              rate,
              batch: item.batch || null,
              returnId: returnRecord.id,
            },
          });

          // Update stock (decrease quantity)
          const existingStock = await prisma.stockProduct.findFirst({
            where: {
              productId: productId,
              orgId: orgId,
            },
          });

          if (existingStock) {
            const newQuantity = existingStock.quantity - returnQuantity;
            
            if (newQuantity < 0) {
              throw new Error(`Cannot return more than available stock for product ID: ${productId}`);
            }
            
            await prisma.stockProduct.update({
              where: {
                id: existingStock.id,
              },
              data: {
                quantity: newQuantity,
              },
            });
          } else {
            throw new Error(`No stock found for product ID: ${productId}`);
          }
        }

        return returnRecord;
      },
      {
        timeout: 30000,
      }
    );
    
    return { success: true, message: "Return processed and stock updated successfully" };
  } catch (error: any) {
    console.error("Error processing return:", error);
    
    return {
      success: false,
      message: error.message || "Failed to process return",
    };
  }
};

