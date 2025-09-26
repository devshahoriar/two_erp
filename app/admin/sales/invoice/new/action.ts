/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/prisma/db";
import { ACTION } from "@/types/actionType";
import { getActiveOrg } from "../../../data/organization/action";
import { createInvoiceWithStockUpdate } from "../action";

export const getInvoiceNo = async () => {
  const org = await getActiveOrg();
  
  const lastInvoice = await db.salesInvoice.findFirst({
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

  // Return just the number
  return lastInvoice ? lastInvoice.id + 1 : 1;
};

export const getChallanForInvoice = async (challanId: number) => {
  const org = await getActiveOrg();

  const challan = await db.salesChallan.findFirst({
    where: {
      id: challanId,
      orgId: Number(org.orgId),
    },
    include: {
      SalesChallanItems: {
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

  return challan;
};

export const createNewInvoice = async (data: any): Promise<ACTION> => {
  try {
    await createInvoiceWithStockUpdate(data);
    return { success: true, message: "Invoice created and stock updated successfully" };
  } catch (error: any) {
    console.error("Error creating invoice:", error);
    
    // Provide more specific error messages based on error code
    if (error.code === 'P2028') {
      return { 
        success: false, 
        message: "Transaction timeout. Please try again." 
      };
    } else if (error.name === 'PrismaClientKnownRequestError') {
      return { 
        success: false, 
        message: `Database error: ${error.message}` 
      };
    }
    
    return {
      success: false,
      message: error.message || "Failed to create invoice",
    };
  }
};
