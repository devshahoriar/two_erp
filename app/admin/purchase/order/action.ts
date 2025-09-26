"use server";

import { db } from "@/prisma/db";
import { getActiveOrg } from "../../data/organization/action";

export const getAllOrdersByDate = async ({
  month,
  year,
}: {
  month: string;
  year: string;
}) => {
  const orders = await db.purchaseOrder.findMany({
    where: {
      orderDate: {
        gte: new Date(`${year}-${month}-01`),
        lt: new Date(
          `${year}-${parseInt(month) + 1 <= 12 ? parseInt(month) + 1 : 1}-01`,
        ),
      },
    },
    select: {
      id: true,
      orderNo: true,
      orderDate: true,
      dueDate: true,
      description: true,
      post: true,
      supplier: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          PurchaseOrderItems: true,
        },
      },
    },
  });
  return orders;
};

export const getAllOrderForSelect = async () => {
  const org = await getActiveOrg();
  const items = await db.purchaseOrder.findMany({
    where: {
      orgId: Number(org.orgId),
      isOrderd: false,
    },
    select: {
      id: true,
      orderNo: true,
    },
  });
  return items.map((item) => ({ name: item.orderNo, id: item.id }));
};
