/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/prisma/db";
import { getActiveOrg } from "../../data/organization/action";

export const getAllQuotationsByDate = async ({ month, year }: any) => {
  const quotations = await db.quotation.findMany({
    where: {
      quotationDate: {
        gte: new Date(`${year}-${month}-01`),
        lt: new Date(`${year}-${month}-31`),
      },
    },
    select: {
      id: true,
      quotationDate: true,
      dueDate: true,
      supplier: {
        select: {
          name: true,
        },
      },
      branch: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          QuotationItems: true,
        },
      },
    },
  });
  return quotations;
};

export const getAllQuotationsForSelect = async () => {
  const org = await getActiveOrg();
  const items = await db.quotation.findMany({
    where: {
      orgId: Number(org.orgId),
    },
    select: {
      id: true,
      _count: {
        select: {
          QuotationItems: true,
        },
      },
    },
  });
  return items.map((item) => ({
    name: `${item.id} - (${item._count.QuotationItems} items)`,
    id: item.id,
  }));
};

export const getQuotationById = async (id: number) => {
  return db.quotation.findUnique({
    where: { id },
    include: {
      supplier: true,
      branch: true,
      QuotationItems: {
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
};
