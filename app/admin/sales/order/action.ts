/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getActiveOrg } from "@/app/admin/data/organization/action";
import { validateError } from "@/lib/utils";
import { db } from "@/prisma/db";
import { ACTION } from "@/types/actionType";
import { newSalesOrderSchema } from "./type";

export const getAllOrdersByDate = async ({
  month,
  year,
}: {
  month: string;
  year: string;
}) => {
  const orders = await db.salesOrder.findMany({
    where: {
      orderDate: {
        gte: new Date(`${year}-${month}-01`),
        lt: new Date(
          `${year}-${
            parseInt(month) + 1 <= 12 ? parseInt(month) + 1 : 1
          }-01`,
        ),
      },
    },
    select: {
      id: true,
      orderNo: true,
      orderDate: true,
      deliveryDate: true,
      address: true,
      contactPerson: true,
      customer: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          SalesOrderItems: true,
        },
      },
    },
  });
  return orders;
};

export const getSalesOrderNo = async () => {
  const { orgId } = await getActiveOrg();
  const count = await db.salesOrder.count({
    where: {
      orgId: Number(orgId),
    },
  });
  return count + 1;
};

export const createNewSalesOrder = async (data: any): Promise<ACTION> => {
  const input = newSalesOrderSchema.safeParse(data);
  if (!input.success) {
    return {
      success: false,
      message: validateError(input.error),
    };
  }

  try {
    const { orgId } = await getActiveOrg();
    const {
      orderNo,
      orderDate,
      deliveryDate,
      customerId,
      branchId,
      warehouseId,
      address,
      contactPerson,
      contactNumber,
      placeOfDelivery,
      remarks,
      products,
    } = input.data;

    await db.salesOrder.create({
      data: {
        orderNo,
        orderDate: new Date(orderDate),
        deliveryDate: new Date(deliveryDate),
        customerId: Number(customerId),
        branchId: Number(branchId),
        warehouseId: Number(warehouseId),
        address,
        contactPerson,
        contactNumber,
        placeOfDelivery,
        remarks,
        orgId: Number(orgId),
        SalesOrderItems: {
          create: products.map((product) => ({
            productId: Number(product.item),
            quantity: Number(product.quantity),
            rate: parseFloat(product.rate + ""),
          })),
        },
      },
    });

    return {
      success: true,
      message: "Sales order created successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong",
    };
  }
};

export const getAllOrderForSelect = async () => {
  const org = await getActiveOrg();
  const items = await db.salesOrder.findMany({
    where: {
      orgId: Number(org.orgId),
    },
    select: {
      id: true,
      orderNo: true,
      _count: {
        select: {
          SalesOrderItems: true,
        },
      },
    },
  });
  return items.map((item) => ({ 
    name: item.orderNo + ", " + item._count.SalesOrderItems + " Products.",
    id: item.id 
  }));
};

export const getSalesOrderById = async (id: number) => {
  return db.salesOrder.findUnique({
    where: { id },
    include: {
      customer: true,
      branch: true,
      warehouse: true,
      SalesOrderItems: {
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
};

export const getSalesOrderForSelect = async (query: string) => {
  const { orgId } = await getActiveOrg();

  const orders = await db.salesOrder.findMany({
    where: {
      orgId: Number(orgId),
      orderNo: {
        contains: query,
        mode: 'insensitive'
      }
    },
    select: {
      id: true,
      orderNo: true,
      customer: {
        select: {
          name: true
        }
      }
    },
    take: 10
  });

  return orders.map(order => ({
    label: `${order.orderNo} - ${order.customer.name}`,
    value: order.id.toString()
  }));
};

export const getAllSalesOrders = async () => {
  const { orgId } = await getActiveOrg();

  return db.salesOrder.findMany({
    where: {
      orgId: Number(orgId)
    },
    select: {
      id: true,
      orderNo: true,
      orderDate: true,
      deliveryDate: true,
      customer: {
        select: {
          name: true
        }
      },
      branch: {
        select: {
          name: true
        }
      },
      warehouse: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      id: 'desc'
    }
  });
};
