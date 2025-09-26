/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { validateError } from '@/lib/utils'
import { ACTION } from '@/types/actionType'
import { productUnitType } from './type'
import { db } from '@/prisma/db'
import { getActiveOrg } from '../organization/action'

export const addNewProductUnit = async (data: any): Promise<ACTION> => {
  try {
    const org = await getActiveOrg()
    const inputs = productUnitType.safeParse(data)
    if (!inputs.success) {
      return {
        success: false,
        message: validateError(inputs),
      }
    }
    await db.productUnits.create({
      data: {
        name: inputs.data.name,
        description: inputs.data.description,
        orgId: Number(org.orgId),
      },
      select: {
        id: true,
      },
    })
    return {
      message: 'New product unit created',
      success: true,
    }
  } catch (error: any) {
    console.log('New product unit error -> ', error)
    return {
      message: error?.message ? error.message : 'server error',
      success: false,
    }
  }
}

export const getAllProductUnit = async () => {
  const org = await getActiveOrg()
  const data = await db.productUnits.findMany({
    where: {
      orgId: Number(org.orgId),
    },
    select: {
      createdAt: true,
      description: true,
      id: true,
      name: true,
    },
  })
  return data
}

export const getProductUnitForSelect = async (input?: string) => {
  const org = await getActiveOrg()
  return db.productUnits.findMany({
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
  })
}

export const getProductUnitById = async (id: number) => {
  try {
    const org = await getActiveOrg()
    return await db.productUnits.findFirst({
      where: {
        id: id,
        orgId: Number(org?.orgId),
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    })
  } catch (error: any) {
    console.log('Get product unit by id error -> ', error)
    return null
  }
}

export const updateProductUnit = async (id: number, data: any): Promise<ACTION> => {
  try {
    const org = await getActiveOrg()
    const inputs = productUnitType.safeParse(data)
    if (!inputs.success) {
      return {
        success: false,
        message: validateError(inputs),
      }
    }

    await db.productUnits.update({
      where: {
        id: id,
        orgId: Number(org.orgId),
      },
      data: {
        name: inputs.data.name,
        description: inputs.data.description,
      },
    })

    return {
      message: 'Product unit updated successfully',
      success: true,
    }
  } catch (error: any) {
    console.log('Update product unit error -> ', error)
    return {
      message: error?.message ? error.message : 'server error',
      success: false,
    }
  }
}