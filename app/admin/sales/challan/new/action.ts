/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getActiveOrg } from "@/app/admin/data/organization/action";
import { db } from "@/prisma/db";
import { validateError } from "@/lib/utils";
import { ACTION } from "@/types/actionType";
import { newChallanSchema } from "./type";

export const getChallanNo = async () => {
  const { orgId } = await getActiveOrg();
  const count = await db.salesChallan.count({
    where: {
      orgId: Number(orgId),
    },
  });
  return count + 1;
};

export const getOrderForChallan = async (orderId: number) => {
  return db.salesOrder.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      orderNo: true,
      orderDate: true,
      address: true,
      contactPerson: true,
      contactNumber: true,
      remarks: true,
      placeOfDelivery: true,
      branchId: true,
      warehouseId: true,
      SalesOrderItems: {
        select: {
          id: true,
          quantity: true,

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
      dueDate,
      branchId,
      warehouseId,
      contactPerson,
      contactNumber,
      address,
      designation,
      paleOfDelivery,
      poNo,
      poDate,
      driverName,
      driverPhone,
      transportationMode,
      vehicleNo,
      remarks,
      products,
    } = input.data;

    // Create sales challan
    await db.salesChallan.create({
      data: {
        challanNo,
        challanDate: new Date(challanDate),
        dueDate: new Date(dueDate),
        branchId: Number(branchId),
        warehouseId: Number(warehouseId),
        contactPerson,
        contactNumber,
        address,
        designation,
        paleOfDelivery,
        poNo,
        poDate: new Date(poDate),
        driverName,
        driverPhone,
        transportationMode,
        vehicleNo,
        remarks,
        orgId: Number(orgId),
        SalesChallanItems: {
          create: products.map((product) => ({
            productId: Number(product.item),
            quantity: Number(product.quantity),
            remarks: product.remarks,
          })),
        },
      },
    });

    return {
      success: true,
      message: "Sales challan created successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong",
    };
  }
};
