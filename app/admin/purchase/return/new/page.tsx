import { ContentLayout } from "@/components/admin-panel/content-layout";
import React from "react";
import NewPurchaseReturn from "./NewPurchaseReturn";

const AddPurchaseReturnPage = () => {
  return (
    <ContentLayout title="New Purchase Return">
      <NewPurchaseReturn />
    </ContentLayout>
  );
};

export default AddPurchaseReturnPage;
