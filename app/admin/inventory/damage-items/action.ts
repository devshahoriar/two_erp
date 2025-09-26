/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { ACTION } from "@/types/actionType";
import { DamageItemSchema } from "./type";
import { validateError } from "@/lib/utils";
import { db } from "@/prisma/db";
import { getActiveOrg } from "../../data/organization/action";


export const createDamageProduct = async (data: any): Promise<ACTION> => {
  try {
    const org = await getActiveOrg();
    const datas = DamageItemSchema?.safeParse(data);
    if (!datas.success) {
      return {
        message: validateError(datas) || "Something went wrong!",
        success: false,
      };
    }
    const input = datas.data;
    await db.damagedProduct.create({
      data: {
        quantity: input.quentity,
        rate: input.rate,
        remarks: input.remark,
        productId: Number(input.productId),
        warehouseId: Number(input.warehouseId),
        orgId: Number(org?.orgId),
      },
    });
    return {
      message: "Product added successfully",
      success: true,
    };
  } catch (error: any) {
    return {
      message: error?.message || "Something went wrong!",
      success: false,
    };
  }
};

export async function getAllDamageProductByMontyhOrYear(month: string, year: string) {
  try {
    const org = await getActiveOrg();
    
    // Parse month and year to numbers
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    // Get the start and end date for the specified month and year
    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0);
    
    const products = await db.damagedProduct.findMany({
      where: {
        orgId: Number(org?.orgId),
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        product: {
          include: {
            unit: true,
          },
        },
        warehouse: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return products;
  } catch (error) {
    console.error("Error fetching damaged products:", error);
    return [];
  }
}