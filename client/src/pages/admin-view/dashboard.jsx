
import { useSelector } from "react-redux";

import SalesChart from "@/components/admin-view/SalesChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { CircleDollarSign, ShoppingBag, UserRound } from "lucide-react";

function AdminDashboard() {
  const { orderList } = useSelector((state) => state.adminOrder);
  const { productList } = useSelector((state) => state.adminProducts);
  
  const totalRevenue  = orderList.length
  const totalOrders   = orderList.length
  
  const getSalesPerMonth = async () => {
    
    
    const salesPerMonth = orderList.reduce((acc, order) => {
      const monthIndex = new Date(order.createdAt).getMonth(); // 0 for Janruary --> 11 for December
      acc[monthIndex] = (acc[monthIndex] || 0) + order.totalAmount;
 
      return acc
    }, {})
  
    const graphData = Array.from({ length: 12}, (_, i) => {
      const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(0, i))
      // if i === 5 => month = "Jun"
      return { name: month, sales: salesPerMonth[i] || 0 }
    })
    
    return graphData
  }
  const totalCustomers    = productList.length
  const graphData = getSalesPerMonth

  return (
    <div className="px-8 py-10 dark:bg-background">
      <p className="text-heading2-bold">Dashboard</p>
      <Separator className="bg-grey-1 my-5" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Total Revenue</CardTitle>
            <CircleDollarSign className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">$ {totalRevenue}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Total Orders</CardTitle>
            <ShoppingBag className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">{totalOrders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Total Customer</CardTitle>
            <UserRound className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">{totalCustomers}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Sales Chart ($)</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart data={graphData} />
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;
