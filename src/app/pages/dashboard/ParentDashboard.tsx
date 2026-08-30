import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";
import { Calendar, BookOpen, GraduationCap, DollarSign, TrendingUp, Users } from "lucide-react";
import { PageHeader } from "@/app/components/ui/page-header";

interface ParentDashboardProps {
  userData: any;
}

export function ParentDashboard({ userData }: ParentDashboardProps) {
  const childrenData = [
    {
      name: "Emma Watson",
      grade: "Grade 12",
      photo: "/feature-images/girl_photo.png",
      gpa: 3.8,
      attendance: 96,
      tuitionStatus: "Paid",
      recentGrades: [
        { subject: "Math", grade: "A", score: 92 },
        { subject: "English", grade: "A", score: 95 },
        { subject: "Physics", grade: "B", score: 85 },
      ],
      upcomingEvents: [
        { title: "Parent-Teacher Meeting", date: "2026-01-20" },
        { title: "Midterm Exam", date: "2026-01-25" },
      ],
    },
    {
      name: "Liam Johnson",
      grade: "Grade 11",
      photo: "https://images.unsplash.com/photo-1624918201580-388eae33e802?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXQlMjBtYWxlfGVufDF8fHx8MTc2NzgwNjE4OXww&ixlib=rb-4.1.0&q=80&w=1080",
      gpa: 3.6,
      attendance: 94,
      tuitionStatus: "Pending",
      recentGrades: [
        { subject: "Chemistry", grade: "A-", score: 90 },
        { subject: "History", grade: "B+", score: 87 },
        { subject: "Computer Science", grade: "A+", score: 98 },
      ],
      upcomingEvents: [
        { title: "Science Fair", date: "2026-02-01" },
        { title: "Sports Day", date: "2026-01-15" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="Parent Portal"
        subtitle={`Welcome, ${userData.name}! Track your children's progress.`}
      />

      {childrenData.map((child, index) => (
        <div key={index} className="space-y-4">
          <div className="flex flex-col items-center gap-3 px-4 sm:flex-row sm:items-center sm:px-0">
            <div className="aspect-square w-full max-w-56 shrink-0 overflow-hidden rounded-full bg-slate-100 shadow-sm ring-4 ring-white sm:h-16 sm:w-16 sm:max-w-none">
              <img
                src={child.photo}
                alt={child.name}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div className="min-w-0 space-y-1 text-center sm:text-left">
              <h2 className="truncate text-2xl font-black text-slate-900 sm:text-2xl">{child.name}</h2>
              <Badge variant="outline" className="w-fit rounded-full bg-white px-3 py-1 text-sm">
                {child.grade}
              </Badge>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">GPA</p>
                    <p className="text-2xl">{child.gpa.toFixed(1)}</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Attendance</p>
                    <p className="text-2xl">{child.attendance}%</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Classes</p>
                    <p className="text-2xl">6</p>
                  </div>
                  <div className="bg-purple-100 p-2 rounded-full">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tuition</p>
                    <Badge variant={child.tuitionStatus === "Paid" ? "default" : "destructive"}>
                      {child.tuitionStatus}
                    </Badge>
                  </div>
                  <div className="bg-orange-100 p-2 rounded-full">
                    <DollarSign className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent Grades */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Grades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {child.recentGrades.map((grade, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="mb-1">{grade.subject}</p>
                        <Progress value={grade.score} className="h-2" />
                      </div>
                      <div className="text-right ml-4">
                        <Badge variant="secondary">{grade.grade}</Badge>
                        <p className="text-sm text-gray-600 mt-1">{grade.score}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {child.upcomingEvents.map((event, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-blue-100 p-2 rounded">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="mb-1">{event.title}</p>
                        <p className="text-sm text-gray-600">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
}
