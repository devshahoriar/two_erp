/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { setActiveOrg } from "./action";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import EditOrganization from "./EditOrganization";

const ItemOrg = ({ org, activOrg }: any) => {
  return (
    <Card
      onClick={() => setActiveOrg(org?.id + "", org?.name)}
      key={org.id}
      className={cn(
        "relative cursor-pointer overflow-hidden",
        activOrg?.orgId == org.id && "border-2 border-blue-500",
      )}
    >
      {activOrg?.orgId == org.id && (
        <div className="absolute -top-1 -right-1 z-10">
          <span className="rounded-br-sm bg-blue-500 px-2 text-white">
            Active
          </span>
        </div>
      )}
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{org.name}</CardTitle>
          <div className="flex items-center gap-2">
            <EditOrganization
              organizationId={org.id}
              initialData={{
                name: org.name,
                description: org.description,
              }}
            />
            <Badge variant="secondary">ID: {org.id}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3 text-sm">
          {org.description || "No description provided"}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs">Organization</p>
        <Badge variant="outline">
          {org._count.OrganizationMembers}{" "}
          {org._count.OrganizationMembers === 1 ? "Member" : "Members"}
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default ItemOrg;
