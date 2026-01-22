import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BookOpen, Users, Calendar, GraduationCap } from "lucide-react";
import { PageHeader } from "./ui/page-header";

export function Dashboard() {
  const stats = [
    {
      title: "Total Students",
      value: "1,248",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Classes",
      value: "42",
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Upcoming Events",
      value: "8",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Avg. Attendance",
      value: "94%",
      icon: GraduationCap,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const recentActivities = [
    { id: 1, activity: "New student enrolled", time: "2 hours ago", type: "enrollment" },
    { id: 2, activity: "Math exam scheduled for Grade 10", time: "5 hours ago", type: "exam" },
    { id: 3, activity: "Parent-teacher meeting tomorrow", time: "1 day ago", type: "meeting" },
    { id: 4, activity: "Science fair submissions due", time: "2 days ago", type: "assignment" },
  ];

  const upcomingClasses = [
    { id: 1, name: "Mathematics", time: "9:00 AM - 10:00 AM", teacher: "Mr. Johnson", room: "Room 101" },
    { id: 2, name: "English Literature", time: "10:15 AM - 11:15 AM", teacher: "Ms. Smith", room: "Room 205" },
    { id: 3, name: "Physics", time: "11:30 AM - 12:30 PM", teacher: "Dr. Brown", room: "Lab 3" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening today."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-full`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingClasses.map((classItem) => (
                <div key={classItem.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1">{classItem.name}</h4>
                    <p className="text-sm text-gray-600">{classItem.time}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-sm text-gray-500">{classItem.teacher}</p>
                      <p className="text-sm text-gray-500">{classItem.room}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm mb-1">{activity.activity}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
