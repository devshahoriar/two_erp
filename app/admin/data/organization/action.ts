/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { USER_JWT } from "@/lib/jwt";
import { getUser } from "@/lib/serverUtils";
import { validateError } from "@/lib/utils";
import { db } from "@/prisma/db";
import { ACTION } from "@/types/actionType";
import { cookies } from "next/headers";
import { ogrType } from "./type";

export const createNewOrg = async (data: unknown): Promise<ACTION> => {
  const input = ogrType.safeParse(data);
  if (!input.success) {
    return {
      success: false,
      message: validateError(input),
    };
  }

  try {
    const user = (await getUser(cookies)) as USER_JWT;
    const newOrg = await db.organization.create({
      data: {
        description: input.data.orgDesc,
        name: input.data.orgName,
        creatorId: user.id,
      },
    });
    await setActiveOrg(newOrg.id + "", newOrg.name);
    return {
      message: "Organization created",
      success: true,
    };
  } catch (error: any) {
    console.log("org create error -> ", error);
    return {
      message: error?.message ? error.message : "server error",
      success: false,
    };
  }
};

export const updateOrganization = async (id: number, data: unknown): Promise<ACTION> => {
  const input = ogrType.safeParse(data);
  if (!input.success) {
    return {
      success: false,
      message: validateError(input),
    };
  }

  try {
    const user = (await getUser(cookies)) as USER_JWT;

    // Check if organization exists and belongs to the user
    const existingOrg = await db.organization.findFirst({
      where: {
        id: id,
        creatorId: user.id,
      },
    });

    if (!existingOrg) {
      return {
        message: "Organization not found",
        success: false,
      };
    }

    await db.organization.update({
      where: {
        id: id,
      },
      data: {
        description: input.data.orgDesc,
        name: input.data.orgName,
      },
    });

    // Update active org name if this is the currently active organization
    const activeOrg = await getActiveOrg();
    if (activeOrg.orgId && parseInt(activeOrg.orgId) === id) {
      await setActiveOrg(id.toString(), input.data.orgName);
    }

    return {
      message: "Organization updated successfully",
      success: true,
    };
  } catch (error: any) {
    console.log("org update error -> ", error);
    return {
      message: error?.message ? error.message : "server error",
      success: false,
    };
  }
};

export const getOrganizationById = async (id: number) => {
  try {
    const user = (await getUser(cookies)) as USER_JWT;
    return await db.organization.findFirst({
      where: {
        id: id,
        creatorId: user.id,
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
  } catch (error: any) {
    console.log("Get organization by id error -> ", error);
    return null;
  }
};

export const getOrgList = async () => {
  const u = (await getUser(cookies)) as USER_JWT;
  return db.organization.findMany({
    where: {
      creatorId: u.id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      _count: {
        select: {
          OrganizationMembers: true,
        },
      },
    },
  });
};

export const getOrgForSelect = async () => {
  const u = (await getUser(cookies)) as USER_JWT;
  return db.organization.findMany({
    where: {
      creatorId: u.id,
    },
    select: {
      id: true,
      name: true,
    },
  });
};

export const setActiveOrg = async (orgId: string, orgName: string) => {
  const c = await cookies();
  c.set("orgId", orgId);
  c.set("orgName", orgName);
};

export const getActiveOrg = async () => {
  const c = await cookies();
  return {
    orgId: c.get("orgId")?.value,
    orgName: c.get("orgName")?.value,
  };
};
