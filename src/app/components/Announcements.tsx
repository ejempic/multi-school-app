import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
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
import { Bell, Mail, Phone, Plus, Calendar, Users } from "lucide-react";
import { toast } from "sonner";

interface Announcement {
  id: number;
  title: string;
  message: string;
  date: string;
  audience: string;
  sendVia: string[];
  priority: "High" | "Medium" | "Low";
  createdBy: string;
}

interface AnnouncementsProps {
  userRole: "admin" | "teacher" | "parent";
}

export function Announcements({ userRole }: AnnouncementsProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 1,
      title: "Parent-Teacher Meeting",
      message: "Annual parent-teacher meeting scheduled for January 20th, 2026. Please mark your calendars.",
      date: "2026-01-07",
      audience: "Parents",
      sendVia: ["Email", "SMS"],
      priority: "High",
      createdBy: "Admin User",
    },
    {
      id: 2,
      title: "Midterm Exam Schedule",
      message: "Midterm examinations will begin from January 25th. Study schedule has been uploaded to the portal.",
      date: "2026-01-06",
      audience: "Students & Parents",
      sendVia: ["Email"],
      priority: "High",
      createdBy: "Admin User",
    },
    {
      id: 3,
      title: "Winter Sports Day",
      message: "Join us for the annual winter sports day on January 15th. All students are encouraged to participate.",
      date: "2026-01-05",
      audience: "All",
      sendVia: ["Email", "SMS"],
      priority: "Medium",
      createdBy: "Coach Adams",
    },
    {
      id: 4,
      title: "Library Hours Extended",
      message: "The library will now remain open until 7 PM on weekdays to support exam preparation.",
      date: "2026-01-04",
      audience: "Students",
      sendVia: ["Email"],
      priority: "Low",
      createdBy: "Admin User",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    message: "",
    audience: "All",
    sendViaEmail: true,
    sendViaSMS: false,
    priority: "Medium" as "High" | "Medium" | "Low",
  });

  const handleCreateAnnouncement = () => {
    const sendVia = [];
    if (newAnnouncement.sendViaEmail) sendVia.push("Email");
    if (newAnnouncement.sendViaSMS) sendVia.push("SMS");

    const announcement: Announcement = {
      id: announcements.length + 1,
      title: newAnnouncement.title,
      message: newAnnouncement.message,
      date: new Date().toISOString().split('T')[0],
      audience: newAnnouncement.audience,
      sendVia,
      priority: newAnnouncement.priority,
      createdBy: userRole === "admin" ? "Admin User" : "John Smith",
    };

    setAnnouncements([announcement, ...announcements]);
    setIsDialogOpen(false);
    setNewAnnouncement({
      title: "",
      message: "",
      audience: "All",
      sendViaEmail: true,
      sendViaSMS: false,
      priority: "Medium",
    });

    toast.success("Announcement created and sent successfully!");
  };

  const getPriorityColor = (priority: string) => {
    if (priority === "High") return "bg-red-100 text-red-800";
    if (priority === "Medium") return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const canCreateAnnouncement = userRole === "admin" || userRole === "teacher";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Announcements</h1>
          <p className="text-gray-600">
            {canCreateAnnouncement
              ? "Create and manage school announcements"
              : "View important announcements from school"}
          </p>
        </div>
        {canCreateAnnouncement && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Announcement</DialogTitle>
                <DialogDescription>
                  Send important updates to students, parents, and teachers.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter announcement title"
                    value={newAnnouncement.title}
                    onChange={(e) =>
                      setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter your message here..."
                    rows={5}
                    value={newAnnouncement.message}
                    onChange={(e) =>
                      setNewAnnouncement({ ...newAnnouncement, message: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="audience">Audience</Label>
                    <Select
                      value={newAnnouncement.audience}
                      onValueChange={(value) =>
                        setNewAnnouncement({ ...newAnnouncement, audience: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Parents">Parents Only</SelectItem>
                        <SelectItem value="Students">Students Only</SelectItem>
                        <SelectItem value="Teachers">Teachers Only</SelectItem>
                        <SelectItem value="Students & Parents">Students & Parents</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newAnnouncement.priority}
                      onValueChange={(value: "High" | "Medium" | "Low") =>
                        setNewAnnouncement({ ...newAnnouncement, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Send Via</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="email"
                        checked={newAnnouncement.sendViaEmail}
                        onCheckedChange={(checked) =>
                          setNewAnnouncement({
                            ...newAnnouncement,
                            sendViaEmail: checked as boolean,
                          })
                        }
                      />
                      <label htmlFor="email" className="text-sm flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sms"
                        checked={newAnnouncement.sendViaSMS}
                        onCheckedChange={(checked) =>
                          setNewAnnouncement({
                            ...newAnnouncement,
                            sendViaSMS: checked as boolean,
                          })
                        }
                      />
                      <label htmlFor="sms" className="text-sm flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        SMS
                      </label>
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={handleCreateAnnouncement}
                  disabled={!newAnnouncement.title || !newAnnouncement.message}
                >
                  Create & Send Announcement
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Bell className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-xl">{announcement.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={getPriorityColor(announcement.priority)}>
                      {announcement.priority}
                    </Badge>
                    <Badge variant="outline">
                      <Users className="h-3 w-3 mr-1" />
                      {announcement.audience}
                    </Badge>
                    {announcement.sendVia.map((method) => (
                      <Badge key={method} variant="secondary">
                        {method === "Email" ? (
                          <Mail className="h-3 w-3 mr-1" />
                        ) : (
                          <Phone className="h-3 w-3 mr-1" />
                        )}
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{announcement.message}</p>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{announcement.date}</span>
                </div>
                <span>Posted by: {announcement.createdBy}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
