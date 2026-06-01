"use client";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { PermissionGuard } from "@/components/shared/PermissionGuard";
import { SubscriptionGuard } from "@/components/shared/SubscriptionGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Plus, Download, MoreHorizontal, Bed } from "lucide-react";
const rooms = [
    { id: "1", number: "101", type: "Deluxe", status: "Available", price: "$120" },
    { id: "2", number: "102", type: "Suite", status: "Occupied", price: "$250" },
    { id: "3", number: "103", type: "Standard", status: "Cleaning", price: "$80" },
];
export default function RoomsPage() {
    return (<DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rooms</h1>
            <p className="text-muted-foreground">
              Manage your hotel rooms and availability.
            </p>
          </div>
          <div className="flex gap-2">
            <PermissionGuard module="rooms" action="export">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4"/>
                Export
              </Button>
            </PermissionGuard>
            <PermissionGuard module="rooms" action="create">
              <Button>
                <Plus className="mr-2 h-4 w-4"/>
                Add Room
              </Button>
            </PermissionGuard>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          {/* More stats cards... */}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Room List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (<TableRow key={room.id}>
                    <TableCell className="font-medium">{room.number}</TableCell>
                    <TableCell>{room.type}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${room.status === "Available" ? "bg-green-100 text-green-700" :
                room.status === "Occupied" ? "bg-blue-100 text-blue-700" :
                    "bg-yellow-100 text-yellow-700"}`}>
                        {room.status}
                      </span>
                    </TableCell>
                    <TableCell>{room.price}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4"/>
                      </Button>
                    </TableCell>
                  </TableRow>))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Example of Subscription Guard */}
        <div className="pt-8">
          <h2 className="text-xl font-semibold mb-4">Advanced Analytics</h2>
          <SubscriptionGuard feature="advanced_analytics">
            <Card>
              <CardContent className="p-6">
                <p>Sophisticated room performance reports would go here.</p>
              </CardContent>
            </Card>
          </SubscriptionGuard>
        </div>
      </div>
    </DashboardLayout>);
}
