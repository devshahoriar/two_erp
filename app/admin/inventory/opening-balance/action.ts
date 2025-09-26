/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { validateError } from "@/lib/utils";
import { db } from "@/prisma/db";
import { ACTION } from "@/types/actionType";
import { getActiveOrg } from "../../data/organization/action";
import { openingBalance } from "./type";

export const getOplanceBalanceNumber = async () => {
  const org = await getActiveOrg();
  const num = await db.openingBalance.count({
    where: {
      orgId: Number(org.orgId),
    },
  });

  return num + 1;
};

export const getAllCurrentStock = async () => {
  const org = await getActiveOrg();
  const stock = await db.stockProduct.findMany({
    where: {
      orgId: Number(org.orgId),
    },
    select: {
      id: true,
      rate: true,
      product: {
        select: {
          id: true,
          name: true,
          group: {
            select: {
              id: true,
              name: true,
            },
          },
          unit: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      quantity: true,
    },
  });

  return stock;
};

export const saveOpeningBalance = async (data: any): Promise<ACTION> => {
  try {
    const org = await getActiveOrg();
    const input = openingBalance.safeParse(data);
    if (!input.success) {
      return {
        success: false,
        message: validateError(input),
      };
    }

    const { opningBalanceId, remarks, product } = input.data;

    await db.$transaction(async (prisma) => {
      const openingBalance = await prisma.openingBalance.create({
        data: {
          opningBalanceId,
          orgId: Number(org.orgId),

          ...(remarks ? { remarks } : {}),
        },
      });

      for (const item of product) {
        await prisma.openingBalanceItem.create({
          data: {
            productId: Number(item.productId),
            quantity: item.quantity,
            rate: item.rate,
            ...(item.remarks ? { remarks: item.remarks } : {}),
            openingBalanceId: openingBalance.id,
          },
        });

        const existingStock = await prisma.stockProduct.findFirst({
          where: {
            productId: Number(item.productId),
            orgId: Number(org.orgId),
          },
        });

        if (existingStock) {
          await prisma.stockProduct.update({
            where: { id: existingStock.id },
            data: {
              quantity: item.quantity,
              rate: item.rate,

              ...(item.remarks ? { remarks: item.remarks } : {}),
            },
          });
        } else {
          await prisma.stockProduct.create({
            data: {
              productId: Number(item.productId),
              quantity: item.quantity,
              rate: item.rate,
              ...(item.remarks ? { remarks: item.remarks } : {}),
              orgId: Number(org.orgId),
            },
          });
        }
      }
    }, {
      timeout: 10000,
    });

    return {
      success: true,
      message: "Opening balance saved successfully",
    };
  } catch (error: any) {
    console.log("opening balance error ->", error);
    return {
      success: false,
      message: error?.message || "Something went wrong",
    };
  }
};

export const allOpningBalanceAndProduct = async (month:string, year:string) => {
  try {
    const org = await getActiveOrg();
    
    // Parse month and year to numbers
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    // Get the start and end date for the specified month and year
    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0);
    
    const openingBalances = await db.openingBalance.findMany({
      where: {
        orgId: Number(org.orgId),
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        OpeningBalanceItem: {
          include: {
            product: {
              select: {
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return openingBalances;
  } catch (error) {
    console.error("Error fetching opening balances:", error);
    return [];
  }
};