/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { validateError } from "@/lib/utils";
import { db } from "@/prisma/db";
import { ACTION } from "@/types/actionType";
import { getActiveOrg } from "../organization/action";
import { newProductType } from "./type";

export const createNewProduct = async (data: any): Promise<ACTION> => {
  try {
    const org = await getActiveOrg();
    const inputs = newProductType.safeParse(data);
    if (!inputs.success) {
      return {
        success: false,
        message: validateError(inputs),
      };
    }
    await db.product.create({
      data: {
        itemCode: inputs.data.itemCode,
        name: inputs.data.name,
        description: inputs.data.description,
        unitId: Number(inputs.data.unitId),
        groupId: Number(inputs.data.groupId),
        orgId: Number(org.orgId),
      },
    });

    return {
      message: "New product created",
      success: true,
    };
  } catch (error: any) {
    console.log("New product error -> ", error);
    if (error.code === "P2002") {
      return {
        message: `This code already exists`,
        success: false,
      };
    }
    return {
      message: error?.message ? error.message : "server error",
      success: false,
    };
  }
};

export const getAllProducts = async () => {
  const org = await getActiveOrg();
  const data = await db.product.findMany({
    where: {
      orgId: Number(org.orgId),
    },
    select: {
      id: true,
      itemCode: true,
      name: true,
      description: true,
      createdAt: true,
      unit: {
        select: {
          name: true,
        },
      },
      group: {
        select: {
          name: true,
        },
      },
    },
  });
  return data;
};

export const getProductForSelect = async (
  search: string = "",
  groupId?: number,
) => {
  try {
    const org = await getActiveOrg();
    const whereClause: any = {
      orgId: Number(org.orgId),
    };

    if (groupId) {
      whereClause.groupId = Number(groupId);
    }

    if (search) {
      whereClause.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          itemCode: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const data = await db.product.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        group: {
          select: {
            name: true,
            id: true,
          },
        },
        unit: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return data;
  } catch (error: any) {
    console.log("Get product for select error ->", error);
    return [];
  }
};
