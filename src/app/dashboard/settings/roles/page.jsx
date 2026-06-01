"use client";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Save } from "lucide-react";
import { useState } from "react";
const modules = [
    { name: "Rooms", key: "rooms", actions: ["view", "create", "edit", "delete"] },
    { name: "Bookings", key: "bookings", actions: ["view", "create", "edit", "delete", "approve"] },
    { name: "Staff", key: "staff", actions: ["view", "create", "edit", "delete", "manage"] },
    { name: "Accounting", key: "accounting", actions: ["view", "export"] },
];
export default function RoleBuilderPage() {
    const [roleName, setRoleName] = useState("Receptionist");
    return (<DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-primary"/>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Role Builder</h1>
              <p className="text-muted-foreground">Configure dynamic permissions for your staff.</p>
            </div>
          </div>
          <Button className="gap-2">
            <Save className="h-4 w-4"/>
            Save Role
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Role Details</CardTitle>
            <CardDescription>Give your role a descriptive name and purpose.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label htmlFor="role-name" className="text-sm font-medium">Role Name</label>
              <Input id="role-name" value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="e.g. Senior Manager"/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permission Matrix</CardTitle>
            <CardDescription>Select which actions this role can perform across different modules.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Module</TableHead>
                  <TableHead>View</TableHead>
                  <TableHead>Create</TableHead>
                  <TableHead>Edit</TableHead>
                  <TableHead>Delete</TableHead>
                  <TableHead>Other</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((mod) => (<TableRow key={mod.key}>
                    <TableCell className="font-semibold">{mod.name}</TableCell>
                    <TableCell>
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked={mod.actions.includes("view")}/>
                    </TableCell>
                    <TableCell>
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked={mod.actions.includes("create")}/>
                    </TableCell>
                    <TableCell>
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked={mod.actions.includes("edit")}/>
                    </TableCell>
                    <TableCell>
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                    </TableCell>
                    <TableCell>
                      {mod.actions.filter(a => !["view", "create", "edit", "delete"].includes(a)).map(a => (<div key={a} className="flex items-center gap-2">
                           <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                           <span className="text-xs capitalize">{a}</span>
                        </div>))}
                    </TableCell>
                  </TableRow>))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>);
}
