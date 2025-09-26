import { ContentLayout } from "@/components/admin-panel/content-layout";
import { notFound } from "next/navigation";
import AddQuotation from "./AddQuotation";
import { getQuotationById } from "./action";

const AddQuotationPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) => {
  const id = (await searchParams).id;

  if (id) {
    const quotationData = await getQuotationById(id);
    if (!quotationData) {
      return notFound();
    }
    return (
      <ContentLayout title="Edit Quotation">
        <AddQuotation id={id} initialData={quotationData} />
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Add New Quotation">
      <AddQuotation />
    </ContentLayout>
  );
};

export default AddQuotationPage;
