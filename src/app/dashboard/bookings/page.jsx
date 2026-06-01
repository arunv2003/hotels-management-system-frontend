"use client";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
const days = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
});
const rooms = [
    { id: "101", name: "Room 101", bookings: [{ start: 0, end: 3, guest: "John Doe" }] },
    { id: "102", name: "Room 102", bookings: [{ start: 2, end: 5, guest: "Jane Smith" }] },
    { id: "103", name: "Room 103", bookings: [{ start: 5, end: 8, guest: "Mike Johnson" }] },
    { id: "104", name: "Room 104", bookings: [] },
    { id: "105", name: "Room 105", bookings: [{ start: 1, end: 4, guest: "Sarah Wilson" }] },
];
export default function BookingCalendarPage() {
    return (<DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
            <p className="text-muted-foreground">Manage reservations and check-ins.</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4"/>
            New Booking
          </Button>
        </div>

        <div className="flex items-center gap-4 bg-card p-4 rounded-lg border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <Input className="pl-10" placeholder="Search bookings, guests, rooms..."/>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4"/></Button>
            <div className="text-sm font-semibold min-w-[120px] text-center">
              May 16 - May 30
            </div>
            <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4"/></Button>
          </div>
          <Button variant="outline" className="gap-2">
            <CalendarDays className="h-4 w-4"/>
            Today
          </Button>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              <div className="flex border-b bg-muted/50">
                <div className="w-48 p-4 font-bold border-r">Rooms</div>
                {days.map((day, i) => (<div key={i} className="flex-1 p-4 text-center border-r last:border-r-0">
                    <div className="text-xs uppercase text-muted-foreground">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div className="text-lg font-bold">{day.getDate()}</div>
                  </div>))}
              </div>
              <div className="divide-y">
                {rooms.map((room) => (<div key={room.id} className="flex group hover:bg-muted/30 transition-colors">
                    <div className="w-48 p-4 font-medium border-r bg-card">{room.name}</div>
                    <div className="flex-1 relative h-16 flex">
                      {days.map((_, i) => (<div key={i} className="flex-1 border-r last:border-r-0"/>))}
                      
                      {room.bookings.map((booking, i) => (<div key={i} className="absolute h-10 top-3 rounded-md bg-primary/20 border border-primary/30 flex items-center px-3 text-xs font-semibold text-primary" style={{
                    left: `calc(${(booking.start / days.length) * 100}%)`,
                    width: `calc(${((booking.end - booking.start) / days.length) * 100}%)`,
                    marginLeft: '4px',
                    marginRight: '4px'
                }}>
                          {booking.guest}
                        </div>))}
                    </div>
                  </div>))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>);
}
