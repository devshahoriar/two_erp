/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getActiveOrg } from "@/app/admin/data/organization/action";
import { db } from "@/prisma/db";
import { newOrderSchema } from "./type";
import { validateError } from "@/lib/utils";
import { ACTION } from "@/types/actionType";

export const getReqForOrder = async (reqId: number) => {
  return db.purchaseRequisition.findUnique({
    where: { id: reqId },
    select: {
      id: true,
      no: true,
      description: true,
      PurchaseRequisitionItems: {
        select: {
          id: true,
          quantity: true,
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

export const getOrderNo = async () => {
  const { orgId } = await getActiveOrg();
  const c = await db.purchaseOrder.count({
    where: {
      orgId: Number(orgId),
    },
  });
  return c + 1;
};

export const createNewOrder = async (data: any): Promise<ACTION> => {
  
  const input = newOrderSchema.safeParse(data);
  if (!input.success) {
    return {
      success: false,
      message: validateError(input.error),
    };
  }
  try {
    const { orgId } = await getActiveOrg();
    // save into database using transaction
    const { 
      orderNo, 
      description, 
      orderDate, 
      dueDate, 
      supplierId, 
      branchId, 
      warehouseId, 
      shippingAddress, 
      remarks, 
      products,
      reqId 
    } = input.data;

    // Use transaction to ensure data consistency
    await db.$transaction(async (tx) => {
      // Create purchase order
      await tx.purchaseOrder.create({
        data: {
          orderNo,
          description,
          orderDate: new Date(orderDate),
          dueDate: new Date(dueDate),
          supplierId: Number(supplierId),
          branchId: Number(branchId),
          warehouseId: Number(warehouseId),
          suppingAddress: shippingAddress,
          remarks,
          orgId: Number(orgId),
          PurchaseOrderItems: {
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

      // Update requisition status if reqId is provided
      if (reqId) {
        await tx.purchaseRequisition.update({
          where: {
            id: Number(reqId)
          },
          data: {
            isOrdered: true
          }
        });
      }
    });

    return {
      success: true,
      message: "Purchase order created successfully",
    };

  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong",
    };
  }
};
