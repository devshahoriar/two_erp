/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { sign } from "@/lib/jwt";
import { validateError } from "@/lib/utils";
import { db } from "@/prisma/db";
import { ACTION } from "@/types/actionType";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { z } from "zod";
import { loginType } from "./type";

export const loginUser = async (
  data: z.infer<typeof loginType>,
): Promise<ACTION> => {
  try {
    const res = loginType.safeParse(data);
    if (!res.success) {
      return {
        success: false,
        message: validateError(res),
      };
    }
    const foundUser = await db.adminUsers.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!foundUser) {
      return {
        success: false,
        message: "User not found",
      };
    }
    const isMatch = await bcrypt.compare(data.password, foundUser.password);
    if (!isMatch) {
      return {
        success: false,
        message: "Invalid password",
      };
    }
    const token = await sign({
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
    });
    const coockie = await cookies();

    coockie.set("token", token);
    return {
      success: true,
      message: "Login success",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message ? error.message : "Server error",
    };
  }
};

export const logoutUser = async (): Promise<ACTION> => {
  try {
    const coockie = await cookies();
    const allCookies = coockie.getAll();
    allCookies.forEach((cookie) => {
      coockie.delete(cookie?.name);
    });
    return {
      success: true,
      message: "Logout success",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message ? error.message : "Server error",
    };
  }
};
