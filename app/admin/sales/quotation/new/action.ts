/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { ACTION } from "@/types/actionType";
import { getActiveOrg } from "../../../data/organization/action";
import { newQuotation } from "./type";
import { validateError } from "@/lib/utils";
import { db } from "@/prisma/db";

export const getQuotationById = async (id: string) => {
  try {
    const quotation = await db.quotation.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        supplier: true,
        branch: true,
        QuotationItems: {
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

    if (!quotation) {
      return null;
    }

    return {
      ...quotation,
      supplierId: quotation.supplierId.toString(),
      branchId: quotation.branchId.toString(),
      quotationDate: quotation.quotationDate.toISOString().split("T")[0],
      dueDate: quotation.dueDate.toISOString().split("T")[0],
      products: quotation.QuotationItems.map((item) => ({
        group: item.product.group.name,
        groupId: item.product.groupId.toString(),
        item: item.productId.toString(),
        quantity: item.quantity.toString(),
        unit: item.product.unit.name,
        remarks: item.remarks || "",
      })),
    };
  } catch (error) {
    console.log("Get quotation error ->", error);
    return null;
  }
};

export const createQuotation = async (data: any): Promise<ACTION> => {
  try {
    const org: any = await getActiveOrg();
    const input = newQuotation.safeParse(data);
    if (!input.success) {
      return {
        message: validateError(input),
        success: false,
      };
    }

    const { 
      supplierId, 
      branchId, 
      quotationDate, 
      dueDate,
      delivery,
      support_warranty,
      validity_of_quotation,
      payment,
      others,
      suppingAddress, 
      remarks, 
      products 
    } = input.data;

    await db.$transaction(async (tx) => {
      const quotation = await tx.quotation.create({
        data: {
          supplierId: Number(supplierId),
          branchId: Number(branchId),
          quotationDate: new Date(quotationDate),
          dueDate: new Date(dueDate),
          delivery,
          support_warranty,
          validity_of_quotation,
          payment,
          others: others || null,
          suppingAddress,
          remarks: remarks || null,
          orgId: Number(org.orgId),
        },
      });

      if (products && products.length > 0) {
        await tx.quotationItems.createMany({
          data: products.map((product: any) => ({
            productId: Number(product.item),
            quantity: Number(product.quantity),
            remarks: product.remarks || null,
            quotationId: quotation.id,
          })),
        });
      }
    });

    return {
      success: true,
      message: "Quotation created successfully",
    };
  } catch (error) {
    console.log("Create quotation error ->", error);
    return {
      success: false,
      message: "Server error",
    };
  }
};

export const updateQuotation = async (id: string, data: any): Promise<ACTION> => {
  try {
    const input = newQuotation.safeParse(data);
    if (!input.success) {
      return {
        message: validateError(input),
        success: false,
      };
    }

    const { 
      supplierId, 
      branchId, 
      quotationDate, 
      dueDate,
      delivery,
      support_warranty,
      validity_of_quotation,
      payment,
      others,
      suppingAddress, 
      remarks, 
      products 
    } = input.data;
    const quotationId = Number(id);

    await db.$transaction(async (tx) => {
      await tx.quotation.update({
        where: { id: quotationId },
        data: {
          supplierId: Number(supplierId),
          branchId: Number(branchId),
          quotationDate: new Date(quotationDate),
          dueDate: new Date(dueDate),
          delivery,
          support_warranty,
          validity_of_quotation,
          payment,
          others: others || null,
          suppingAddress,
          remarks: remarks || null,
        },
      });

      await tx.quotationItems.deleteMany({
        where: { quotationId },
      });

      if (products && products.length > 0) {
        await tx.quotationItems.createMany({
          data: products.map((product: any) => ({
            productId: Number(product.item),
            quantity: Number(product.quantity),
            remarks: product.remarks || null,
            quotationId,
          })),
        });
      }
    });

    return {
      success: true,
      message: "Quotation updated successfully",
    };
  } catch (error) {
    console.log("Update quotation error ->", error);
    return {
      success: false,
      message: "Server error",
    };
  }
};
