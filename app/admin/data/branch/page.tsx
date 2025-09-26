/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContentLayout } from '@/components/admin-panel/content-layout'
import {
  AdminPageBody,
  AdminPageTopBar,
} from '@/components/shared/AdminPageElement'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { format } from 'date-fns'
import { Calendar, MapPin, Warehouse } from 'lucide-react'

import { RefreshButton } from '@/components/shared/CustomButton'
import { getBranchList } from './action'
import AddNewBranceh from './AddNewBranceh'
import EditBranch from './EditBranch'

const DataBranchPage = async () => {
  const branchList = await getBranchList()
  return (
    <ContentLayout>
      <AdminPageTopBar title="Total Branch" length={branchList?.length}>
        <RefreshButton />
        <AddNewBranceh />
      </AdminPageTopBar>

      <AdminPageBody>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {branchList && branchList.length > 0 ? (
            branchList.map((branch: any, index: number) => (
              <Card
                key={index}
                className="overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">
                      {branch.name}
                    </CardTitle>
                    <EditBranch branchId={branch.id} />
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <CardDescription>{branch.location}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="">
                  <div className="flex items-center text-sm mb-1">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Created on{' '}
                      {format(new Date(branch.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center h-5">
                    <div className="flex items-center">
                      <Warehouse className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Warehouses
                      </span>
                    </div>
                    <Badge variant="secondary">{branch._count.WareHouse}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center h-40">
              <p className="text-muted-foreground">No branches found</p>
            </div>
          )}
        </div>
      </AdminPageBody>
    </ContentLayout>
  )
}

export default DataBranchPage
