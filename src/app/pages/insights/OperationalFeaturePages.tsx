import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { PageHeader } from "@/app/components/ui/page-header";
import { Progress } from "@/app/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { activeEvaluationCampaign } from "@/app/data/evaluation";
import { useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  GraduationCap,
  HeartPulse,
  LineChart,
  type LucideIcon,
  MessageSquareText,
  Search,
  ShieldAlert,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  UserRound,
} from "lucide-react";

type FeatureRolePageProps = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  roles: string[];
  points: string[];
  metrics: Array<{ label: string; value: string; note: string }>;
};

function FeatureRolePage({ title, subtitle, icon: Icon, roles, points, metrics }: FeatureRolePageProps) {
  return (
    <div className="space-y-6">
      <PageHeader icon={Icon} title={title} subtitle={subtitle} />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Feature</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-950">{title}</p>
                  <p className="text-sm leading-6 text-slate-600">{subtitle}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              {points.map((point) => (
                <div key={point} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
                  <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <p className="text-sm leading-6 text-slate-700">{point}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Visible To</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <Badge key={role} variant="secondary" className="rounded-full px-3 py-1 text-xs font-semibold">
                  {role}
                </Badge>
              ))}
            </div>

            <div className="grid gap-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{metric.label}</p>
                  <p className="mt-2 text-2xl font-black text-slate-950">{metric.value}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{metric.note}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function StudentRiskProfile() {
  const [filters, setFilters] = useState({
    riskLevel: "all",
    gradeLevel: "all",
    owner: "all",
  });
  const [selectedStudentId, setSelectedStudentId] = useState(1);
  const [supportNote, setSupportNote] = useState("");

  const students = [
    {
      id: 1,
      name: "Luis Mendoza",
      grade: "Grade 7",
      adviser: "Mrs. Clara Gomez",
      riskLevel: "High",
      riskScore: 82,
      owner: "Guidance",
      lastContact: "August 26, 2026",
      signals: [
        { label: "Attendance", value: "78%", status: "High", detail: "6 absences this month" },
        { label: "Grades", value: "74%", status: "Moderate", detail: "Math and English below class average" },
        { label: "Clinic", value: "3 visits", status: "Moderate", detail: "Headache and fatigue complaints" },
        { label: "Behavior", value: "2 notes", status: "Watch", detail: "Withdrawn during group work" },
      ],
      notes: [
        { role: "Teacher", text: "Often misses homework and needs help catching up after absences." },
        { role: "Nurse", text: "Recent visits are non-emergency but recurring. Parent follow-up advised." },
        { role: "Guidance", text: "Schedule a check-in and ask about home routine and class confidence." },
      ],
      plan: [
        "Guidance check-in this week.",
        "Adviser to call parent or guardian.",
        "Math teacher to prepare short recovery activity.",
        "Nurse to monitor recurring clinic visit pattern.",
      ],
    },
    {
      id: 2,
      name: "Ana Reyes",
      grade: "Grade 6",
      adviser: "Mr. Marcus Johnson",
      riskLevel: "Moderate",
      riskScore: 64,
      owner: "Teacher",
      lastContact: "August 28, 2026",
      signals: [
        { label: "Attendance", value: "91%", status: "Watch", detail: "Two late arrivals this week" },
        { label: "Grades", value: "81%", status: "Watch", detail: "Science score dropped by 5 points" },
        { label: "Clinic", value: "0 visits", status: "Good", detail: "No recent clinic concerns" },
        { label: "Behavior", value: "1 note", status: "Watch", detail: "Needs encouragement in recitation" },
      ],
      notes: [
        { role: "Teacher", text: "Understands lessons but hesitates to ask questions." },
        { role: "Guidance", text: "Monitor confidence and peer interaction." },
      ],
      plan: [
        "Teacher to give guided practice for Science.",
        "Adviser to check participation next week.",
        "Review performance after next quiz.",
      ],
    },
    {
      id: 3,
      name: "Pedro Garcia",
      grade: "Grade 10",
      adviser: "Ms. Sarah Smith",
      riskLevel: "High",
      riskScore: 88,
      owner: "Admin",
      lastContact: "August 25, 2026",
      signals: [
        { label: "Attendance", value: "84%", status: "Moderate", detail: "Frequent late arrivals" },
        { label: "Grades", value: "69%", status: "High", detail: "Failed two major assessments" },
        { label: "Clinic", value: "1 visit", status: "Watch", detail: "Stomach pain before exam day" },
        { label: "Behavior", value: "3 notes", status: "High", detail: "Avoids submissions and group tasks" },
      ],
      notes: [
        { role: "Teacher", text: "Needs a recovery plan for missed requirements." },
        { role: "Guidance", text: "Check for academic pressure and possible avoidance behavior." },
        { role: "Admin", text: "Parent conference recommended if no improvement in two weeks." },
      ],
      plan: [
        "Admin to approve intervention plan.",
        "Guidance to meet student privately.",
        "Teachers to list missing requirements.",
        "Parent conference if next checkpoint is missed.",
      ],
    },
  ];

  const selectedStudent = students.find((student) => student.id === selectedStudentId) || students[0];
  const filteredStudents = students.filter((student) => {
    const matchesRisk = filters.riskLevel === "all" || student.riskLevel.toLowerCase() === filters.riskLevel;
    const matchesGrade = filters.gradeLevel === "all" || student.grade.toLowerCase().replace(/\s+/g, "-") === filters.gradeLevel;
    const matchesOwner = filters.owner === "all" || student.owner.toLowerCase() === filters.owner;
    return matchesRisk && matchesGrade && matchesOwner;
  });

  const riskVariant = (riskLevel: string) => {
    if (riskLevel === "High") return "destructive" as const;
    if (riskLevel === "Moderate") return "warning" as const;
    return "secondary" as const;
  };

  const signalVariant = (status: string) => {
    if (status === "High") return "destructive" as const;
    if (status === "Moderate" || status === "Watch") return "warning" as const;
    return "success" as const;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ShieldAlert}
        title="Student Risk Profile"
        subtitle="A coordinated support workspace for admin, teachers, nurses, and guidance staff to identify concerns early and plan follow-up."
      />

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "High Risk", value: "2", note: "Needs immediate follow-up", variant: "destructive" as const },
          { label: "Moderate Risk", value: "1", note: "Monitor this week", variant: "warning" as const },
          { label: "Open Plans", value: "9", note: "Assigned interventions", variant: "secondary" as const },
          { label: "Follow-ups Due", value: "4", note: "Before Friday", variant: "warning" as const },
        ].map((item) => (
          <Card key={item.label} className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-black text-slate-950">{item.value}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.note}</p>
                </div>
                <Badge variant={item.variant}>{item.label.split(" ")[0]}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="grid gap-4 p-5 lg:grid-cols-[1fr_0.8fr_0.8fr_0.8fr]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input className="pl-9" placeholder="Search student name, adviser, or grade..." />
          </div>
          <div className="space-y-2">
            <Label>Risk Level</Label>
            <Select value={filters.riskLevel} onValueChange={(value) => setFilters({ ...filters, riskLevel: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Grade Level</Label>
            <Select value={filters.gradeLevel} onValueChange={(value) => setFilters({ ...filters, gradeLevel: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grade Levels</SelectItem>
                <SelectItem value="grade-6">Grade 6</SelectItem>
                <SelectItem value="grade-7">Grade 7</SelectItem>
                <SelectItem value="grade-10">Grade 10</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Case Owner</Label>
            <Select value={filters.owner} onValueChange={(value) => setFilters({ ...filters, owner: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Owners</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="guidance">Guidance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Students to Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredStudents.map((student) => (
              <button
                key={student.id}
                type="button"
                onClick={() => setSelectedStudentId(student.id)}
                className={`w-full rounded-lg border p-4 text-left transition ${
                  selectedStudent.id === student.id
                    ? "border-blue-300 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-950">{student.name}</p>
                    <p className="text-sm text-slate-500">{student.grade} • {student.adviser}</p>
                  </div>
                  <Badge variant={riskVariant(student.riskLevel)}>{student.riskLevel}</Badge>
                </div>
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-600">Risk score</span>
                    <span className="font-bold text-slate-950">{student.riskScore}</span>
                  </div>
                  <Progress value={student.riskScore} className="h-2" />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>{selectedStudent.name}</CardTitle>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {selectedStudent.grade} • Adviser: {selectedStudent.adviser}
                </p>
              </div>
              <Badge variant={riskVariant(selectedStudent.riskLevel)}>{selectedStudent.riskLevel} Risk</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 md:grid-cols-2">
              {selectedStudent.signals.map((signal) => (
                <div key={signal.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-950">{signal.label}</p>
                      <p className="mt-1 text-2xl font-black text-slate-950">{signal.value}</p>
                    </div>
                    <Badge variant={signalVariant(signal.status)}>{signal.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{signal.detail}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                <div>
                  <p className="font-semibold text-amber-950">Privacy reminder</p>
                  <p className="mt-1 text-sm leading-6 text-amber-900/80">
                    Risk profile details should only be visible to assigned support roles. Parents and students should
                    receive care instructions or follow-up messages, not internal risk scoring.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Role Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedStudent.notes.map((note) => {
              const Icon = note.role === "Nurse" ? HeartPulse : note.role === "Guidance" ? UserRound : note.role === "Admin" ? ShieldAlert : ClipboardList;
              return (
                <div key={`${note.role}-${note.text}`} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <Badge variant="outline">{note.role}</Badge>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{note.text}</p>
                  </div>
                </div>
              );
            })}

            <div className="space-y-2 pt-2">
              <Label htmlFor="support-note">Add support note</Label>
              <Textarea
                id="support-note"
                value={supportNote}
                onChange={(event) => setSupportNote(event.target.value)}
                placeholder="Add a teacher, nurse, guidance, or admin note for the support team..."
                className="min-h-28"
              />
              <Button disabled={!supportNote.trim()}>Save Support Note</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Intervention Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-950">Case owner</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{selectedStudent.owner}</p>
              <p className="mt-1 text-sm text-slate-500">Last parent/student contact: {selectedStudent.lastContact}</p>
            </div>
            {selectedStudent.plan.map((step, index) => (
              <div key={step} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-slate-700">{step}</p>
              </div>
            ))}
            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              <Button variant="outline">Mark Follow-up Done</Button>
              <Button>Create Parent Notice</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function SchoolwideStudentPerformance() {
  const [filters, setFilters] = useState({
    gradeLevel: "all",
    term: "current",
    metric: "overall",
  });

  const summary = [
    { label: "Overall Average", value: "88.4", note: "+2.1 vs previous term", variant: "success" as const },
    { label: "Attendance Rate", value: "94%", note: "Current month", variant: "success" as const },
    { label: "PACE Completion", value: "76%", note: "Needs intervention review", variant: "warning" as const },
    { label: "Students to Watch", value: "18", note: "Academic or attendance signals", variant: "destructive" as const },
  ];

  const gradePerformance = [
    { grade: "Grade 3", students: 38, average: 91, attendance: 97, pace: 82, status: "Strong" },
    { grade: "Grade 4", students: 42, average: 89, attendance: 95, pace: 79, status: "On track" },
    { grade: "Grade 5", students: 40, average: 86, attendance: 93, pace: 75, status: "Review" },
    { grade: "Grade 6", students: 36, average: 84, attendance: 90, pace: 68, status: "Needs support" },
  ];

  const classBreakdown = [
    { className: "Advanced Mathematics", teacher: "Mr. Marcus Johnson", grade: "Grade 12", average: 92, movement: "+4.2" },
    { className: "English Literature", teacher: "Ms. Sarah Smith", grade: "Grade 11", average: 89, movement: "+1.8" },
    { className: "Computer Science", teacher: "Mr. Garcia", grade: "Grade 10", average: 87, movement: "+3.1" },
    { className: "Physics", teacher: "Dr. Elena Santos", grade: "Grade 10", average: 81, movement: "-1.4" },
  ];

  const watchlist = [
    { name: "Luis Mendoza", grade: "Grade 7", reason: "Attendance below 85%", owner: "Adviser" },
    { name: "Ana Reyes", grade: "Grade 6", reason: "PACE completion below target", owner: "Teacher" },
    { name: "Pedro Garcia", grade: "Grade 10", reason: "Grade dropped by 6 points", owner: "Admin" },
    { name: "Maya Santos", grade: "Grade 5", reason: "Repeated missed activities", owner: "Teacher" },
  ];

  const trend = [
    { label: "Jun", value: 82 },
    { label: "Jul", value: 84 },
    { label: "Aug", value: 86 },
    { label: "Sep", value: 88 },
    { label: "Oct", value: 89 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={LineChart}
        title="School-wide Student Performance"
        subtitle="Admin and teacher dashboard for grades, attendance, PACE completion, class movement, and students needing attention."
      />

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="grid gap-4 p-5 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Grade Level</Label>
            <Select value={filters.gradeLevel} onValueChange={(value) => setFilters({ ...filters, gradeLevel: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grade Levels</SelectItem>
                <SelectItem value="grade-3">Grade 3</SelectItem>
                <SelectItem value="grade-4">Grade 4</SelectItem>
                <SelectItem value="grade-5">Grade 5</SelectItem>
                <SelectItem value="grade-6">Grade 6</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Term</Label>
            <Select value={filters.term} onValueChange={(value) => setFilters({ ...filters, term: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Term</SelectItem>
                <SelectItem value="previous">Previous Term</SelectItem>
                <SelectItem value="school-year">School Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Primary Metric</Label>
            <Select value={filters.metric} onValueChange={(value) => setFilters({ ...filters, metric: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overall">Overall Performance</SelectItem>
                <SelectItem value="grades">Grades</SelectItem>
                <SelectItem value="attendance">Attendance</SelectItem>
                <SelectItem value="pace">PACE Completion</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <Card key={item.label} className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-black text-slate-950">{item.value}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.note}</p>
                </div>
                <Badge variant={item.variant}>{item.variant === "success" ? "Good" : item.variant === "warning" ? "Review" : "Watch"}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-end gap-4">
              {trend.map((point) => (
                <div key={point.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                  <div className="flex h-52 w-full items-end rounded-lg bg-slate-100 px-2">
                    <div
                      className="w-full rounded-t-md bg-blue-600"
                      style={{ height: `${point.value}%` }}
                    />
                  </div>
                  <p className="text-xs font-semibold text-slate-500">{point.label}</p>
                  <p className="text-sm font-bold text-slate-900">{point.value}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Grade Level Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {gradePerformance.map((row) => (
              <div key={row.grade} className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 lg:grid-cols-[1fr_auto_auto_auto_auto] lg:items-center">
                <div>
                  <p className="font-semibold text-slate-950">{row.grade}</p>
                  <p className="text-sm text-slate-500">{row.students} students</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Average</p>
                  <p className="font-bold text-slate-900">{row.average}%</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Attendance</p>
                  <p className="font-bold text-slate-900">{row.attendance}%</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">PACE</p>
                  <p className="font-bold text-slate-900">{row.pace}%</p>
                </div>
                <Badge variant={row.status === "Needs support" ? "destructive" : row.status === "Review" ? "warning" : "success"}>
                  {row.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Class Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {classBreakdown.map((row) => (
              <div key={row.className} className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950">{row.className}</p>
                    <p className="text-sm text-slate-500">{row.grade} • {row.teacher}</p>
                  </div>
                </div>
                <p className="text-xl font-black text-slate-950">{row.average}%</p>
                <Badge variant={row.movement.startsWith("-") ? "warning" : "success"}>
                  {row.movement}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Students Needing Attention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {watchlist.map((student) => (
              <div key={student.name} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">{student.name}</p>
                    <p className="text-sm text-slate-500">{student.grade}</p>
                  </div>
                  <Badge variant="outline">{student.owner}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{student.reason}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function EfficacyEvaluation() {
  const [schedule, setSchedule] = useState({
    title: activeEvaluationCampaign.title,
    question: activeEvaluationCampaign.question,
    status: activeEvaluationCampaign.status,
    completion: activeEvaluationCampaign.completion,
    deadline: activeEvaluationCampaign.deadline,
  });

  const indicators = [
    { area: "Academic progress", score: "88%", status: "On track", owner: "Registrar" },
    { area: "Attendance consistency", score: "94%", status: "Strong", owner: "Admin" },
    { area: "Parent communication reach", score: "81%", status: "Review", owner: "Registrar" },
    { area: "PACE completion", score: "76%", status: "Needs support", owner: "Admin" },
  ];

  const reviews = [
    {
      title: "Quarterly academic review",
      scope: "Grades 4 to 12",
      summary: "Compare grade movement, completion rates, and attendance against the previous quarter.",
      due: "September 15, 2026",
    },
    {
      title: "Registrar workflow evaluation",
      scope: "Enrollment and document requests",
      summary: "Measure processing time for student records, document release, and enrollment validation.",
      due: "September 30, 2026",
    },
    {
      title: "Communication effectiveness check",
      scope: "Parents and advisers",
      summary: "Review announcement reach, unanswered parent concerns, and advisory follow-up completion.",
      due: "October 7, 2026",
    },
  ];

  const actionItems = [
    "Follow up with advisers for classes below 80% PACE completion.",
    "Prepare registrar report on delayed enrollment document requests.",
    "Review parent contact records with missing or outdated phone numbers.",
    "Schedule intervention planning for students with repeated absences.",
  ];
  const feedbackSummary = [
    { label: "Thumbs up", value: 128, icon: ThumbsUp, color: "text-emerald-600", bgColor: "bg-emerald-50" },
    { label: "Thumbs down", value: 17, icon: ThumbsDown, color: "text-red-600", bgColor: "bg-red-50" },
    { label: "Written notes", value: 17, icon: MessageSquareText, color: "text-blue-600", bgColor: "bg-blue-50" },
  ];
  const requiredResponses = 345;
  const submittedResponses = Math.round((requiredResponses * schedule.completion) / 100);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ClipboardCheck}
        title="Efficacy & Evaluation"
        subtitle="Review school programs, student outcomes, workflows, and improvement actions in one admin and registrar workspace."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Evaluation Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="evaluation-title">Evaluation Title</Label>
                <Input
                  id="evaluation-title"
                  value={schedule.title}
                  onChange={(event) => setSchedule({ ...schedule, title: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evaluation-deadline">Deadline</Label>
                <Input
                  id="evaluation-deadline"
                  type="date"
                  value={schedule.deadline}
                  onChange={(event) => setSchedule({ ...schedule, deadline: event.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[0.7fr_1fr]">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={schedule.status}
                  onValueChange={(value) => setSchedule({ ...schedule, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="evaluation-completion">Completion Percent</Label>
                <Input
                  id="evaluation-completion"
                  type="number"
                  min={0}
                  max={100}
                  value={schedule.completion}
                  onChange={(event) => setSchedule({ ...schedule, completion: Number(event.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="evaluation-question">Question shown to students and parents</Label>
              <Textarea
                id="evaluation-question"
                value={schedule.question}
                onChange={(event) => setSchedule({ ...schedule, question: event.target.value })}
                className="min-h-24"
              />
            </div>

            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-blue-950">Parent and student modal</p>
                  <p className="mt-1 text-sm leading-6 text-blue-800/80">
                    When status is Ongoing, students and parents are asked for thumbs up or thumbs down feedback.
                    Thumbs down requires a written note.
                  </p>
                </div>
                <Badge variant={schedule.status === "Ongoing" ? "success" : "secondary"}>
                  {schedule.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Status Tracker</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-950">Deadline</p>
                  <p className="mt-1 text-2xl font-black text-slate-950">{schedule.deadline}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">Completion</span>
                <span className="font-bold text-slate-950">{schedule.completion}%</span>
              </div>
              <Progress value={schedule.completion} className="h-3" />
              <p className="mt-2 text-sm text-slate-500">
                {submittedResponses} of {requiredResponses} parent/student responses submitted.
              </p>
            </div>

            <div className="grid gap-3">
              {feedbackSummary.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.bgColor}`}>
                        <Icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <p className="font-semibold text-slate-800">{item.label}</p>
                    </div>
                    <p className="text-xl font-black text-slate-950">{item.value}</p>
                  </div>
                );
              })}
            </div>

            <Button className="w-full">Save Evaluation Schedule</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Evaluation Cycles", value: "4", note: "Planned this school year" },
          { label: "Completed Reviews", value: "12", note: "Recorded across programs" },
          { label: "Open Action Items", value: actionItems.length.toString(), note: "Assigned for follow-up" },
        ].map((metric) => (
          <Card key={metric.label} className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{metric.label}</p>
              <p className="mt-2 text-3xl font-black text-slate-950">{metric.value}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{metric.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Evaluation Indicators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {indicators.map((indicator) => (
              <div key={indicator.area} className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                <div>
                  <p className="font-semibold text-slate-950">{indicator.area}</p>
                  <p className="text-sm text-slate-500">Owner: {indicator.owner}</p>
                </div>
                <p className="text-2xl font-black text-slate-950">{indicator.score}</p>
                <Badge variant={indicator.status === "Needs support" ? "destructive" : indicator.status === "Review" ? "warning" : "success"}>
                  {indicator.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Visible To</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {["Admin", "Registrar"].map((role) => (
                <Badge key={role} variant="secondary" className="rounded-full px-3 py-1 text-xs font-semibold">
                  {role}
                </Badge>
              ))}
            </div>
            <p className="text-sm leading-6 text-slate-600">
              This feature gives decision-makers a structured place to measure whether programs, workflows, and support
              systems are actually helping students and school operations improve.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Scheduled Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reviews.map((review) => (
              <div key={review.title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">{review.title}</p>
                    <p className="text-sm text-slate-500">{review.scope}</p>
                  </div>
                  <Badge variant="outline">{review.due}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{review.summary}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Action Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {actionItems.map((item, index) => (
              <div key={item} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
