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
  const challans = await db.salesChallan.findMany({
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
      dueDate: true,
      remarks: true,
      contactPerson: true,
      branch: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          SalesChallanItems: true,
        },
      },
    },
  });
  return challans;
};

export const getAllChallanForSelect = async () => {
  const org = await getActiveOrg();
  const items = await db.salesChallan.findMany({
    where: {
      orgId: Number(org.orgId),
    },
    select: {
      id: true,
      challanNo: true,
      _count:{
        select:{
          SalesChallanItems: true
        }
      }
    },
  });
  return items.map((item) => ({ name: item.challanNo+", "+ item._count.SalesChallanItems+" Products.", id: item.id }));
};
