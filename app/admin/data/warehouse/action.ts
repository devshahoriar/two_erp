/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { validateError } from '@/lib/utils'
import { db } from '@/prisma/db'
import { ACTION } from '@/types/actionType'
import { getActiveOrg } from '../organization/action'
import { newBranceType } from './type'

export const getBrancesForSelect = async (input?: string) => {
  const org = await getActiveOrg()
  return db.branch.findMany({
    where: {
      organizationId: Number(org.orgId),
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

export const createWareHouse = async (data: any): Promise<ACTION> => {
  try {
    const org = await getActiveOrg()
    const res = newBranceType.safeParse(data)
    if (!res.success) {
      return {
        success: false,
        message: validateError(res),
      }
    }
    await db.wareHouse.create({
      data: {
        name: data.name,
        location: data.location,
        orgId: Number(org.orgId),
        branchId: Number(data.branchId),
      },
    })
    return {
      success: true,
      message: 'Warehouse created successfully',
    }
  } catch (error: any) {
    console.log('branch create error ->', error)
    return {
      success: false,
      message: error?.message || 'Server error',
    }
  }
}

export const getWareHouses = async () => {
  const org = await getActiveOrg()
  return db.wareHouse.findMany({
    where: {
      orgId: Number(org.orgId),
    },
    select: {
      name: true,
      location: true,
      id: true,
      createdAt: true,
      branch: {
        select: {
          name: true,
        },
      },
    },
  })
}

export const getWareHouseForSelect = async (input?: string) => {
  const org = await getActiveOrg()
  return db.wareHouse.findMany({
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

export const updateWarehouse = async (id: number, data: any): Promise<ACTION> => {
  try {
    const org = await getActiveOrg()
    const input = newBranceType.safeParse(data)
    if (!input.success) {
      return {
        message: validateError(input),
        success: false,
      }
    }

    // Check if warehouse exists and belongs to the organization
    const existingWarehouse = await db.wareHouse.findFirst({
      where: {
        id: id,
        orgId: Number(org?.orgId),
      },
    })

    if (!existingWarehouse) {
      return {
        message: 'Warehouse not found',
        success: false,
      }
    }

    await db.wareHouse.update({
      where: {
        id: id,
      },
      data: {
        name: input.data.name,
        location: input.data.location,
        branchId: Number(input.data.branchId),
      },
    })

    return {
      message: 'Warehouse updated successfully',
      success: true,
    }
  } catch (error: any) {
    console.log('Warehouse update error -> ', error)
    return {
      message: error?.message ? error.message : 'server error',
      success: false,
    }
  }
}

export const getWarehouseById = async (id: number) => {
  try {
    const org = await getActiveOrg()
    return await db.wareHouse.findFirst({
      where: {
        id: id,
        orgId: Number(org?.orgId),
      },
      select: {
        id: true,
        name: true,
        location: true,
        branchId: true,
        branch: {
          select: {
            name: true,
          },
        },
      },
    })
  } catch (error: any) {
    console.log('Get warehouse by id error -> ', error)
    return null
  }
}