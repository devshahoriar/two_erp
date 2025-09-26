import { ContentLayout } from "@/components/admin-panel/content-layout";
import PrintPurchaseReport from "./Print";

const PurchaseReportPage = () => {
  return (
    <ContentLayout title="Purchase Report">
      <PrintPurchaseReport />
    </ContentLayout>
  );
};

export default PurchaseReportPage;
