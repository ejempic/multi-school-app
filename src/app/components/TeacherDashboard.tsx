import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { BookOpen, Users, ClipboardCheck, Calendar } from "lucide-react";

interface TeacherDashboardProps {
  userData: any;
}

export function TeacherDashboard({ userData }: TeacherDashboardProps) {
  const stats = [
    {
      title: "Total Classes",
      value: "5",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Students",
      value: "142",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pending Assignments",
      value: "12",
      icon: ClipboardCheck,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Classes Today",
      value: "3",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const todayClasses = [
    { id: 1, name: "Advanced Mathematics - Grade 12", time: "9:00 AM - 10:30 AM", room: "Room 101", students: 28 },
    { id: 2, name: "Mathematics - Grade 11", time: "11:00 AM - 12:30 PM", room: "Room 101", students: 30 },
    { id: 3, name: "Mathematics - Grade 10", time: "2:00 PM - 3:30 PM", room: "Room 101", students: 26 },
  ];

  const pendingGrading = [
    { id: 1, class: "Grade 12 Math", assignment: "Midterm Exam", submissions: 28, pending: 5 },
    { id: 2, class: "Grade 11 Math", assignment: "Homework Set 5", submissions: 30, pending: 8 },
    { id: 3, class: "Grade 10 Math", assignment: "Quiz 3", submissions: 26, pending: 3 },
  ];

  const upcomingDeadlines = [
    { id: 1, title: "Submit Grade 12 Midterm Grades", date: "2026-01-10", priority: "High" },
    { id: 2, title: "Parent-Teacher Meeting", date: "2026-01-20", priority: "Medium" },
    { id: 3, title: "Prepare Final Exam Questions", date: "2026-02-01", priority: "High" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Teacher Portal</h1>
        <p className="text-gray-600">Welcome, {userData.name}! Here's your overview.</p>
      </div>

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
        {/* Today's Classes */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayClasses.map((classItem) => (
                <div key={classItem.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4>{classItem.name}</h4>
                    <Badge variant="outline">{classItem.students} students</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{classItem.time}</span>
                    <span>•</span>
                    <span>{classItem.room}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Grading */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Grading</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingGrading.map((item) => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="mb-1">{item.class}</h4>
                      <p className="text-sm text-gray-600">{item.assignment}</p>
                    </div>
                    <Badge variant="destructive">{item.pending} pending</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{item.submissions} total submissions</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingDeadlines.map((deadline) => (
              <div key={deadline.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="mb-1">{deadline.title}</h4>
                  <p className="text-sm text-gray-600">{deadline.date}</p>
                </div>
                <Badge variant={deadline.priority === "High" ? "destructive" : "secondary"}>
                  {deadline.priority}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
