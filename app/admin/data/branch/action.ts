/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { validateError } from '@/lib/utils'
import { db } from '@/prisma/db'
import { ACTION } from '@/types/actionType'
import { getActiveOrg } from '../organization/action'
import { addBranceType } from './type'

export const createBranch = async (data: any): Promise<ACTION> => {
  try {
    const org: any = await getActiveOrg()
    const input = addBranceType.safeParse(data)
    if (!input.success) {
      return {
        message: validateError(input),
        success: false,
      }
    }
    await db.branch.create({
      data: {
        name: input.data.name,
        location: input.data.location,
        organizationId: Number(org?.orgId),
      },
    })
    return {
      message: 'Branch created',
      success: true,
    }
  } catch (error: any) {
    console.log('Branch create error -> ', error)
    return {
      message: error?.message ? error.message : 'server error',
      success: false,
    }
  }
}

export const updateBranch = async (id: number, data: any): Promise<ACTION> => {
  try {
    const org: any = await getActiveOrg()
    const input = addBranceType.safeParse(data)
    if (!input.success) {
      return {
        message: validateError(input),
        success: false,
      }
    }

    // Check if branch exists and belongs to the organization
    const existingBranch = await db.branch.findFirst({
      where: {
        id: id,
        organizationId: Number(org?.orgId),
      },
    })

    if (!existingBranch) {
      return {
        message: 'Branch not found',
        success: false,
      }
    }

    await db.branch.update({
      where: {
        id: id,
      },
      data: {
        name: input.data.name,
        location: input.data.location,
      },
    })

    return {
      message: 'Branch updated successfully',
      success: true,
    }
  } catch (error: any) {
    console.log('Branch update error -> ', error)
    return {
      message: error?.message ? error.message : 'server error',
      success: false,
    }
  }
}

export const getBranchById = async (id: number) => {
  try {
    const org: any = await getActiveOrg()
    return await db.branch.findFirst({
      where: {
        id: id,
        organizationId: Number(org?.orgId),
      },
      select: {
        id: true,
        name: true,
        location: true,
      },
    })
  } catch (error: any) {
    console.log('Get branch by id error -> ', error)
    return null
  }
}

export const getBranchList = async () => {
  const org: any = await getActiveOrg()
  return db.branch.findMany({
    where: {
      organizationId: Number(org?.orgId),
    },
    select: {
      id: true,
      location: true,
      name: true,
      createdAt: true,
      _count: {
        select: {
          WareHouse: true,
        },
      },
    },
  })
}

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
