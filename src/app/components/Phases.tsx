import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { PageHeader } from "./ui/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { 
  BookOpen, 
  CheckCircle2, 
  UserCheck, 
  FileEdit, 
  ChevronRight, 
  Search,
  Filter,
  GraduationCap,
  Clock,
  User,
  Download,
  Upload
} from "lucide-react";
import { showSuccessToast } from "../utils/toastNotification";

interface Workbook {
  id: string;
  number: string;
  status: "not-started" | "in-progress" | "supervisor-check" | "self-test" | "completed";
  score?: number;
}

interface Subject {
  id: string;
  name: string;
  grades: {
    [key: string]: Workbook[];
  };
}

interface PhasesProps {
  userRole?: string | null;
  userData?: any;
  onNavigate?: (view: any) => void;
}

export function Phases({ userRole, userData, onNavigate }: PhasesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    userRole === "student" ? "STU001" : "STU001"
  );
  const [activeSubject, setActiveSubject] = useState<string | null>(null);

  // If student, lock them to their own ID
  const student = userRole === "student" ? { id: "STU001", name: userData?.name || "Student" } : null;

  const students = [
    { id: "STU001", name: "Russell Joshua R. Empic", grade: "Grade 3" },
    { id: "STU002", name: "Liam Johnson", grade: "Grade 2" },
    { id: "STU003", name: "Olivia Brown", grade: "Grade 1" },
  ];

  const subjects: string[] = [
    "Math", "English", "Literature", "Social Studies", "Science", "Word Building", "Filipino", "Araling Panlipunan"
  ];

  const grades: string[] = ["GRADE 1", "GRADE 2", "GRADE 3"];

  // Helper to generate workbooks with optional statuses and scores
  const genWorkbooks = (
    input: string | number, 
    count?: number, 
    details: Record<string, { status: Workbook["status"]; score?: number }> = {}
  ) => {
    let paceNumbers: string[] = [];
    
    if (typeof input === "string" && input.includes(",")) {
      paceNumbers = input.split(",").map(n => n.trim());
    } else {
      const start = typeof input === "number" ? input : parseInt(input);
      paceNumbers = Array.from({ length: count || 12 }, (_, i) => (start + i).toString());
    }

    return paceNumbers.map(num => ({
      id: `wb-${num}`,
      number: num,
      status: details[num]?.status || "not-started",
      score: details[num]?.score || 0
    }));
  };

  const [studentProgress, setStudentProgress] = useState<Record<string, Subject[]>>({
    "STU001": [
      {
        id: "math",
        name: "Math",
        grades: {
          "GRADE 3": genWorkbooks("1037, 1038, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048", 12, { 
            "1037": { status: "completed", score: 98 }, 
            "1038": { status: "self-test", score: 0 }, 
            "1039": { status: "completed", score: 85 } 
          })
        }
      },
      {
        id: "english",
        name: "English",
        grades: {
          "GRADE 3": genWorkbooks("1037, 1038, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048", 12, { 
            "1037": { status: "completed", score: 94 }, 
            "1038": { status: "in-progress", score: 0 }, 
            "1040": { status: "completed", score: 96 } 
          })
        }
      },
      {
        id: "lit",
        name: "Literature",
        grades: {
          "GRADE 2": genWorkbooks("1019, 1020, 1021, 1022, 1023, 1024", 6, { 
            "1021": { status: "in-progress" }, 
            "1022": { status: "in-progress" }, 
            "1023": { status: "in-progress" }, 
            "1024": { status: "completed", score: 100 } 
          }),
          "GRADE 3": genWorkbooks(1025, 12)
        }
      },
      {
        id: "social",
        name: "Social Studies",
        grades: {
          "GRADE 3": genWorkbooks(1037, 12, { 
            "1038": { status: "in-progress" }, 
            "1039": { status: "completed", score: 92 } 
          })
        }
      },
      {
        id: "science",
        name: "Science",
        grades: {
          "GRADE 3": genWorkbooks(1037, 12, { 
            "1039": { status: "completed", score: 88 } 
          })
        }
      },
      {
        id: "word",
        name: "Word Building",
        grades: {
          "GRADE 2": genWorkbooks("1025, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1036", 12, { 
            "1025": { status: "in-progress" }, 
            "1026": { status: "in-progress" }, 
            "1031": { status: "completed", score: 97 },
            "1032": { status: "completed", score: 95 }
          }),
          "GRADE 3": genWorkbooks(1037, 12)
        }
      },
      {
        id: "filipino",
        name: "Filipino",
        grades: {
          "GRADE 2": genWorkbooks("1021, 1022, 1023, 1024", 4, { 
            "1021": { status: "completed", score: 90 }, 
            "1022": { status: "in-progress" } 
          }),
          "GRADE 3": genWorkbooks(1025, 12)
        }
      },
      {
        id: "araling",
        name: "Araling Panlipunan",
        grades: {
          "GRADE 1": genWorkbooks(1007, 6, { 
            "1007": { status: "completed", score: 100 }, 
            "1008": { status: "completed", score: 99 } 
          }),
          "GRADE 2": genWorkbooks(1013, 12, { 
            "1013": { status: "in-progress" }, 
            "1016": { status: "completed", score: 94 } 
          }),
          "GRADE 3": genWorkbooks(1025, 12)
        }
      }
    ]
  });

  const currentSubjects = studentProgress[selectedStudentId] || [];

  const handleStatusUpdate = (subjectId: string, grade: string, workbookId: string, newStatus: Workbook["status"]) => {
    setStudentProgress(prev => ({
      ...prev,
      [selectedStudentId]: prev[selectedStudentId].map(s => {
        if (s.id === subjectId) {
          return {
            ...s,
            grades: {
              ...s.grades,
              [grade]: s.grades[grade].map(wb => wb.id === workbookId ? { ...wb, status: newStatus } : wb)
            }
          };
        }
        return s;
      })
    }));

    showSuccessToast("PACE Updated", `PACE status set to ${newStatus.replace("-", " ")}`);
  };

  const exportProgress = () => {
    const student = students.find(s => s.id === selectedStudentId);
    const headers = ["Subject,Grade,PACE,Status"];
    const rows: string[] = [];
    
    currentSubjects.forEach(subject => {
      Object.entries(subject.grades).forEach(([grade, workbooks]) => {
        workbooks.forEach(wb => {
          rows.push(`${subject.name},${grade},${wb.number},${wb.status}`);
        });
      });
    });

    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${student?.name}_pace_progress.csv`);
    document.body.appendChild(link);
    link.click();
    showSuccessToast("Exported", "Student progress exported to CSV");
  };

  const importProgress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n").slice(1);
      
      const newProgress = { ...studentProgress };
      const subjects = [...(newProgress[selectedStudentId] || [])];

      lines.forEach(line => {
        if (!line.trim()) return;
        const [subjName, grade, paceNum, status] = line.split(",").map(v => v.trim());
        
        const subjIndex = subjects.findIndex(s => s.name === subjName);
        if (subjIndex > -1) {
          const grades = { ...subjects[subjIndex].grades };
          if (grades[grade]) {
            grades[grade] = grades[grade].map(wb => 
              wb.number === paceNum ? { ...wb, status: status as Workbook["status"] } : wb
            );
            subjects[subjIndex] = { ...subjects[subjIndex], grades };
          }
        }
      });

      setStudentProgress({
        ...newProgress,
        [selectedStudentId]: subjects
      });
      showSuccessToast("Imported", "Student progress updated from file");
    };
    reader.readAsText(file);
  };

  const getStatusColor = (wb: Workbook) => {
    // Priority 1: Scores (if present)
    if (wb.score && wb.score > 0) {
      if (wb.score >= 94) return "bg-amber-100 border-amber-300 text-amber-700 shadow-sm";
      if (wb.score >= 80) return "bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm";
      return "bg-rose-50 border-rose-200 text-rose-500 shadow-sm";
    }
    
    // Priority 2: Statuses
    switch (wb.status) {
      case "completed": return "bg-pink-400 text-white border-pink-500";
      case "self-test": return "bg-purple-500 text-white border-purple-600";
      case "supervisor-check": return "bg-blue-500 text-white border-blue-600";
      case "in-progress": return "bg-yellow-400 text-black border-yellow-500";
      default: return "bg-white text-gray-300 border-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={BookOpen}
        title="PACE Progress"
        subtitle={userRole === "student" ? "Your personal PACE progress and scores." : "Detailed student workbook (PACE) tracking matrix."}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={exportProgress}>
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
              <div className="relative">
                <input
                  type="file"
                  accept=".csv"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={importProgress}
                />
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" /> Import
                </Button>
              </div>
            </div>

            {userRole !== "student" && (
              <div className="flex items-center gap-2 bg-white p-1.5 px-3 rounded-lg border shadow-sm w-full sm:w-auto">
                <User className="h-4 w-4 text-blue-500" />
                <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                  <SelectTrigger className="border-0 shadow-none focus:ring-0 w-[220px]">
                    <SelectValue placeholder="Select Student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {userRole === "student" && (
              <div className="flex items-center gap-2 bg-blue-50 p-1.5 px-4 rounded-lg border border-blue-100 shadow-sm">
                <User className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold">{userData?.name}</span>
              </div>
            )}
          </div>
        }
      />

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-amber-100/50">
                <th className="border p-4 text-left w-48 font-bold text-gray-700">SUBJECT</th>
                {grades.map(grade => (
                  <th key={grade} className="border p-4 text-center font-bold text-gray-700">{grade}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjects.map(subjectName => {
                const subjectData = currentSubjects.find(s => s.name === subjectName);
                return (
                  <tr key={subjectName}>
                    <td className={`border p-4 font-bold bg-gray-50/50 ${userRole === 'student' ? 'text-lg py-12' : ''}`}>
                      <div className="flex flex-col">
                        <span>{subjectName}</span>
                        {userRole === 'student' && <span className="text-xs font-normal text-muted-foreground italic mt-1">Current Progress</span>}
                      </div>
                    </td>
                    {grades.map(grade => {
                      const workbooks = subjectData?.grades[grade] || [];
                      return (
                        <td key={grade} className="border p-4 align-top min-w-[240px]">
                          <div className="flex flex-wrap gap-1.5">
                            {workbooks.map(wb => (
                              <DropdownMenu key={wb.id}>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    className={`${userRole === 'student' ? 'h-14 w-14' : 'h-11 w-11'} font-bold rounded-md flex flex-col items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm border ${getStatusColor(wb)}`}
                                  >
                                    <span className="text-[9px] uppercase tracking-tighter opacity-70 leading-none mb-1">{wb.number}</span>
                                    <span className={userRole === 'student' ? 'text-sm' : 'text-[11px]'}>
                                      {wb.score && wb.score > 0 ? wb.score : 
                                       wb.status === "in-progress" ? "..." : 
                                       wb.status === "supervisor-check" ? "SC" :
                                       wb.status === "self-test" ? "ST" : "-"}
                                    </span>
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-48">
                                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-widest bg-gray-50 mb-1">Update PACE {wb.number}</div>
                                  <DropdownMenuItem onClick={() => subjectData && handleStatusUpdate(subjectData.id, grade, wb.id, "in-progress")}>
                                    <div className="h-2 w-2 rounded-full bg-yellow-400 mr-2" /> Set In Progress
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => subjectData && handleStatusUpdate(subjectData.id, grade, wb.id, "supervisor-check")}>
                                    <div className="h-2 w-2 rounded-full bg-blue-500 mr-2" /> Supervisor Check
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => subjectData && handleStatusUpdate(subjectData.id, grade, wb.id, "self-test")}>
                                    <div className="h-2 w-2 rounded-full bg-purple-500 mr-2" /> Self Test
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => subjectData && handleStatusUpdate(subjectData.id, grade, wb.id, "completed")}>
                                    <div className="h-2 w-2 rounded-full bg-pink-400 mr-2" /> Mark Completed
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => subjectData && handleStatusUpdate(subjectData.id, grade, wb.id, "not-started")}>
                                    Reset to Not Started
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ))}
                            {workbooks.length === 0 && <div className="h-8 w-full bg-gray-50/30 rounded border border-dashed border-gray-100 italic text-[10px] text-gray-300 flex items-center justify-center">N/A</div>}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <Card className="p-6 bg-gray-50 border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 flex-1">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">PACE Matrix Legend</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Target Scores</span>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-amber-100 border border-amber-300 shadow-sm" />
                  <span className="text-sm">Superior (94-100)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-emerald-50 border border-emerald-200 shadow-sm" />
                  <span className="text-sm">Passed (80+ )</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-rose-50 border border-rose-200 shadow-sm" />
                  <span className="text-sm">Failed (&lt; 80)</span>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Workflow Status</span>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-yellow-400" />
                  <span className="text-sm">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-blue-500" />
                  <span className="text-sm">Supervisor Check</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-purple-500" />
                  <span className="text-sm">Self Test</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-3">
            <p className="text-xs text-muted-foreground font-medium max-w-[200px] text-center md:text-right">
              View official transcripts and quarterly performance reports.
            </p>
            <Button 
              className="bg-[#003366] hover:bg-[#002244] font-bold px-8 shadow-lg shadow-blue-900/10"
              onClick={() => onNavigate?.("grades")}
            >
              Full Academic Audit
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
