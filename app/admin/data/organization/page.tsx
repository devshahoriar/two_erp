/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  AdminPageBody,
  AdminPageTopBar,
} from "@/components/shared/AdminPageElement";

import { RefreshButton } from "@/components/shared/CustomButton";
import { getActiveOrg, getOrgList } from "./action";
import AddNewOrg from "./AddNewOrg";

import ItemOrg from "./ItemOrg";

const OrganizationPage = async () => {
  const listOrg = await getOrgList();
  const activOrg: any = await getActiveOrg();

  return (
    <ContentLayout>
      <AdminPageTopBar title="Total organization" length={listOrg.length}>
        <RefreshButton />
        <AddNewOrg />
      </AdminPageTopBar>
      <AdminPageBody>
        {listOrg.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground">No organizations found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {listOrg.map((org) => (
              <ItemOrg key={org?.id} org={org} activOrg={activOrg} />
            ))}
          </div>
        )}
      </AdminPageBody>
    </ContentLayout>
  );
};

export default OrganizationPage;
