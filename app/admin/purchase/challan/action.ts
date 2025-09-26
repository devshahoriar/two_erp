"use server";

import { db } from "@/prisma/db";
import { getActiveOrg } from "../../data/organization/action";

export const getAllChallansByDate = async ({
  month,
  year,
}: {
  month: string;
  year: string;
}) => {
  const challans = await db.purchaseChallan.findMany({
    where: {
      challanDate: {
        gte: new Date(`${year}-${month}-01`),
        lt: new Date(
          `${year}-${parseInt(month) + 1 <= 12 ? parseInt(month) + 1 : 1}-01`,
        ),
      },
    },
    select: {
      id: true,
      challanNo: true,
      challanDate: true,
      challanDueDate: true,
      remarks: true,
      post: true,
      supplier: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          PurchaseChallanItems: true,
        },
      },
    },
  });
  return challans;
};

export const getAllChallanForSelect = async () => {
  const org = await getActiveOrg();
  const items = await db.purchaseChallan.findMany({
    where: {
      orgId: Number(org.orgId),
    },
    select: {
      id: true,
      challanNo: true,
      _count:{
        select:{
          PurchaseChallanItems: true
        }
      }
    },
  });
  return items.map((item) => ({ name: item.challanNo+", "+ item._count.PurchaseChallanItems+" Products.", id: item.id }));
};


