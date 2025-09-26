"use server";

import { db } from "@/prisma/db";
import { getActiveOrg } from "../../data/organization/action";

export const getDataForMonthlyReport = async (month: number, year: number) => {
  const org = await getActiveOrg();

  // Get opening stock data
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
          rate: true,
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

  // Get current stock data
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

  // Get purchase data from PurchaseInvoice
  const purchaseData = await db.purchaseInvoiceItem.findMany({
    where: {
      purchaseInvoice: {
        orgId: Number(org.orgId),
        invoiceDate: {
          gte: new Date(`${year}-${month}-01`),
          lt: new Date(
            `${year}-${parseInt(month + "") + 1 <= 12 ? parseInt(month + "") + 1 : 1}-01`,
          ),
        },
      },
    },
    select: {
      id: true,
      qeuntity: true,
      rate: true,
      discount: true,
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Get sales data from SalesInvoice
  const salesData = await db.salesInvoiceItems.findMany({
    where: {
      salesInvoice: {
        orgId: Number(org.orgId),
        invoiceDate: {
          gte: new Date(`${year}-${month}-01`),
          lt: new Date(
            `${year}-${parseInt(month + "") + 1 <= 12 ? parseInt(month + "") + 1 : 1}-01`,
          ),
        },
      },
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
        },
      },
    },
  });

  // Get return data
  const returnData = await db.returnItems.findMany({
    where: {
      returnProduct: {
        orgId: Number(org.orgId),
        returnDate: {
          gte: new Date(`${year}-${month}-01`),
          lt: new Date(
            `${year}-${parseInt(month + "") + 1 <= 12 ? parseInt(month + "") + 1 : 1}-01`,
          ),
        },
      },
    },
    select: {
      id: true,
      quantity: true,
      rate: true,
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return { openingStock, currentStock, purchaseData, salesData, returnData };
};