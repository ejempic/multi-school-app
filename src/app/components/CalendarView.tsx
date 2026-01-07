import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar as CalendarIcon, Plus, Clock, MapPin, Users } from "lucide-react";
import { toast } from "sonner";

interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: "Exam" | "Meeting" | "Holiday" | "Event" | "Sports";
  audience: string;
  createdBy: string;
}

interface CalendarViewProps {
  userRole: "admin" | "teacher" | "parent";
}

export function CalendarView({ userRole }: CalendarViewProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: "Winter Sports Day",
      description: "Annual winter sports competition for all grades",
      date: "2026-01-15",
      time: "9:00 AM",
      location: "School Ground",
      type: "Sports",
      audience: "All Students",
      createdBy: "Admin User",
    },
    {
      id: 2,
      title: "Parent-Teacher Meeting",
      description: "Quarterly parent-teacher conference to discuss student progress",
      date: "2026-01-20",
      time: "2:00 PM",
      location: "Main Hall",
      type: "Meeting",
      audience: "Parents & Teachers",
      createdBy: "Admin User",
    },
    {
      id: 3,
      title: "Mathematics Midterm Exam",
      description: "Midterm examination for all mathematics classes",
      date: "2026-01-25",
      time: "10:00 AM",
      location: "Examination Hall",
      type: "Exam",
      audience: "Grades 9-12",
      createdBy: "Mr. Johnson",
    },
    {
      id: 4,
      title: "Science Fair",
      description: "Annual science project exhibition and competition",
      date: "2026-02-01",
      time: "11:00 AM",
      location: "Science Block",
      type: "Event",
      audience: "All Students",
      createdBy: "Dr. Brown",
    },
    {
      id: 5,
      title: "Winter Break",
      description: "School closed for winter holidays",
      date: "2026-02-10",
      time: "All Day",
      location: "N/A",
      type: "Holiday",
      audience: "All",
      createdBy: "Admin User",
    },
  ]);

  const [selectedMonth, setSelectedMonth] = useState("January 2026");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    type: "Event" as "Exam" | "Meeting" | "Holiday" | "Event" | "Sports",
    audience: "All",
  });

  const handleCreateEvent = () => {
    const event: CalendarEvent = {
      id: events.length + 1,
      ...newEvent,
      createdBy: userRole === "admin" ? "Admin User" : "John Smith",
    };

    setEvents([...events, event].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setIsDialogOpen(false);
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      type: "Event",
      audience: "All",
    });

    toast.success("Event added to calendar successfully!");
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Exam":
        return "bg-red-100 text-red-800";
      case "Meeting":
        return "bg-blue-100 text-blue-800";
      case "Holiday":
        return "bg-green-100 text-green-800";
      case "Sports":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-purple-100 text-purple-800";
    }
  };

  const canCreateEvent = userRole === "admin" || userRole === "teacher";

  // Group events by month
  const groupedEvents = events.reduce((acc, event) => {
    const month = new Date(event.date).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">School Calendar</h1>
          <p className="text-gray-600">
            {canCreateEvent
              ? "Manage school events and important dates"
              : "View upcoming events and important dates"}
          </p>
        </div>
        {canCreateEvent && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Calendar Event</DialogTitle>
                <DialogDescription>
                  Create a new event for the school calendar.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="event-title">Event Title</Label>
                  <Input
                    id="event-title"
                    placeholder="Enter event title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="event-description">Description</Label>
                  <Textarea
                    id="event-description"
                    placeholder="Enter event description"
                    rows={3}
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="event-date">Date</Label>
                    <Input
                      id="event-date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="event-time">Time</Label>
                    <Input
                      id="event-time"
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="event-location">Location</Label>
                  <Input
                    id="event-location"
                    placeholder="Enter location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="event-type">Event Type</Label>
                    <Select
                      value={newEvent.type}
                      onValueChange={(value: any) => setNewEvent({ ...newEvent, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Event">Event</SelectItem>
                        <SelectItem value="Exam">Exam</SelectItem>
                        <SelectItem value="Meeting">Meeting</SelectItem>
                        <SelectItem value="Holiday">Holiday</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="event-audience">Audience</Label>
                    <Select
                      value={newEvent.audience}
                      onValueChange={(value) => setNewEvent({ ...newEvent, audience: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Students">Students</SelectItem>
                        <SelectItem value="Parents">Parents</SelectItem>
                        <SelectItem value="Teachers">Teachers</SelectItem>
                        <SelectItem value="Grades 9-12">Grades 9-12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={handleCreateEvent}
                  disabled={!newEvent.title || !newEvent.date}
                >
                  Add Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Upcoming Events Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="bg-blue-100 p-3 rounded-lg text-center min-w-[60px]">
                  <div className="text-2xl text-blue-600">
                    {new Date(event.date).getDate()}
                  </div>
                  <div className="text-xs text-gray-600">
                    {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4>{event.title}</h4>
                    <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Events by Month */}
      <div className="space-y-6">
        {Object.entries(groupedEvents).map(([month, monthEvents]) => (
          <Card key={month}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {month}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthEvents.map((event) => (
                  <div key={event.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg mb-1">{event.title}</h3>
                        <p className="text-sm text-gray-600">{event.description}</p>
                      </div>
                      <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{event.audience}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
