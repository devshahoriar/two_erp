"use server";

import { db } from "@/prisma/db";
import { getActiveOrg } from "../../data/organization/action";

export const getDataForSalesReport = async (month: number, year: number) => {
  const org = await getActiveOrg();

  const openingStock = await db.openingBalance.findMany({
    where: {
      orgId: Number(org.orgId),
      createdAt: {
        gte: new Date(`${year}-${month}-01`),
        lt: new Date(
          `${year}-${parseInt(month + "") + 1 <= 12 ? parseInt(month + "") + 1 : 1}-01`,
        ),
      },
    },
    select: {
      createdAt: true,
      id: true,
      OpeningBalanceItem: {
        select: {
          id: true,
          quantity: true,
          productId: true,
          product: {
            select: {
              id: true,
              name: true,
              unit: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });
  
  const currentStock = await db.stockProduct.findMany({
    where: {
      orgId: Number(org.orgId),
    },
    select: {
      id: true,
      quantity: true,
      rate: true,
      product: {
        select: {
          id: true,
          name: true,
          unit: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  // Get sales data
  const salesInvoices = await db.salesInvoiceItems.findMany({
    where: {
      salesInvoice: {
        orgId: Number(org.orgId),
        invoiceDate: {
          gte: new Date(`${year}-${month}-01`),
          lt: new Date(
            `${year}-${parseInt(month + "") + 1 <= 12 ? parseInt(month + "") + 1 : 1}-01`,
          ),
        },
      }
    },
    select: {
      id: true,
      quantity: true,
      rate: true,
      discount: true,
      product: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  });

  // Get sales return data
  const salesReturns = await db.sealsReturnItems.findMany({
    where: {
      salesReturn: {
        orgId: Number(org.orgId),
        salesReturnDate: {
          gte: new Date(`${year}-${month}-01`),
          lt: new Date(
            `${year}-${parseInt(month + "") + 1 <= 12 ? parseInt(month + "") + 1 : 1}-01`,
          ),
        }
      }
    },
    select: {
      id: true,
      quantity: true,
      rate: true,
      product: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  });

  return { openingStock, currentStock, salesInvoices, salesReturns };
};
