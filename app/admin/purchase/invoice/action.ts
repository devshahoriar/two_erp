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
  const org = await getActiveOrg();
  const invoices = await db.purchaseInvoice.findMany({
    where: {
      orgId: Number(org.orgId),
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
      supplier: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          PurchaseInvoiceItem: true,
        },
      },
    },
  });
  return invoices;
};

export const getAllInvoicesForSelect = async () => {
  const org = await getActiveOrg();
  const items = await db.purchaseInvoice.findMany({
    where: {
      orgId: Number(org.orgId),
    },
    select: {
      id: true,
      invoiceNo: true,
      _count: {
        select: {
          PurchaseInvoiceItem: true
        }
      }
    },
  });
  return items.map((item) => ({ name: item.invoiceNo + ", " + item._count.PurchaseInvoiceItem + " Products.", id: item.id }));
};

export const createInvoiceWithStockUpdate = async (data: any) => {
  const activeOrg = await getActiveOrg();
  const orgId = Number(activeOrg.orgId);
  
  // Execute everything in a transaction with a longer timeout (30 seconds)
  return await db.$transaction(
    async (prisma) => {
      // Create the invoice
      const invoice = await prisma.purchaseInvoice.create({
        data: {
          invoiceNo: data.invoiceNo,
          invoiceDate: new Date(data.invoiceDate),
          branchId: Number(data.branchId),
          warehouseId: Number(data.warehouseId),
          supplierId: Number(data.supplierId),
          address: data.address,
          remarks: data.remarks,
          orgId: orgId,
        },
      });

      // Process each product in the invoice
      for (const product of data.products) {
        const productId = Number(product.item);
        const quantity = Number(product.qeuntity);
        const rate = Number(product.rate);
        const discount = Number(product.discount || 0);

        // Create invoice item
        await prisma.purchaseInvoiceItem.create({
          data: {
            productId: productId,
            qeuntity: quantity,
            rate: rate,
            discount: discount,
            batch: product.batch || null,
            remarks: product.remarks || null,
            invoiceId: invoice.id,
          },
        });

        // Check if stock exists for this product
        const existingStock = await prisma.stockProduct.findFirst({
          where: {
            productId: productId,
            orgId: orgId,
          },
        });

        if (existingStock) {
          // Update existing stock
          await prisma.stockProduct.update({
            where: {
              id: existingStock.id,
            },
            data: {
              quantity: existingStock.quantity + quantity,
              // Calculate weighted average rate
              rate: (existingStock.quantity * existingStock.rate + quantity * rate) / 
                   (existingStock.quantity + quantity),
            },
          });
        } else {
          // Create new stock entry
          await prisma.stockProduct.create({
            data: {
              productId: productId,
              quantity: quantity,
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
