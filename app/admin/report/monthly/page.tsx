import { ContentLayout } from "@/components/admin-panel/content-layout";
import React from "react";
import PrintReportMonthly from "./print";

const MonthlyReportPage = () => {
  return (
    <ContentLayout>
      <PrintReportMonthly />
    </ContentLayout>
  );
};

export default MonthlyReportPage;
