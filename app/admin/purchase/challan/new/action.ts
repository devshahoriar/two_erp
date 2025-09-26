/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { getActiveOrg } from "@/app/admin/data/organization/action";
import { db } from "@/prisma/db";
import { validateError } from "@/lib/utils";
import { ACTION } from "@/types/actionType";
import { newChallanSchema } from "./type";

export const getChallanNo = async () => {
  const { orgId } = await getActiveOrg();
  const count = await db.purchaseChallan.count({
    where: {
      orgId: Number(orgId),
    },
  });
  return count + 1;
};

export const getOrderForChallan = async (orderId: number) => {
  return db.purchaseOrder.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      orderNo: true,
      description: true,
      supplierId: true,
      branchId: true,
      warehouseId: true,
      suppingAddress: true,
      remarks: true,
      PurchaseOrderItems: {
        select: {
          id: true,
          quantity: true,
          rate: true,
          batchNo: true,
          remarks: true,
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
        },
      },
    },
  });
};

export const createNewChallan = async (data: any): Promise<ACTION> => {
  const input = newChallanSchema.safeParse(data);
  if (!input.success) {
    return {
      success: false,
      message: validateError(input.error),
    };
  }
  
  try {
    const { orgId } = await getActiveOrg();
    
    const {
      challanNo,
      challanDate,
      challanDueDate,
      supplierId,
      branchId,
      warehouseId,
      shippingAddress,
      remarks,
      products,
      orderId,
    } = input.data;

    // Use transaction to ensure data consistency
    await db.$transaction(async (tx) => {
      // Create purchase challan
      await tx.purchaseChallan.create({
        data: {
          challanNo,
          challanDate: new Date(challanDate),
          challanDueDate: new Date(challanDueDate),
          supplierId: Number(supplierId),
          branchId: Number(branchId),
          warehouseId: Number(warehouseId),
          suppingAddress: shippingAddress,
          remarks,
          orgId: Number(orgId),
          PurchaseChallanItems: {
            create: products.map(product => ({
              productId: Number(product.item),
              quantity: Number(product.quantity),
              rate: parseFloat(product.rate+''),
              batchNo: product.batchNo,
              remarks: product.remark,
            }))
          }
        },
      });

      // Update order status if orderId is provided
      if (orderId) {
        await tx.purchaseOrder.update({
          where: {
            id: Number(orderId)
          },
          data: {
            isOrderd: true
          }
        });
      }
    });

    return {
      success: true,
      message: "Purchase challan created successfully",
    };

  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong",
    };
  }
};