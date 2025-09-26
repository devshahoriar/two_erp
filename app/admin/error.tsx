/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import React from "react";

const ErrorPage = (e:any) => {
  console.log("This is error ->",e.messgae)
  return (
    <div className="flex h-[90vh] w-full items-center justify-center">
      <div className="flex max-w-lg flex-col gap-3 text-center">
        <h1>
          You may don't have any organization yet or you don't select any
          organization.
        </h1>
        <Link className="underline" href="/admin/data/organization">
          Create Organization
        </Link>
        <h1>Otherwise, Database error. Please contact the admin.</h1>
      </div>
    </div>
  )
};

export default ErrorPage;
