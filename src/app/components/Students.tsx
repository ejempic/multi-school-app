import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useTenant } from "../contexts/TenantContext";
import { studentsByTenant, Student } from "../data/mockData";
import { 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  Edit2, 
  Download, 
  Upload, 
  Calendar, 
  FileText, 
  Info, 
  CheckCircle2, 
  LayoutDashboard,
  TrendingUp,
  Clock,
  Trophy,
  BookOpen,
  Stethoscope,
  CalendarCheck,
  Star
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Calendar as CalendarUI } from "./ui/calendar";
import { Checkbox } from "./ui/checkbox";
import { showSuccessToast } from "../utils/toastNotification";
import { PageHeader } from "./ui/page-header";

interface StudentLevel {
  id: number;
  name: string;
  code: string;
  studentCount?: number;
}

interface StudentsProps {
  onNavigate?: (view: any) => void;
}

export function Students({ onNavigate }: StudentsProps) {
  const { currentTenant } = useTenant();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [levels, setLevels] = useState<StudentLevel[]>([
    { id: 1, name: "Grade 12", code: "G12" },
    { id: 2, name: "Grade 11", code: "G11" },
    { id: 3, name: "Grade 10", code: "G10" },
    { id: 4, name: "Grade 9", code: "G9" },
  ]);
  const [newLevelName, setNewLevelName] = useState("");
  const [newLevelCode, setNewLevelCode] = useState("");
  const [editingLevelId, setEditingLevelId] = useState<number | null>(null);
  const [editLevelName, setEditLevelName] = useState("");
  const [editLevelCode, setEditLevelCode] = useState("");
  const [students, setStudents] = useState<Student[]>([]);

  // Promotion State
  const [isPromoteOpen, setIsPromoteOpen] = useState(false);
  const [promoteFrom, setPromoteFrom] = useState("");
  const [promoteTo, setPromoteTo] = useState("");
  const [selectedStudentsForPromotion, setSelectedStudentsForPromotion] = useState<number[]>([]);

  useEffect(() => {
    if (promoteFrom) {
        // Select all by default when grade changes
        const studentsInGrade = students.filter(s => s.grade === promoteFrom);
        setSelectedStudentsForPromotion(studentsInGrade.map(s => s.id));
    } else {
        setSelectedStudentsForPromotion([]);
    }
  }, [promoteFrom, students]);

  useEffect(() => {
    if (currentTenant) {
      setStudents(studentsByTenant[currentTenant.id] || []);
    }
  }, [currentTenant]);

  const [newParentName, setNewParentName] = useState("");
  const [newParentEmail, setNewParentEmail] = useState("");
  const [newParentPhone, setNewParentPhone] = useState("");
  const [newParentRelationship, setNewParentRelationship] = useState("");
  const [selectedStudentForParent, setSelectedStudentForParent] = useState<number | null>(null);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDisplayedStudents = () => {
    if (!selectedGrade && !searchQuery) {
      return [];
    }
    let displayed = filteredStudents;
    if (selectedGrade && selectedGrade !== "ALL") {
      displayed = displayed.filter(s => s.grade === selectedGrade);
    }
    return displayed;
  };

  const handleAddLevel = () => {
    if (newLevelName.trim() && newLevelCode.trim()) {
      const newLevel: StudentLevel = {
        id: Math.max(...levels.map(l => l.id), 0) + 1,
        name: newLevelName.trim(),
        code: newLevelCode.trim().toUpperCase(),
      };
      setLevels([...levels, newLevel]);
      setNewLevelName("");
      setNewLevelCode("");
    }
  };

  const handleDeleteLevel = (id: number) => {
    const deletedLevelName = levels.find(l => l.id === id)?.name;
    setLevels(levels.filter(level => level.id !== id));
    if (selectedGrade === deletedLevelName) {
      setSelectedGrade(null);
    }
  };

  const handleSaveEditedLevel = (levelId: number, updatedName: string, updatedCode: string) => {
    if (updatedName.trim() && updatedCode.trim()) {
      setLevels(levels.map(level =>
        level.id === levelId
          ? { ...level, name: updatedName.trim(), code: updatedCode.trim().toUpperCase() }
          : level
      ));
      if (selectedGrade === levels.find(l => l.id === levelId)?.name) {
        setSelectedGrade(updatedName.trim());
      }
      setEditingLevelId(null);
    }
  };

  const handleSaveEditedStudent = (studentId: number, updatedName: string, updatedEmail: string, updatedPhone: string) => {
    setStudents(students.map(student =>
      student.id === studentId
        ? { ...student, name: updatedName, email: updatedEmail, phone: updatedPhone }
        : student
    ));
  };

  const handlePromoteStudents = () => {
    if (!promoteFrom || !promoteTo || selectedStudentsForPromotion.length === 0) return;
    
    setStudents(currentStudents => currentStudents.map(student => {
        // Only promote if in source grade AND selected
        if (student.grade === promoteFrom && selectedStudentsForPromotion.includes(student.id)) {
            return {
                ...student,
                grade: promoteTo === "Graduated" ? student.grade : promoteTo, 
                status: promoteTo === "Graduated" ? "Alumni" : student.status,
                ...(promoteTo !== "Graduated" ? { grade: promoteTo } : {})
            };
        }
        return student;
    }));
    
    setIsPromoteOpen(false);
    setPromoteFrom("");
    setPromoteTo("");
    setSelectedStudentsForPromotion([]);
    showSuccessToast(`Successfully promoted ${selectedStudentsForPromotion.length} students from ${promoteFrom} to ${promoteTo}`);
  };

  const handleExportCSV = () => {
    const headers = ["Student ID", "Name", "Email", "Phone", "Grade", "Status", "GPA"];
    const csvContent = [
      headers.join(","),
      ...students.map(student =>
        [
          student.studentId,
          `"${student.name}"`,
          student.email,
          student.phone,
          student.grade,
          student.status,
          student.gpa
        ].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `students_${new Date().getTime()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split("\n").filter(line => line.trim());
        const headers = lines[0].split(",").map(h => h.trim());
        
        const importedStudents: Student[] = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",").map(v => v.trim().replace(/^"|"$/g, ""));
          
          if (values.length >= 7) {
            const newId = Math.max(...students.map(s => s.id), 0) + i;
            importedStudents.push({
              id: newId,
              studentId: values[0],
              name: values[1],
              email: values[2],
              phone: values[3],
              grade: values[4],
              status: (values[5] as "Active" | "Inactive") || "Active",
              gpa: parseFloat(values[6]) || 0,
              photo: "https://images.unsplash.com/photo-1633381182794-01b10764b431?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXQlMjBmZW1hbGV8ZW58MXx8fHwxNzY3ODA2MTg4fDA&ixlib=rb-4.1.0&q=80&w=1080"
            });
          }
        }
        
        if (importedStudents.length > 0) {
          setStudents([...students, ...importedStudents]);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      } catch (error) {
        console.error("Error importing CSV:", error);
        alert("Error importing CSV file. Please check the format.");
      }
    };
    reader.readAsText(file);
  };

  const StudentCard = ({ student }: { student: Student }) => {
    const [birthDate, setBirthDate] = useState<Date | undefined>(new Date(2012, 2, 12));
    
    return (
      <Card className="hover:shadow-lg transition-all duration-300 relative group overflow-hidden border-blue-50">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img src={student.photo} alt={student.name} className="w-16 h-16 rounded-xl object-cover ring-2 ring-white shadow-sm" />
            <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${student.status === "Active" ? "bg-emerald-500" : "bg-gray-400"}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-[#003366]">{student.name}</CardTitle>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{student.studentId}</span>
                  <Badge variant="outline" className="text-[9px] font-bold py-0 h-4 border-blue-100 text-blue-600 uppercase">
                    {student.grade}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <Mail className="h-3.5 w-3.5 text-[#003366]/60" />
            <span className="truncate">{student.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <Phone className="h-3.5 w-3.5 text-[#003366]/60" />
            <span>{student.phone}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-50">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="flex flex-col h-auto py-3 gap-1 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                <Calendar className="h-4 w-4" />
                <span className="text-[9px] font-black uppercase tracking-tighter">Attendance</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Attendance Record - {student.name}
                </DialogTitle>
                <DialogDescription>Monthly attendance overview and breakdown</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-emerald-50 border-emerald-100 p-4 text-center">
                    <p className="text-[10px] font-bold text-emerald-700 uppercase mb-1">Present</p>
                    <p className="text-2xl font-black text-emerald-900">142</p>
                  </Card>
                  <Card className="bg-rose-50 border-rose-100 p-4 text-center">
                    <p className="text-[10px] font-bold text-rose-700 uppercase mb-1">Absent</p>
                    <p className="text-2xl font-black text-rose-900">3</p>
                  </Card>
                  <Card className="bg-amber-50 border-amber-100 p-4 text-center">
                    <p className="text-[10px] font-bold text-amber-700 uppercase mb-1">Lates</p>
                    <p className="text-2xl font-black text-amber-900">5</p>
                  </Card>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Last 30 Days Log</p>
                  <div className="border rounded-xl overflow-hidden shadow-sm">
                    <div className="max-h-[300px] overflow-y-auto bg-gray-50/30">
                      <table className="w-full text-xs">
                        <thead className="bg-[#003366] text-white sticky top-0 z-10">
                          <tr>
                            <th className="p-2.5 text-left font-black uppercase tracking-tighter">Date</th>
                            <th className="p-2.5 text-left font-black uppercase tracking-tighter">Day</th>
                            <th className="p-2.5 text-center font-black uppercase tracking-tighter">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {Array.from({ length: 30 }, (_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() - i);
                            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                            const isWeekend = dayName === 'Saturday' || dayName === 'Sunday';
                            const statuses = ["Present", "Present", "Present", "Present", "Late", "Absent"];
                            const status = isWeekend ? "No Classes" : statuses[Math.floor(Math.random() * statuses.length)];
                            
                            return (
                              <tr key={i} className="hover:bg-white transition-colors">
                                <td className="p-2.5 font-medium text-gray-600">{date.toLocaleDateString()}</td>
                                <td className="p-2.5 text-gray-500">{dayName}</td>
                                <td className="p-2.5 text-center">
                                  <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-tighter px-2 h-5 ${
                                    status === "Present" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                    status === "Late" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                    status === "Absent" ? "bg-rose-50 text-rose-700 border-rose-200" :
                                    "bg-gray-100/50 text-gray-400 border-gray-200"
                                  }`}>
                                    {status}
                                  </Badge>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="flex flex-col h-auto py-3 gap-1 hover:bg-amber-50 hover:text-amber-700 transition-colors">
                <FileText className="h-4 w-4" />
                <span className="text-[9px] font-black uppercase tracking-tighter">PACEs</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-amber-600" />
                  PACE Progress & Scores
                </DialogTitle>
                <DialogDescription>Recent workbook performance and goal tracking</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="flex items-center gap-6 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Superior (94-100)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Passed (80-93)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-rose-500" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Failed (&lt;80)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-slate-200" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Not Started</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  {[
                    { name: "Mathematics", start: 101, scores: { 101: 96, 102: 92, 103: 98, 104: 78, 105: 88 } },
                    { name: "English", start: 101, scores: { 101: 94, 102: 95, 103: 82, 104: null } },
                    { name: "Science", start: 101, scores: { 101: 90, 102: 88, 103: 91 } },
                    { name: "Word Building", start: 101, scores: { 101: 100, 102: 100, 103: 98, 104: 96, 105: 95 } }
                  ].map((subject) => (
                    <div key={subject.name} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black text-[#003366] uppercase tracking-widest">{subject.name}</h4>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Level 1 Complete</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {Array.from({ length: 12 }, (_, i) => {
                          const num = subject.start + i;
                          const score = (subject.scores as any)[num];
                          let bgColor = "bg-slate-100 text-slate-400";
                          if (score !== undefined && score !== null) {
                            if (score >= 94) bgColor = "bg-amber-500 text-white shadow-sm shadow-amber-200";
                            else if (score >= 80) bgColor = "bg-emerald-500 text-white shadow-sm shadow-emerald-200";
                            else bgColor = "bg-rose-500 text-white shadow-sm shadow-rose-200";
                          }
                          return (
                            <div 
                              key={num} 
                              className={`h-10 w-10 rounded-lg flex flex-col items-center justify-center transition-all hover:scale-110 cursor-help ${bgColor}`}
                              title={score ? `Score: ${score}%` : "Not yet started"}
                            >
                              <span className="text-[10px] font-black leading-none mb-0.5">{num}</span>
                              {score && <span className="text-[8px] font-bold tracking-tighter">{score}</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-[11px] text-gray-400 font-medium">Click on a PACE number to see full feedback & supervisor notes.</p>
                  <Button className="bg-[#003366] h-10 px-6 font-bold" onClick={() => onNavigate?.("grades")}>Full Academic Audit</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="flex flex-col h-auto py-3 gap-1 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                <Info className="h-4 w-4" />
                <span className="text-[9px] font-black uppercase tracking-tighter">Profile</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-[#003366] uppercase tracking-tighter">Official Student Profile</DialogTitle>
                <DialogDescription>Comprehensive academic and personal record</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-8 py-6">
                {/* Header Section */}
                <div className="flex items-center gap-6 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <div className="h-24 w-24 rounded-2xl bg-[#003366] text-white flex items-center justify-center text-3xl font-black">
                    {student.name.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors p-1 rounded-md" contentEditable>{student.name}</h3>
                    <div className="flex items-center gap-3">
                      <Select defaultValue={student.grade}>
                        <SelectTrigger className="h-7 w-24 bg-blue-600 border-none text-white font-bold text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {levels.map(l => (
                            <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-gray-500 font-medium">UID: {student.id}</span>
                    </div>
                    <div className="flex gap-4 pt-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Status:</span>
                        <Select defaultValue="Active">
                          <SelectTrigger className="h-5 w-20 border-none shadow-none p-0 text-[10px] font-black uppercase text-[#003366]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="Graduate">Graduate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest"><span className="text-[#003366]">LRN:</span> 123456789012</p>
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Column 1: Personal info */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-[#003366] uppercase tracking-widest border-b pb-2">Personal Information</h4>
                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                      <div className="space-y-1">
                        <p className="text-gray-400 font-bold text-[10px] uppercase">Gender</p>
                        <Select defaultValue={student.studentId.includes('001') || student.studentId.includes('002') || student.studentId.includes('004') || student.studentId.includes('006') || student.studentId.includes('008') ? 'Male' : 'Female'}>
                          <SelectTrigger className="h-8 w-24 border-none shadow-none p-0 font-semibold focus:ring-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-400 font-bold text-[10px] uppercase">Birth Date</p>
                        <Popover>
                          <PopoverTrigger asChild>
                              <button className="font-semibold hover:text-blue-600 transition-colors text-left">
                                {birthDate ? birthDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Select Date"}
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarUI
                                mode="single"
                                selected={birthDate}
                                onSelect={setBirthDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-400 font-bold text-[10px] uppercase">Email Address</p>
                        <p className="font-semibold truncate cursor-pointer hover:bg-gray-50 transition-colors" contentEditable>{student.email}</p>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <p className="text-gray-400 font-bold text-[10px] uppercase">Home Address</p>
                        <p className="font-semibold cursor-pointer hover:bg-gray-50 transition-colors" contentEditable>Building 4, Sunrise Complex, Metro Manila</p>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Family & Guardian */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-[#003366] uppercase tracking-widest border-b pb-2">Family & Guardian</h4>
                    <div className="grid grid-cols-1 gap-y-4 text-sm">
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100/50">
                        <div className="space-y-0.5">
                          <p className="text-gray-400 font-bold text-[10px] uppercase">Parent/Guardian</p>
                          <p className="font-bold text-gray-900 line-clamp-1">Sarah Watson (Mother)</p>
                          <p className="text-xs text-blue-600 font-medium">sarah.w@email.com</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-400 font-bold text-[10px] uppercase">Emergency No.</p>
                        <p className="font-semibold text-red-600">+63 912 345 6789</p>
                      </div>
                    </div>
                  </div>

                  {/* Column 3 (Bottom full): Academic Overview */}
                  <div className="col-span-full space-y-4">
                    <h4 className="text-xs font-black text-[#003366] uppercase tracking-widest border-b pb-2">Academic Standing Overview</h4>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                      {[
                        { label: "Annual GPA", value: student.gpa, icon: TrendingUp, color: "text-emerald-600 bg-emerald-50" },
                        { label: "Yearly Rank", value: "4 / 32", icon: Trophy, color: "text-amber-600 bg-amber-50" },
                        { label: "Sick Days", value: "3 Days", icon: Stethoscope, color: "text-rose-600 bg-rose-50" },
                        { label: "Attendance", value: "98.2%", icon: CalendarCheck, color: "text-blue-600 bg-blue-50" },
                        { label: "Conduct Grade", value: "A+", icon: Star, color: "text-purple-600 bg-purple-50" }
                      ].map((stat, i) => (
                        <Card key={i} className="p-4 border-none shadow-sm flex flex-col justify-between h-24">
                          <div className="flex justify-between items-start">
                            <stat.icon className={`h-4 w-4 ${stat.color} p-0.5 rounded`} />
                            <span className="text-[9px] font-black text-gray-400 uppercase leading-none">{stat.label}</span>
                          </div>
                          <p className="text-xl font-black text-[#003366]">{stat.value}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="border-t pt-4">
                <Button variant="outline" className="font-bold" onClick={(e) => {
                  e.stopPropagation();
                  onNavigate?.("grades");
                }}>Full Academic Audit</Button>
                <Button className="bg-[#003366] font-bold">Save All Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
    );
  };

  return (
    <div className="flex gap-6">
      <div className="w-64 flex-shrink-0">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Student Levels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className={`flex items-center justify-between p-2 rounded transition-colors cursor-pointer ${selectedGrade === "ALL" ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}>
              <button onClick={() => { setSelectedGrade("ALL"); setSearchQuery(""); }} className="flex-1 text-left text-sm font-medium text-gray-700">
                <span>All Students</span>
                <span className="text-xs text-gray-500 ml-2">({students.length})</span>
              </button>
            </div>
            {levels.map((level) => {
              const studentCount = students.filter(s => s.grade === level.name).length;
              const isSelected = selectedGrade === level.name;
              return (
                <div key={level.id} className={`flex items-center justify-between p-2 rounded transition-colors cursor-pointer ${isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}>
                  <button onClick={() => setSelectedGrade(isSelected ? null : level.name)} className="flex-1 text-left text-sm font-medium text-gray-700">
                    <span>{level.name}</span>
                    <span className="text-xs text-gray-500 ml-2">({studentCount})</span>
                  </button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        ✎
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Level</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        handleSaveEditedLevel(level.id, formData.get("name") as string, formData.get("code") as string);
                      }} className="space-y-4">
                        <div>
                          <Label htmlFor={`level-name-${level.id}`}>Level Name</Label>
                          <Input id={`level-name-${level.id}`} name="name" defaultValue={level.name} />
                        </div>
                        <div>
                          <Label htmlFor={`level-code-${level.id}`}>Level Code</Label>
                          <Input id={`level-code-${level.id}`} name="code" defaultValue={level.code} />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button type="button" variant="outline">Cancel</Button>
                          <Button type="submit">Save</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        ×
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Level</DialogTitle>
                      </DialogHeader>
                      <p>Are you sure you want to delete "{level.name}"?</p>
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline">Cancel</Button>
                        <Button variant="destructive" onClick={() => handleDeleteLevel(level.id)}>Delete</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              );
            })}
          </CardContent>
        </Card>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full mt-4" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Level
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Level</DialogTitle>
              <DialogDescription>Create a new student level or academic grade.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="level-name">Level Name</Label>
                <Input id="level-name" placeholder="e.g., Grade 8" value={newLevelName} onChange={(e) => setNewLevelName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="level-code">Level Code</Label>
                <Input id="level-code" placeholder="e.g., G8" value={newLevelCode} onChange={(e) => setNewLevelCode(e.target.value)} />
              </div>
              <Button className="w-full" onClick={handleAddLevel}>Add Level</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 space-y-6">
        <PageHeader
          title="Students"
          subtitle="Manage and view all student information"
          actions={
            <>
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <Dialog open={isPromoteOpen} onOpenChange={setIsPromoteOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm border-indigo-700">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Promote
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Promote Students</DialogTitle>
                        <DialogDescription>Move students to the next grade level or graduate them.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Current Grade (From)</Label>
                            <Select value={promoteFrom} onValueChange={setPromoteFrom}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select current grade" />
                                </SelectTrigger>
                                <SelectContent>
                                    {levels.map(l => (
                                        <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Promote To (Target)</Label>
                            <Select value={promoteTo} onValueChange={setPromoteTo}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select target grade" />
                                </SelectTrigger>
                                <SelectContent>
                                    {levels.map(l => (
                                        <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>
                                    ))}
                                    <SelectItem value="Graduated">🎓 Graduate (Alumni)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {promoteFrom && (
                            <div className="space-y-3">
                                <div className="bg-blue-50 p-3 rounded text-sm text-blue-700 flex items-center gap-2 border border-blue-100">
                                    <Info className="h-4 w-4" />
                                    <span>Uncheck any students who should remain in the current grade (Retainers).</span>
                                </div>

                                <div className="border rounded-md p-3">
                                    <div className="flex items-center justify-between mb-3">
                                        <Label className="font-semibold">Student Selection</Label>
                                        <span className="text-xs text-muted-foreground bg-slate-100 px-2 py-1 rounded-full">
                                            {selectedStudentsForPromotion.length} selected
                                        </span>
                                    </div>
                                    
                                    <div className="max-h-[250px] overflow-y-auto space-y-1 pr-1">
                                        {students.filter(s => s.grade === promoteFrom).map(student => (
                                            <div key={student.id} className="flex items-center space-x-2 p-2 hover:bg-slate-50 rounded-md transition-colors border border-transparent hover:border-slate-100">
                                                <Checkbox 
                                                    id={`promo-${student.id}`} 
                                                    checked={selectedStudentsForPromotion.includes(student.id)}
                                                    onCheckedChange={(checked) => {
                                                        setSelectedStudentsForPromotion(prev => 
                                                            checked 
                                                                ? [...prev, student.id]
                                                                : prev.filter(id => id !== student.id)
                                                        );
                                                    }}
                                                />
                                                <Label 
                                                    htmlFor={`promo-${student.id}`} 
                                                    className="flex-1 cursor-pointer text-sm font-normal select-none"
                                                >
                                                    {student.name}
                                                </Label>
                                                <div 
                                                    className={`text-xs px-2 py-0.5 rounded ${
                                                        selectedStudentsForPromotion.includes(student.id) 
                                                            ? "bg-green-100 text-green-700" 
                                                            : "bg-orange-100 text-orange-700"
                                                    }`}
                                                >
                                                    {selectedStudentsForPromotion.includes(student.id) ? "Promoting" : "Retaining"}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {promoteTo === "Graduated" && (
                            <div className="bg-yellow-50 p-4 rounded text-sm text-yellow-700 flex items-center gap-2 border border-yellow-100">
                                <Trophy className="h-4 w-4" />
                                <span>Selected students will be marked as <strong>Alumni</strong> status.</span>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPromoteOpen(false)}>Cancel</Button>
                        <Button 
                            onClick={handlePromoteStudents} 
                            disabled={!promoteFrom || !promoteTo || selectedStudentsForPromotion.length === 0}
                        >
                            {selectedStudentsForPromotion.length > 0 
                                ? `Promote ${selectedStudentsForPromotion.length} Students` 
                                : "Confirm Promotion"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>Enter the student's information below.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter student name" />
                  </div>
                  <div>
                    <Label htmlFor="grade">Grade</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9">Grade 9</SelectItem>
                        <SelectItem value="10">Grade 10</SelectItem>
                        <SelectItem value="11">Grade 11</SelectItem>
                        <SelectItem value="12">Grade 12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="student@school.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" placeholder="(555) 123-4567" />
                  </div>
                  <Button className="w-full">Add Student</Button>
                </div>
              </DialogContent>
            </Dialog>
            </>
          }
        />

        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search students by name, email, ID or grade..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {getDisplayedStudents().length > 0 ? (
            <div>
              {selectedGrade && (
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{selectedGrade}</h2>
                  <Button variant="outline" size="sm" onClick={() => setSelectedGrade(null)}>Clear Selection</Button>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getDisplayedStudents().map((student) => (
                  <StudentCard key={student.id} student={student} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchQuery ? "No students found matching your search." : "Select a student level from the left panel to view students."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}