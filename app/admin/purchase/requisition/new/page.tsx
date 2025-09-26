import { ContentLayout } from "@/components/admin-panel/content-layout";
import { notFound } from "next/navigation";
import AddRequisition from "./AddReqsition";
import { getRequisitionById } from "./action";

const AddReqesitionPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) => {
  const id = (await searchParams).id;

  if (id) {
    const requisitionData = await getRequisitionById(id);
    if (!requisitionData) {
      return notFound();
    }
    return (
      <ContentLayout title="Edit Requisition">
        <AddRequisition id={id} initialData={requisitionData} />
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Add New Requisition">
      <AddRequisition />
    </ContentLayout>
  );
};

export default AddReqesitionPage;
