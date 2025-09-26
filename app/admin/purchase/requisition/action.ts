/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/prisma/db";

export const getAllReqByDate = async ({ month, year }: any) => {
  const requisitions = await db.purchaseRequisition.findMany({
    where: {
      reqDate: {
        gte: new Date(`${year}-${month}-01`),
        lt: new Date(`${year}-${month}-31`),
      },
    },
    select: {
      id: true,
      no: true,
      reqDate: true,
      description: true,
      post: true,
      isOrdered: true,
      _count: {
        select: {
          PurchaseRequisitionItems: true,
        },
      },
    },
  });
  return requisitions;
};

export const getAllReqForSelect = async () => {
  const requisitions = await db.purchaseRequisition.findMany({
    select: {
      id: true,
      no: true,
    },
    where: {
      isOrdered: false,
    },
  });

  return requisitions.map((req) => ({
    name: req.no,
    id: req.id,
  }));
};
