import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  BookOpen,
  Calendar,
  Clock3,
  DollarSign,
  GraduationCap,
  Printer,
  QrCode,
  Car,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "./ui/page-header";
import { useGatePasses } from "../contexts/GatePassContext";

interface ParentDashboardProps {
  userData: any;
}

export function ParentDashboard({ userData }: ParentDashboardProps) {
  const { passes, activePasses } = useGatePasses();
  const currentPass = activePasses[0] ?? passes[0] ?? null;

  const childrenData = [
    {
      name: "Emma Watson",
      grade: "Grade 12",
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
        title="Parent Portal"
        subtitle={`Welcome, ${userData.name}! Track your children's progress.`}
      />

      {currentPass && (
        <Card className="overflow-hidden border-blue-200 bg-gradient-to-br from-blue-50 via-white to-sky-50">
          <CardHeader className="border-b border-blue-100">
            <CardTitle className="flex items-center gap-2 text-lg">
              <QrCode className="h-5 w-5 text-blue-600" />
              Gate Pass
            </CardTitle>
            <p className="text-sm text-gray-600">
              Present this pass at the gate. It is tracked in the school's in/out audit log.
            </p>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-[180px_1fr]">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="rounded-xl bg-slate-950 p-4">
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 7 }).map((_, row) =>
                    Array.from({ length: 7 }).map((__, col) => {
                      const filled =
                        row === 0 ||
                        row === 6 ||
                        col === 0 ||
                        col === 6 ||
                        (row >= 2 && row <= 4 && col >= 2 && col <= 4);
                      return (
                        <div
                          key={`${row}-${col}`}
                          className={`aspect-square rounded-[2px] ${filled ? "bg-white" : "bg-slate-900"}`}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Pass code</p>
                  <p className="text-xl font-semibold text-gray-900">{currentPass.passCode}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Status</p>
                  <Badge variant={currentPass.status === "Checked Out" ? "secondary" : "default"}>
                    {currentPass.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Student</p>
                  <p className="font-medium text-gray-900">{currentPass.studentName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Parent / guardian</p>
                  <p className="font-medium text-gray-900">{currentPass.parentName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Gate</p>
                  <p className="font-medium text-gray-900">{currentPass.gate}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Vehicle</p>
                  <p className="flex items-center gap-2 font-medium text-gray-900">
                    <Car className="h-4 w-4 text-gray-500" />
                    {currentPass.vehicleType}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Valid until</p>
                  <p className="font-medium text-gray-900">{currentPass.validUntil}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Recent gate activity</p>
                  <Button variant="outline" size="sm" onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                </div>
                {currentPass.logs.slice(0, 3).map((log) => (
                  <div key={log.id} className="flex items-start gap-3 rounded-xl bg-white p-3 shadow-sm">
                    <div className={`mt-0.5 rounded-full p-2 ${log.direction === "IN" ? "bg-emerald-100" : "bg-orange-100"}`}>
                      <Clock3 className={`h-4 w-4 ${log.direction === "IN" ? "text-emerald-600" : "text-orange-600"}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {log.direction === "IN" ? "Entry" : "Exit"} recorded at {log.gate}
                      </p>
                      <p className="text-xs text-gray-600">{log.note}</p>
                      <p className="mt-1 text-xs text-gray-500">{log.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {childrenData.map((child, index) => (
        <div key={index} className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl">{child.name}</h2>
            <Badge variant="outline">{child.grade}</Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm text-gray-600">GPA</p>
                    <p className="text-2xl">{child.gpa.toFixed(1)}</p>
                  </div>
                  <div className="rounded-full bg-blue-100 p-2">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm text-gray-600">Attendance</p>
                    <p className="text-2xl">{child.attendance}%</p>
                  </div>
                  <div className="rounded-full bg-green-100 p-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm text-gray-600">Classes</p>
                    <p className="text-2xl">6</p>
                  </div>
                  <div className="rounded-full bg-purple-100 p-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm text-gray-600">Tuition</p>
                    <Badge variant={child.tuitionStatus === "Paid" ? "default" : "destructive"}>
                      {child.tuitionStatus}
                    </Badge>
                  </div>
                  <div className="rounded-full bg-orange-100 p-2">
                    <DollarSign className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Grades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {child.recentGrades.map((grade, gradeIndex) => (
                    <div key={gradeIndex} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                      <div className="flex-1">
                        <p className="mb-1">{grade.subject}</p>
                        <Progress value={grade.score} className="h-2" />
                      </div>
                      <div className="ml-4 text-right">
                        <Badge variant="secondary">{grade.grade}</Badge>
                        <p className="mt-1 text-sm text-gray-600">{grade.score}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {child.upcomingEvents.map((event, eventIndex) => (
                    <div key={eventIndex} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                      <div className="rounded bg-blue-100 p-2">
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
