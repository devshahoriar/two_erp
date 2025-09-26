import { ContentLayout } from "@/components/admin-panel/content-layout";
import AddOrder from "./AddOrder";

const AddOrderPage = async () =>
  //   {
  //   searchParams,
  // }: {
  //   searchParams: Promise<{ id: string }>;
  // }

  {
    // const id = (await searchParams).id;

    // if (id) {
    //   const requisitionData = await getRequisitionById(id);
    //   if (!requisitionData) {
    //     return notFound();
    //   }
    //   return (
    //     <ContentLayout title="Edit Requisition">
    //       <AddRequisition id={id} initialData={requisitionData} />
    //     </ContentLayout>
    //   );
    // }

    return (
      <ContentLayout title="Add New Order">
        <AddOrder />
      </ContentLayout>
    );
  };

export default AddOrderPage;
