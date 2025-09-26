import { ContentLayout } from "@/components/admin-panel/content-layout";
import AddSalesOrder from "./AddSalesOrder";

const AddSalesOrderPage = async () => {
  return (
    <ContentLayout title="Add New Sales Order">
      <AddSalesOrder />
    </ContentLayout>
  );
};

export default AddSalesOrderPage;
