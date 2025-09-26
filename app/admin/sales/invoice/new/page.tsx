import { ContentLayout } from "@/components/admin-panel/content-layout";
import React from "react";
import NewInvoice from "./NewInvoice";

const AddSalesInvoicePage = () => {
  return (
    <ContentLayout title="Add Sales Invoice">
      <NewInvoice />
    </ContentLayout>
  );
};

export default AddSalesInvoicePage;
