/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { ACTION } from "@/types/actionType";
import { getActiveOrg } from "../../../data/organization/action";
import { newReqesition } from "./type";
import { validateError } from "@/lib/utils";
import { db } from "@/prisma/db";

export const getReqeSitionNumber = async () => {
  const org: any = await getActiveOrg();
  const num = await db.purchaseRequisition.count({
    where: {
      orgId: Number(org.orgId),
    },
  });
  return num + 1;
};

export const getRequisitionById = async (id: string) => {
  try {
    const requisition = await db.purchaseRequisition.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        PurchaseRequisitionItems: {
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

    if (!requisition) {
      return null;
    }

    return {
      ...requisition,
      reqDate: requisition.reqDate.toISOString().split("T")[0],
      products: requisition.PurchaseRequisitionItems.map((item) => ({
        group: item.product.group.name,
        groupId: item.product.groupId.toString(),
        item: item.productId.toString(),
        quantity: item.quantity.toString(),
        unit: item.product.unit.name,
        remark: item.remarks || "",
      })),
    };
  } catch (error) {
    console.log("Get requisition error ->", error);
    return null;
  }
};

export const createReq = async (data: any): Promise<ACTION> => {
  try {
    const org: any = await getActiveOrg();
    const input = newReqesition.safeParse(data);
    if (!input.success) {
      return {
        message: validateError(input),
        success: false,
      };
    }

    const { no, description, reqDate, products } = input.data;

    await db.$transaction(async (tx) => {
      const requisition = await tx.purchaseRequisition.create({
        data: {
          no,
          description,
          reqDate: new Date(reqDate),
          post: false,
          isOrdered: false,
          orgId: Number(org.orgId),
        },
      });

      if (products && products.length > 0) {
        await tx.purchaseRequisitionItems.createMany({
          data: products.map((product: any) => ({
            productId: Number(product.item),
            quantity: Number(product.quantity),
            remarks: product.remark || null,
            requisitionId: requisition.id,
          })),
        });
      }
    });

    return {
      success: true,
      message: "Requisition created successfully",
    };
  } catch (error) {
    console.log("Create requisition error ->", error);
    return {
      success: false,
      message: "Server error",
    };
  }
};

export const updateReq = async (id: string, data: any): Promise<ACTION> => {
  try {

    const input = newReqesition.safeParse(data);
    if (!input.success) {
      return {
        message: validateError(input),
        success: false,
      };
    }

    const { no, description, reqDate, products } = input.data;
    const requisitionId = Number(id);

    await db.$transaction(async (tx) => {
      await tx.purchaseRequisition.update({
        where: { id: requisitionId },
        data: {
          no,
          description,
          reqDate: new Date(reqDate),
        },
      });

      await tx.purchaseRequisitionItems.deleteMany({
        where: { requisitionId },
      });


      if (products && products.length > 0) {
        await tx.purchaseRequisitionItems.createMany({
          data: products.map((product: any) => ({
            productId: Number(product.item),
            quantity: Number(product.quantity),
            remarks: product.remark || null,
            requisitionId,
          })),
        });
      }
    });

    return {
      success: true,
      message: "Requisition updated successfully",
    };
  } catch (error) {
    console.log("Update requisition error ->", error);
    return {
      success: false,
      message: "Server error",
    };
  }
};
