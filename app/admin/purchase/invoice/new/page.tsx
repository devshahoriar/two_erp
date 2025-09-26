import { ContentLayout } from "@/components/admin-panel/content-layout";
import React from "react";
import NewInvoice from "./NewInvoice";

const AddPurchesInvoicepage = () => {
  return (
    <ContentLayout title="Add Invoice">
      <NewInvoice />
    </ContentLayout>
  );
};

export default AddPurchesInvoicepage;
