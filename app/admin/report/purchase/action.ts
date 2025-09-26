"use server";

import { db } from "@/prisma/db";
import { getActiveOrg } from "../../data/organization/action";

export const getDtaforPurchesReport = async (month: number, year: number) => {
  const org = await getActiveOrg();

  const opningStock = await db.openingBalance.findMany({
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

  return { opningStock, currentStock };
};
