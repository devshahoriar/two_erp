/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { validateError } from "@/lib/utils";
import { db } from "@/prisma/db";
import { ACTION } from "@/types/actionType";
import { getActiveOrg } from "../../data/organization/action";
import { newSupllayerType } from "./type";

export const newSupplayer = async (data: any): Promise<ACTION> => {
  try {
    const org = await getActiveOrg();
    const input = newSupllayerType.safeParse(data);
    if (!input.success) {
      return {
        success: false,
        message: validateError(input),
      };
    }
    await db.supplier.create({
      data: {
        name: input.data.name,
        code: input.data.code,
        email: input.data.email,
        phone: input.data.phone,
        address: input.data.address,
        note: input.data.note,
        orgId: Number(org.orgId),
      },
    });
    return {
      success: true,
      message: "New supplier added successfully",
    };
  } catch (error) {
    console.log("Add new supplayer error ->", error);
    return {
      success: false,
      message: "Server error",
    };
  }
};

export const getAllSupplier = async () => {
  const org = await getActiveOrg();
  const data = await db.supplier.findMany({
    where: {
      orgId: Number(org.orgId),
    },
  });
  return data;
};

export const getSuppForSelect = async () => {
  const org = await getActiveOrg();
  const data = await db.supplier.findMany({
    where: {
      orgId: Number(org.orgId),
    },
    select: {
      id: true,
      name: true,
    },
  });
  return data;
}