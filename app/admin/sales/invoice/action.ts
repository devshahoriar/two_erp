/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/prisma/db";
import { getActiveOrg } from "../../data/organization/action";

export const getAllInvoicesByDate = async ({
  month,
  year,
}: {
  month: string;
  year: string;
}) => {
  const invoices = await db.salesInvoice.findMany({
    where: {
      invoiceDate: {
        gte: new Date(`${year}-${month}-01`),
        lt: new Date(
          `${year}-${parseInt(month) + 1 <= 12 ? parseInt(month) + 1 : 1}-01`,
        ),
      },
    },
    select: {
      id: true,
      invoiceNo: true,
      invoiceDate: true,
      remarks: true,
      customer: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          SalesInvoiceItems: true,
        },
      },
    },
  });
  return invoices;
};

export const getAllInvoicesForSelect = async () => {
  const org = await getActiveOrg();
  const items = await db.salesInvoice.findMany({
    where: {
      orgId: Number(org.orgId),
    },
    select: {
      id: true,
      invoiceNo: true,
      _count: {
        select: {
          SalesInvoiceItems: true
        }
      }
    },
  });
  return items.map((item) => ({ name: item.invoiceNo + ", " + item._count.SalesInvoiceItems + " Products.", id: item.id }));
};

export const createInvoiceWithStockUpdate = async (data: any) => {
  const activeOrg = await getActiveOrg();
  const orgId = Number(activeOrg.orgId);
  
  // Execute everything in a transaction with a longer timeout (30 seconds)
  return await db.$transaction(
    async (prisma) => {
      // Create the invoice
      const invoice = await prisma.salesInvoice.create({
        data: {
          invoiceNo: data.invoiceNo,
          invoiceDate: new Date(data.invoiceDate),
          deliveryDate: new Date(data.deliveryDate),
          branchId: Number(data.branchId),
          warehouseId: Number(data.warehouseId),
          customerId: Number(data.customerId),
          address: data.address,
          exclusiveContact: data.exclusiveContact,
          remarks: data.remarks,
          orgId: orgId,
        },
      });

      // Process each product in the invoice
      for (const product of data.products) {
        const productId = Number(product.item);
        const quantity = Number(product.quantity);
        const rate = Number(product.rate);
        const discount = Number(product.discount || 0);

        // Create invoice item
        await prisma.salesInvoiceItems.create({
          data: {
            productId: productId,
            quantity: quantity,
            rate: rate,
            discount: discount,
            batchNo: product.batchNo || null,
            remarks: product.remarks || null,
            invoiceId: invoice.id,
          },
        });

        // Check if stock exists for this product and update it
        const existingStock = await prisma.stockProduct.findFirst({
          where: {
            productId: productId,
            orgId: orgId,
          },
        });

        if (existingStock) {
          // Update existing stock (reducing quantity for sales)
          await prisma.stockProduct.update({
            where: {
              id: existingStock.id,
            },
            data: {
              quantity: existingStock.quantity - quantity,
            },
          });
        } else {
          // Create new stock entry with negative quantity
          await prisma.stockProduct.create({
            data: {
              productId: productId,
              quantity: -quantity,
              rate: rate,
              orgId: orgId,
            },
          });
        }
      }

      return invoice;
    },
    {
      timeout: 30000,
    }
  );
};
