import { ContentLayout } from '@/components/admin-panel/content-layout'
import PrintSalesReport from './Print'

const SalesReportPage = () => {
  return (
    <ContentLayout title='Sales Report'>
      <PrintSalesReport />
    </ContentLayout>
  )
}

export default SalesReportPage