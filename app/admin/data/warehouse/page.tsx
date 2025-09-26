import { ContentLayout } from "@/components/admin-panel/content-layout"
import { AdminPageBody, AdminPageTopBar } from "@/components/shared/AdminPageElement"
import { RefreshButton } from "@/components/shared/CustomButton"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Building, Calendar, MapPin } from "lucide-react"
import AddNewWareHouse from "./AddNewWareHouse"
import EditWarehouse from "./EditWarehouse"
import { getWareHouses } from "./action"

const WareHousePage = async () => {
  const listWareHouse = await getWareHouses()
  return (
    <ContentLayout>
      <AdminPageTopBar title="Total Warehouse" length={listWareHouse.length}>
        <RefreshButton />
        <AddNewWareHouse />
      </AdminPageTopBar>
      <AdminPageBody>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listWareHouse && listWareHouse.length > 0 ? (
            listWareHouse.map((warehouse) => (
              <Card key={warehouse.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold">
                      {warehouse.name}
                    </CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <CardDescription>{warehouse.location}</CardDescription>
                    </div>
                  </div>
                  <EditWarehouse warehouseId={warehouse.id} />
                </CardHeader>
                <CardContent>
                <div className="flex items-center text-sm mb-1">
                    <span className="text-muted-foreground">
                      ID: {warehouse.id}
                    </span>
                  </div>
                  <div className="flex items-center text-sm mb-1">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Created on {format(new Date(warehouse.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                  <div className="flex items-center gap-1.5">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Branch
                    </span>
                  </div>
                  <Badge variant="secondary" className="px-2.5 py-1">
                    {warehouse.branch.name}
                  </Badge>
                </div>
                </CardContent>
                
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center h-40">
              <p className="text-muted-foreground">No warehouses found</p>
            </div>
          )}
        </div>
      </AdminPageBody>
    </ContentLayout>
  )
}

export default WareHousePage