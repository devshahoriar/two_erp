/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { validateError } from "@/lib/utils";
import { db } from "@/prisma/db";
import { ACTION } from "@/types/actionType";
import { getActiveOrg } from "../organization/action";
import { productGroupType } from "./type";

export const addNewProductGroup = async (data: any): Promise<ACTION> => {
  const org = await getActiveOrg();
  try {
    const inputs = productGroupType.safeParse(data);
    if (!inputs.success) {
      return {
        success: false,
        message: validateError(inputs),
      };
    }

    await db.productGroups.create({
      data: {
        name: inputs.data.name,
        code: inputs.data.code,
        orgId: Number(org.orgId),
      },
      select: {
        id: true,
      },
    });

    return {
      message: "New product group created",
      success: true,
    };
  } catch (error: any) {
    console.log("New product group error -> ", error);

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

export const getAllProductGroups = async () => {
  const org = await getActiveOrg();
  try {
    const data = await db.productGroups.findMany({
      where: {
        orgId: Number(org.orgId),
      },
      select: {
        createdAt: true,
        code: true,
        id: true,
        name: true,
      },
    });
    return data;
  } catch (error) {
    console.log("Get all product groups error -> ", error);
    return [];
  }
};

export const getProductGroupForSelect = async (input?: string) => {
  const org = await getActiveOrg();
  return db.productGroups.findMany({
    where: {
      orgId: Number(org.orgId),
      name: {
        contains: input,
      },
    },
    select: {
      name: true,
      id: true,
    },
  });
};
