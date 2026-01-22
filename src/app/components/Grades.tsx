import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Progress } from "./ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Plus, 
  GraduationCap, 
  FileText, 
  Search,
  CheckCircle2,
  AlertCircle,
  Download,
  User,
  Trophy,
  Clock,
  Calendar
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "./ui/table";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { showSuccessToast } from "../utils/toastNotification";
import { useTenant } from "../contexts/TenantContext";
import { PageHeader } from "./ui/page-header";

interface PaceScore {
  id: number;
  studentId: string;
  subject: string;
  category: "Written Work" | "Performance Task" | "Periodic Exam";
  title: string;
  score: number;
  maxScore: number;
  date: string;
  quarter: number;
}

interface StudentRecord {
  id: string;
  name: string;
  grade: string;
  gpa: number;
  rank: string;
  totalStudents: number;
  attendance: string;
  activities: number;
  subjectGrades: SubjectGrade[];
}

interface SubjectGrade {
  subject: string;
  teacher: string;
  q1: number | null;
  q2: number | null;
  q3: number | null;
  q4: number | null;
  final: number | null;
  status: "Pass" | "Fail" | "Incomplete";
}

interface GradesProps {
  userRole: "admin" | "teacher" | "parent" | "student" | null;
  userData: any;
}

export function Grades({ userRole, userData }: GradesProps) {
  const { currentTenant } = useTenant();
  const tenantId = currentTenant?.id.toUpperCase() || "SCHOOL";
  const theme = currentTenant?.theme || { primary: "#1e3a8a", secondary: "#1d4ed8", accent: "#eab308" };
  const [activeTab, setActiveTab] = useState("report-card");
  const [selectedQuarter, setSelectedQuarter] = useState("1");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [students] = useState<StudentRecord[]>([
    {
      id: "STU-001",
      name: "Emma Watson",
      grade: "Grade 12",
      gpa: 91.7,
      rank: "4th",
      totalStudents: 32,
      attendance: "98%",
      activities: 8,
      subjectGrades: [
        { subject: "Mathematics", teacher: "Mr. Marcus Johnson", q1: 92, q2: 88, q3: null, q4: null, final: 90, status: "Pass" },
        { subject: "English Literature", teacher: "Ms. Sarah Smith", q1: 95, q2: 94, q3: null, q4: null, final: 94.5, status: "Pass" },
        { subject: "Advanced Physics", teacher: "Dr. Elena Santos", q1: 85, q2: 87, q3: null, q4: null, final: 86, status: "Pass" },
        { subject: "World History", teacher: "Mrs. Clara Gomez", q1: 90, q2: 92, q3: null, q4: null, final: 91, status: "Pass" },
        { subject: "Computer Science", teacher: "Mr. Marcus Johnson", q1: 98, q2: 96, q3: null, q4: null, final: 97, status: "Pass" },
      ]
    },
    {
      id: "STU-002",
      name: "Liam Johnson",
      grade: "Grade 11",
      gpa: 88.4,
      rank: "12th",
      totalStudents: 30,
      attendance: "94%",
      activities: 5,
      subjectGrades: [
        { subject: "Chemistry", teacher: "Ms. Rita Reyes", q1: 90, q2: 85, q3: null, q4: null, final: 87.5, status: "Pass" },
        { subject: "Mathematics", teacher: "Mr. Marcus Johnson", q1: 82, q2: 84, q3: null, q4: null, final: 83, status: "Pass" },
        { subject: "English", teacher: "Ms. Sarah Smith", q1: 88, q2: 90, q3: null, q4: null, final: 89, status: "Pass" },
      ]
    }
  ]);

  const [selectedStudentId, setSelectedStudentId] = useState(
    userRole === "student" ? userData?.id || "STU-001" : 
    userRole === "parent" ? userData?.children?.[0]?.id || "STU-001" : 
    "STU-001"
  );

  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const [paceScores] = useState<PaceScore[]>([
    { id: 1, studentId: "STU-001", subject: "Mathematics", category: "Written Work", title: "PACE 101 Quiz", score: 45, maxScore: 50, date: "2026-01-05", quarter: 1 },
    { id: 2, studentId: "STU-001", subject: "Mathematics", category: "Performance Task", title: "PACE 101 Project", score: 95, maxScore: 100, date: "2026-01-08", quarter: 1 },
    { id: 3, studentId: "STU-001", subject: "English", category: "Written Work", title: "PACE 108 Essay", score: 88, maxScore: 100, date: "2026-01-04", quarter: 1 },
    { id: 4, studentId: "STU-001", subject: "Physics", category: "Periodic Exam", title: "PACE Physics Final Q1", score: 82, maxScore: 100, date: "2026-01-10", quarter: 1 },
    { id: 5, studentId: "STU-002", subject: "Mathematics", category: "Written Work", title: "PACE 101 Quiz", score: 38, maxScore: 50, date: "2026-01-05", quarter: 1 },
    { id: 6, studentId: "STU-001", subject: "Science", category: "Performance Task", title: "PACE 112 Experiment", score: 92, maxScore: 100, date: "2026-01-12", quarter: 1 },
  ]);

  const subjects = ["all", ...Array.from(new Set(paceScores.map(a => a.subject)))];
  
  const filteredPaceScores = paceScores.filter(a => {
    const isStudentMatch = a.studentId === selectedStudentId;
    const isSubjectMatch = selectedSubject === "all" || a.subject === selectedSubject;
    const isQuarterMatch = a.quarter.toString() === selectedQuarter;
    const isSearchMatch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
    return isStudentMatch && isSubjectMatch && isQuarterMatch && isSearchMatch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pass": return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Passing</Badge>;
      case "Fail": return <Badge variant="destructive">Failing</Badge>;
      default: return <Badge variant="secondary">Incomplete</Badge>;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Written Work": return "text-blue-600 bg-blue-50";
      case "Performance Task": return "text-purple-600 bg-purple-50";
      case "Periodic Exam": return "text-amber-600 bg-amber-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <PageHeader
        title="Academic Records"
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <p className="text-sm text-gray-500 font-medium">{tenantId} Official Student Performance & PACE SCORES</p>

        <div className="flex items-center gap-2">
          {(userRole === "admin" || userRole === "teacher") && (
            <div className="flex items-center gap-2 mr-4 bg-blue-50/50 p-1.5 rounded-lg border border-blue-100">
              <span className="text-xs font-bold px-2" style={{ color: theme.primary }}>STUDENT:</span>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger className="w-[200px] h-8 text-xs font-bold border-none bg-white shadow-sm ring-0 focus:ring-0">
                  <SelectValue placeholder="Select Student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map(s => (
                    <SelectItem key={s.id} value={s.id} className="text-xs font-medium">
                      {s.name} ({s.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <Button variant="outline" className="h-10 font-bold bg-white shadow-sm" style={{ borderColor: theme.secondary, color: theme.primary }}>
            <Download className="h-4 w-4 mr-2" />
            Official PDF Review
          </Button>

          {(userRole === "admin" || userRole === "teacher") && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="h-10 px-6 font-bold text-white shadow-md" style={{ backgroundColor: theme.primary, borderColor: theme.primary }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Grade PACE
                </Button>
              </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add PACE Score Record</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
                        <SelectContent>
                          {subjects.filter(s => s !== "all").map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="written">Written Work</SelectItem>
                            <SelectItem value="performance">Performance Task</SelectItem>
                            <SelectItem value="periodic">Periodic Exam</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Quarter</Label>
                        <Select defaultValue="1">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1st Quarter</SelectItem>
                            <SelectItem value="2">2nd Quarter</SelectItem>
                            <SelectItem value="3">3rd Quarter</SelectItem>
                            <SelectItem value="4">4th Quarter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>PACE Title/Number</Label>
                      <Input placeholder="e.g. PACE 101 Quiz" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Score</Label>
                        <Input type="number" placeholder="0" />
                      </div>
                      <div className="space-y-2">
                        <Label>Max Score</Label>
                        <Input type="number" placeholder="100" />
                      </div>
                    </div>
                    <Button className="w-full h-11 font-bold" style={{ backgroundColor: theme.primary, color: 'white' }} onClick={() => showSuccessToast("✓ PACE Saved", "The score has been recorded.")}>Save Score</Button>
                  </div>
                </DialogContent>
              </Dialog>
        )}
        </div>
      </div>

      <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-br from-[#003366] via-[#004080] to-[#0055a4] text-white">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm">
                  <User className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Active Student</p>
                  <h2 className="text-lg font-bold truncate leading-tight">{currentStudent.name}</h2>
                  <p className="text-xs text-blue-200 font-medium">{currentStudent.id}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 flex flex-col justify-center">
              <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Level & Section</p>
              <div className="flex items-center gap-2 mt-1">
                <h3 className="text-xl font-bold">{currentStudent.grade}</h3>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-none text-[10px] font-bold">ACTIVE</Badge>
              </div>
            </div>

            <div className="p-6 flex flex-col justify-center">
              <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Academic Rank</p>
              <div className="flex items-center gap-2 mt-1">
                <Trophy className="h-5 w-5 text-amber-400" />
                <h3 className="text-xl font-bold">{currentStudent.rank} <span className="text-sm font-medium text-white/40">of {currentStudent.totalStudents}</span></h3>
              </div>
            </div>

            <div className="p-6 flex flex-col justify-center">
              <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Institutional GPA</p>
              <div className="flex items-center gap-3 mt-1">
                <h3 className="text-3xl font-black">{currentStudent.gpa}</h3>
                <div className="flex flex-col">
                  {currentStudent.gpa >= 90 ? (
                    <span className="text-[10px] font-bold text-white bg-emerald-600 px-1.5 py-0.5 rounded">HONOR</span>
                  ) : (
                    <span className="text-[10px] font-bold text-blue-900 bg-white px-1.5 py-0.5 rounded">REGULAR</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] h-12 bg-blue-50/50 p-1 rounded-xl">
          <TabsTrigger value="report-card" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm">
            <GraduationCap className="h-4 w-4 mr-2" />
            Report Card
          </TabsTrigger>
          <TabsTrigger value="pace-scores" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm text-gray-500">
            <FileText className="h-4 w-4 mr-2" />
            PACE SCORES
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="report-card" className="space-y-6 m-0">
            <Card className="border-blue-100 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-[#003366]">Official Report Card</CardTitle>
                    <CardDescription className="text-xs font-medium">School Year 2025-2026</CardDescription>
                  </div>
                  <Badge variant="outline" className="border-blue-200 text-[#003366] bg-blue-50/50 uppercase text-[10px] py-1 font-bold">Authenticated Record</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead className="font-bold text-[#003366] py-4 pl-6">Subject Area</TableHead>
                      <TableHead className="font-bold text-[#003366] text-center">First Qtr</TableHead>
                      <TableHead className="font-bold text-[#003366] text-center">Second Qtr</TableHead>
                      <TableHead className="font-bold text-[#003366] text-center">Third Qtr</TableHead>
                      <TableHead className="font-bold text-[#003366] text-center">Fourth Qtr</TableHead>
                      <TableHead className="font-bold text-[#003366] text-center">Final</TableHead>
                      <TableHead className="font-bold text-[#003366] text-right pr-6">Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentStudent.subjectGrades.map((grade) => (
                      <TableRow key={grade.subject} className="hover:bg-blue-50/30 transition-colors">
                        <TableCell className="py-4 pl-6">
                          <p className="font-bold text-slate-900">{grade.subject}</p>
                          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter">{grade.teacher}</p>
                        </TableCell>
                        <TableCell className="text-center font-medium text-slate-600">{grade.q1 || "—"}</TableCell>
                        <TableCell className="text-center font-medium text-slate-600">{grade.q2 || "—"}</TableCell>
                        <TableCell className="text-center font-medium text-slate-400 italic font-normal text-xs">{grade.q3 || "N/A"}</TableCell>
                        <TableCell className="text-center font-medium text-slate-400 italic font-normal text-xs">{grade.q4 || "N/A"}</TableCell>
                        <TableCell className="text-center font-black text-blue-700">{grade.final ? grade.final.toFixed(1) : "—"}</TableCell>
                        <TableCell className="text-right pr-6">
                          {getStatusBadge(grade.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-slate-50/30 font-black">
                      <TableCell className="pl-6 text-[#003366]">GENERAL AVERAGE</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center">-</TableCell>
                      <TableCell className="text-center text-blue-700 underline underline-offset-4">{currentStudent.gpa}</TableCell>
                      <TableCell className="text-right pr-6">
                        <Badge className="bg-emerald-600">PASSING</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-blue-50 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#003366]">
                    <Clock className="h-4 w-4" />
                    Attendance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-3xl font-black text-[#003366]">{currentStudent.attendance}</span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter pb-1">Total Attendance Rate</span>
                  </div>
                  <Progress value={parseFloat(currentStudent.attendance)} className="h-2 bg-blue-50" />
                </CardContent>
              </Card>

              <Card className="border-blue-50 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#003366]">
                    <Trophy className="h-4 w-4" />
                    Student Development
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Badge variant="outline" className="border-blue-100 text-blue-600 text-[10px] font-bold">Maka-Diyos</Badge>
                  <Badge variant="outline" className="border-blue-100 text-blue-600 text-[10px] font-bold">Makatao</Badge>
                  <Badge variant="outline" className="border-blue-100 text-blue-600 text-[10px] font-bold">Makakalikasan</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pace-scores" className="space-y-6 m-0">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search PACE scores or titles..." 
                  className="pl-10 h-11 border-blue-50 focus-visible:ring-blue-100"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
                <SelectTrigger className="w-[160px] h-11 border-blue-50">
                  <SelectValue placeholder="Quarter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st Quarter</SelectItem>
                  <SelectItem value="2">2nd Quarter</SelectItem>
                  <SelectItem value="3">3rd Quarter</SelectItem>
                  <SelectItem value="4">4th Quarter</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-[180px] h-11 border-blue-50">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(s => (
                    <SelectItem key={s} value={s}>{s === "all" ? "All Subjects" : s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPaceScores.length > 0 ? (
                filteredPaceScores.map((a) => (
                  <Card key={a.id} className="border-blue-50 hover:border-blue-200 transition-all shadow-sm group">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-start justify-between">
                        <Badge variant="secondary" className={`${getCategoryColor(a.category)} border-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5`}>
                          {a.category}
                        </Badge>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{a.date}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-blue-900 group-hover:text-blue-600 transition-colors">{a.title}</h4>
                        <p className="text-[11px] text-gray-500 font-medium uppercase tracking-tight">{a.subject} • ID: {a.studentId}</p>
                      </div>

                      <div className="pt-2">
                        <div className="flex items-end justify-between mb-1.5">
                          <div>
                            <span className="text-2xl font-black text-blue-900">{a.score}</span>
                            <span className="text-gray-300 font-medium ml-1">/ {a.maxScore}</span>
                          </div>
                          <div className={`text-xs font-bold ${a.score / a.maxScore >= 0.75 ? "text-green-600" : "text-amber-600"}`}>
                            {((a.score / a.maxScore) * 100).toFixed(0)}%
                          </div>
                        </div>
                        <Progress value={(a.score / a.maxScore) * 100} className="h-1.5 bg-slate-100" />
                      </div>

                      <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {a.score / a.maxScore >= 0.75 ? (
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-amber-500" />
                          )}
                          <span className="text-[10px] font-bold text-gray-400 tracking-tight uppercase">Validation Status</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] font-bold text-blue-600 hover:bg-blue-50 uppercase">Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-blue-50/30 rounded-3xl border border-dashed border-blue-100">
                  <div className="bg-white h-12 w-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Search className="h-6 w-6 text-blue-300" />
                  </div>
                  <h3 className="text-blue-900 font-bold mb-1">No PACE SCORES Records</h3>
                  <p className="text-gray-400 text-xs">Try adjusting your filters or search terms</p>
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
