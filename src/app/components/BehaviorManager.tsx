import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { PageHeader } from "./ui/page-header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { 
  Award, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  FileText, 
  CheckCircle, 
  Search, 
  User,
  AlertCircle,
  Gavel,
  History,
  Star,
  Lock,
  Bell
} from "lucide-react";
import { showSuccessToast, showErrorToast } from "../utils/toastNotification";

// --- Types ---

interface BehaviorType {
  id: string;
  name: string;
  category: "Merit" | "Demerit";
  points: number; 
  description: string;
}

interface BehaviorRecord {
  id: string;
  studentId: string;
  studentName: string;
  typeId: string;
  typeName: string;
  category: "Merit" | "Demerit";
  points: number;
  date: string;
  notes: string;
  teacherName: string;
}

interface DisciplinaryLetter {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  type: "Warning" | "Suspension" | "Expulsion";
  title: string;
  content: string;
  status: "Sent" | "Confirmed";
  confirmedDate?: string;
  parentName?: string;
}

interface BehaviorManagerProps {
  userRole: "admin" | "teacher" | "parent" | "student" | null;
  userData: any;
}

// --- Mock Data ---

const INITIAL_BEHAVIOR_TYPES: BehaviorType[] = [
  // Merits
  { id: "M1", name: "Academic Excellence", category: "Merit", points: 5, description: "Outstanding performance in class or tests" },
  { id: "M2", name: "Good Citizenship", category: "Merit", points: 3, description: "Helping others, cleaning up, being respectful" },
  { id: "M3", name: "Perfect Attendance (Month)", category: "Merit", points: 10, description: "No absences or tardies for a month" },
  { id: "M4", name: "School Spirit", category: "Merit", points: 2, description: "Participating in school events with enthusiasm" },
  
  // Demerits
  { id: "D1", name: "Late to Class", category: "Demerit", points: 1, description: "Arriving after the bell without a pass" },
  { id: "D2", name: "Uniform Violation", category: "Demerit", points: 2, description: "Improper uniform or grooming" },
  { id: "D3", name: "Disruptive Behavior", category: "Demerit", points: 5, description: "Talking out of turn, distracting others" },
  { id: "D4", name: "Incomplete Homework", category: "Demerit", points: 3, description: "Failure to turn in assignments" },
  { id: "D5", name: "Bullying", category: "Demerit", points: 20, description: "Any form of harassment or bullying" },
];

const MOCK_STUDENTS = [
  { id: "STU001", name: "Emma Watson", grade: "Grade 12", parentName: "Sarah Watson" },
  { id: "STU002", name: "Liam Johnson", grade: "Grade 11", parentName: "James Johnson" },
  { id: "STU003", name: "Olivia Brown", grade: "Grade 10", parentName: "Robert Brown" },
  { id: "STU004", name: "Russell Joshua R. Empic", grade: "Grade 3", parentName: "Sarah Johnson" },
];

// --- Component ---

export function BehaviorManager({ userRole, userData }: BehaviorManagerProps) {
  // State
  const [behaviorTypes, setBehaviorTypes] = useState<BehaviorType[]>(INITIAL_BEHAVIOR_TYPES);
  const [records, setRecords] = useState<BehaviorRecord[]>([
    { id: "R1", studentId: "STU001", studentName: "Emma Watson", typeId: "M1", typeName: "Academic Excellence", category: "Merit", points: 5, date: "2024-03-10", notes: "Scored 100% on Math final", teacherName: "Mr. Smith" },
    { id: "R2", studentId: "STU002", studentName: "Liam Johnson", typeId: "D1", typeName: "Late to Class", category: "Demerit", points: 1, date: "2024-03-12", notes: "10 minutes late", teacherName: "Mrs. Davis" },
    { id: "R3", studentId: "STU004", studentName: "Russell Joshua R. Empic", typeId: "M2", typeName: "Good Citizenship", category: "Merit", points: 3, date: "2024-03-15", notes: "Helped clean up the classroom", teacherName: "Ms. Honey" },
  ]);
  const [letters, setLetters] = useState<DisciplinaryLetter[]>([
    { id: "L1", studentId: "STU002", studentName: "Liam Johnson", date: "2024-03-01", type: "Warning", title: "Notice of Conduct - Multiple Tardies", content: "Dear Parent, this is to inform you that Liam has been late to class 3 times this week.", status: "Confirmed", confirmedDate: "2024-03-02", parentName: "James Johnson" }
  ]);

  // UI State
  const [activeTab, setActiveTab] = useState("records");
  const [showAddTypeDialog, setShowAddTypeDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showLetterDialog, setShowLetterDialog] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  
  // Forms
  const [newType, setNewType] = useState<Partial<BehaviorType>>({ category: "Merit", points: 1 });
  const [assignForm, setAssignForm] = useState({ behaviorTypeId: "", notes: "" });
  const [letterForm, setLetterForm] = useState({ studentId: "", type: "Warning" as const, title: "", content: "" });

  // -- Handlers --

  const handleAddType = () => {
    if (!newType.name || !newType.points) return;
    const type: BehaviorType = {
      id: Date.now().toString(),
      name: newType.name,
      category: newType.category as "Merit" | "Demerit",
      points: Number(newType.points),
      description: newType.description || ""
    };
    setBehaviorTypes([...behaviorTypes, type]);
    setNewType({ category: "Merit", points: 1, name: "", description: "" });
    setShowAddTypeDialog(false);
    showSuccessToast("Success", "New behavior type created");
  };

  const handleDeleteType = (id: string) => {
    setBehaviorTypes(behaviorTypes.filter(t => t.id !== id));
    showSuccessToast("Deleted", "Behavior type removed");
  };

  const handleAssignBehavior = () => {
    if (!selectedStudentId || !assignForm.behaviorTypeId) return;
    
    const student = MOCK_STUDENTS.find(s => s.id === selectedStudentId);
    const behavior = behaviorTypes.find(b => b.id === assignForm.behaviorTypeId);
    
    if (student && behavior) {
      const newRecord: BehaviorRecord = {
        id: Date.now().toString(),
        studentId: student.id,
        studentName: student.name,
        typeId: behavior.id,
        typeName: behavior.name,
        category: behavior.category,
        points: behavior.points,
        date: new Date().toISOString().split('T')[0],
        notes: assignForm.notes,
        teacherName: userData?.name || "Teacher"
      };
      
      setRecords([newRecord, ...records]);
      setShowAssignDialog(false);
      setAssignForm({ behaviorTypeId: "", notes: "" });
      showSuccessToast("Assigned", `${behavior.category} recorded for ${student.name}`);
    }
  };

  const handleSendLetter = () => {
    if (!letterForm.studentId || !letterForm.content) return;
    
    const student = MOCK_STUDENTS.find(s => s.id === letterForm.studentId);
    if (student) {
      const newLetter: DisciplinaryLetter = {
        id: Date.now().toString(),
        studentId: student.id,
        studentName: student.name,
        date: new Date().toISOString().split('T')[0],
        type: letterForm.type,
        title: letterForm.title,
        content: letterForm.content,
        status: "Sent",
        parentName: student.parentName
      };
      
      setLetters([newLetter, ...letters]);
      setShowLetterDialog(false);
      setLetterForm({ studentId: "", type: "Warning", title: "", content: "" });
      showSuccessToast("Sent", `Letter sent to ${student.parentName}`);
    }
  };

  const handleConfirmLetter = (letterId: string) => {
    setLetters(letters.map(l => 
      l.id === letterId 
        ? { ...l, status: "Confirmed", confirmedDate: new Date().toISOString().split('T')[0] } 
        : l
    ));
    showSuccessToast("Confirmed", "You have acknowledged this letter");
  };

  // -- Render Helpers --

  const getStudentPoints = (studentId: string) => {
    const studentRecords = records.filter(r => r.studentId === studentId);
    const merits = studentRecords.filter(r => r.category === "Merit").reduce((sum, r) => sum + r.points, 0);
    const demerits = studentRecords.filter(r => r.category === "Demerit").reduce((sum, r) => sum + r.points, 0);
    return { merits, demerits, net: merits - demerits };
  };

  // -- Views --

  const renderAdminView = () => (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3 max-w-2xl">
        <TabsTrigger value="overview">Student Overview</TabsTrigger>
        <TabsTrigger value="configuration">Configuration</TabsTrigger>
        <TabsTrigger value="letters">Letters & Disciplinary</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="font-semibold text-gray-700">Student Standing</h3>
          <Button onClick={() => setShowAssignDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Quick Assign
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_STUDENTS.map(student => {
            const stats = getStudentPoints(student.id);
            return (
              <Card key={student.id} className={stats.demerits > 10 ? 'border-red-300 bg-red-50' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{student.name}</CardTitle>
                      <CardDescription>{student.grade}</CardDescription>
                    </div>
                    {stats.demerits > 10 && <AlertTriangle className="h-5 w-5 text-red-500" />}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm mb-4">
                    <div className="flex items-center gap-1 text-green-600 font-bold">
                      <Award className="h-4 w-4" /> {stats.merits}
                    </div>
                    <div className="flex items-center gap-1 text-red-600 font-bold">
                      <AlertCircle className="h-4 w-4" /> {stats.demerits}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {stats.demerits >= 15 && (
                      <Badge variant="destructive" className="w-full justify-center">Suspension Risk</Badge>
                    )}
                    <Button variant="outline" size="sm" className="w-full" onClick={() => {
                       setLetterForm(prev => ({ ...prev, studentId: student.id, title: "Warning Notice" }));
                       setShowLetterDialog(true);
                    }}>Send Letter</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </TabsContent>

      <TabsContent value="configuration" className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Merit & Demerit Types</h2>
          <Button onClick={() => setShowAddTypeDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Type
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700 flex items-center gap-2">
                <Award className="h-5 w-5" /> Merits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {behaviorTypes.filter(t => t.category === "Merit").map(type => (
                <div key={type.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                  <div>
                    <div className="font-semibold">{type.name}</div>
                    <div className="text-xs text-gray-500">{type.description}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-600">{type.points} pts</Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => handleDeleteType(type.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Demerits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {behaviorTypes.filter(t => t.category === "Demerit").map(type => (
                <div key={type.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                  <div>
                    <div className="font-semibold">{type.name}</div>
                    <div className="text-xs text-gray-500">{type.description}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="destructive">{type.points} pts</Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => handleDeleteType(type.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="letters" className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Disciplinary Correspondence</h2>
          <Button onClick={() => setShowLetterDialog(true)}>
            <FileText className="mr-2 h-4 w-4" /> Compose Letter
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            {letters.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No letters sent yet.</div>
            ) : (
              <div className="divide-y">
                {letters.map(letter => (
                  <div key={letter.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${letter.type === 'Suspension' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        <Gavel className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold">{letter.title}</div>
                        <div className="text-sm text-gray-600">
                          Student: {letter.studentName} | Parent: {letter.parentName}
                        </div>
                        <div className="text-xs text-gray-400">Sent: {letter.date}</div>
                      </div>
                    </div>
                    <div>
                      {letter.status === "Confirmed" ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex gap-1 items-center border-green-200">
                          <CheckCircle className="h-3 w-3" /> Confirmed {letter.confirmedDate}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600">Pending</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );

  const renderTeacherView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-blue-50 p-6 rounded-xl border border-blue-100">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Classroom Behavior</h2>
          <p className="text-blue-700">Assign merits and demerits to your students</p>
        </div>
        <Button size="lg" onClick={() => setShowAssignDialog(true)} className="bg-blue-600 hover:bg-blue-700">
          <Star className="mr-2 h-5 w-5" /> Assign Points
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {records.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(record => (
                  <div key={record.id} className="flex justify-between items-start border-b pb-3 last:border-0 hover:bg-gray-50 p-2 rounded transition-colors">
                    <div>
                      <div className="font-semibold">{record.studentName}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <span className={record.category === "Merit" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                          {record.typeName}
                        </span>
                        <span>•</span>
                        <span>{record.notes}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{record.date} by {record.teacherName}</div>
                    </div>
                    <Badge className={record.category === "Merit" ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200" : "bg-red-100 text-red-700 hover:bg-red-100 border-red-200"}>
                      {record.category === "Merit" ? "+" : "-"}{record.points}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Students</CardTitle>
            <CardDescription>Overview of behavior points</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-2">
               {MOCK_STUDENTS.map(student => {
                 const stats = getStudentPoints(student.id);
                 return (
                   <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                     <div>
                       <div className="font-medium">{student.name}</div>
                       <div className="text-xs text-gray-500">{student.grade}</div>
                     </div>
                     <div className="flex gap-3 text-sm">
                       <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded">+{stats.merits}</span>
                       <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded">-{stats.demerits}</span>
                     </div>
                   </div>
                 )
               })}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderParentView = () => {
    // For demo purposes, we will assume the logged in parent is for "Russell Joshua R. Empic" (STU004) or "Liam Johnson" (STU002) depending on context
    // But since userData doesn't have studentId easily mapping in this mock, 
    // we'll fetch letters for ALL children associated with this parent (matched by name in mock)
    // or fallback to STU004 for demo.
    
    // Attempt to match parent name or children
    const parentName = userData?.name || "Sarah Johnson"; 
    const myChildren = MOCK_STUDENTS.filter(s => s.parentName.includes(parentName.split(" ")[0])); // Simple partial match
    const childIds = myChildren.length > 0 ? myChildren.map(c => c.id) : ["STU004"];
    
    const myLetters = letters.filter(l => childIds.includes(l.studentId));
    const myRecords = records.filter(r => childIds.includes(r.studentId));

    return (
      <div className="space-y-6">
        {/* Letters/Alerts Section */}
        {myLetters.length > 0 && (
          <div className="space-y-4">
             <h3 className="font-bold text-lg flex items-center gap-2">
               <Bell className="h-5 w-5 text-yellow-600" /> Notifications
             </h3>
             {myLetters.map(letter => (
               <Card key={letter.id} className={`border-l-4 ${letter.type === "Suspension" ? "border-l-red-500" : "border-l-yellow-500"} shadow-md`}>
                 <CardContent className="pt-6">
                   <div className="flex justify-between items-start gap-4">
                     <div className="space-y-2 flex-1">
                       <div className="flex items-center gap-2">
                         <Badge variant={letter.type === "Suspension" ? "destructive" : "secondary"}>
                           {letter.type.toUpperCase()}
                         </Badge>
                         <span className="text-sm text-gray-500">{letter.date}</span>
                       </div>
                       <h4 className="font-bold text-lg">{letter.title}</h4>
                       <p className="text-gray-700 bg-gray-50 p-4 rounded-md text-sm leading-relaxed border">
                         {letter.content}
                       </p>
                       <div className="text-xs text-gray-500 mt-2">
                         Student: {letter.studentName}
                       </div>
                     </div>
                     <div className="flex flex-col items-end gap-2">
                       {letter.status === "Confirmed" ? (
                         <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-4 py-2 rounded-full border border-green-200">
                           <CheckCircle className="h-5 w-5" />
                           Acknowledged
                         </div>
                       ) : (
                         <Button onClick={() => handleConfirmLetter(letter.id)} className="whitespace-nowrap bg-blue-600 hover:bg-blue-700">
                           Acknowledge Receipt
                         </Button>
                       )}
                     </div>
                   </div>
                 </CardContent>
               </Card>
             ))}
          </div>
        )}

        {/* Records Section */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <History className="h-5 w-5 text-gray-600" /> Behavior History
          </h3>
          <Card>
            <CardContent className="p-0">
               <div className="divide-y">
                 {myRecords.length === 0 ? (
                   <div className="p-6 text-center text-gray-500">No behavior records found</div>
                 ) : (
                   myRecords.map(record => (
                     <div key={record.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                       <div className="flex items-start gap-3">
                         <div className={`mt-1 p-2 rounded-full ${record.category === "Merit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                           {record.category === "Merit" ? <Award className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                         </div>
                         <div>
                           <div className="font-semibold">{record.typeName}</div>
                           <div className="text-sm text-gray-600">{record.notes}</div>
                           <div className="text-xs text-gray-400 mt-1">{record.date} • {record.teacherName}</div>
                           {myChildren.length > 1 && <div className="text-xs font-medium text-blue-600">{record.studentName}</div>}
                         </div>
                       </div>
                       <div className={`font-bold text-lg ${record.category === "Merit" ? "text-green-600" : "text-red-600"}`}>
                         {record.category === "Merit" ? "+" : "-"}{record.points}
                       </div>
                     </div>
                   ))
                 )}
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <PageHeader
        icon={Award}
        title="Merits & Demerits"
        subtitle="Behavior tracking and disciplinary management"
      />

      {userRole === "admin" && renderAdminView()}
      {userRole === "teacher" && renderTeacherView()}
      {userRole === "parent" && renderParentView()}
      {userRole === "student" && (
         <div className="text-center py-20 bg-gray-50 rounded-lg">
           <Lock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
           <p className="text-gray-500">Access Restricted</p>
         </div>
      )}

      {/* --- Dialogs --- */}

      {/* Add Type Dialog */}
      <Dialog open={showAddTypeDialog} onOpenChange={setShowAddTypeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Behavior Type</DialogTitle>
            <DialogDescription>Define a new merit or demerit category</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={newType.category} onValueChange={(val: "Merit" | "Demerit") => setNewType({ ...newType, category: val })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Merit">Merit (Positive)</SelectItem>
                  <SelectItem value="Demerit">Demerit (Negative)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input placeholder="e.g. Late to Class" value={newType.name} onChange={e => setNewType({ ...newType, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Points</Label>
              <Input type="number" min="1" value={newType.points} onChange={e => setNewType({ ...newType, points: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input placeholder="Short description..." value={newType.description} onChange={e => setNewType({ ...newType, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddTypeDialog(false)}>Cancel</Button>
            <Button onClick={handleAddType}>Create Type</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Behavior Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Behavior Record</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Student</Label>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student..." />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_STUDENTS.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name} ({s.grade})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Behavior Type</Label>
              <Select value={assignForm.behaviorTypeId} onValueChange={(val) => setAssignForm({ ...assignForm, behaviorTypeId: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select behavior..." />
                </SelectTrigger>
                <SelectContent>
                   <div className="mb-2 px-2 text-xs font-semibold text-gray-500 uppercase">Merits</div>
                   {behaviorTypes.filter(t => t.category === "Merit").map(t => (
                     <SelectItem key={t.id} value={t.id} className="text-green-700 font-medium">
                       {t.name} ({t.points} pts)
                     </SelectItem>
                   ))}
                   <div className="mt-2 mb-2 px-2 text-xs font-semibold text-gray-500 uppercase border-t pt-2">Demerits</div>
                   {behaviorTypes.filter(t => t.category === "Demerit").map(t => (
                     <SelectItem key={t.id} value={t.id} className="text-red-700 font-medium">
                       {t.name} ({t.points} pts)
                     </SelectItem>
                   ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Context regarding the incident..." value={assignForm.notes} onChange={e => setAssignForm({ ...assignForm, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>Cancel</Button>
            <Button onClick={handleAssignBehavior}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Letter Dialog */}
      <Dialog open={showLetterDialog} onOpenChange={setShowLetterDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
             <DialogTitle>Compose Disciplinary Letter</DialogTitle>
             <DialogDescription>This will be sent to the parent's portal</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Student</Label>
                <Select value={letterForm.studentId} onValueChange={(val) => setLetterForm({ ...letterForm, studentId: val })}>
                  <SelectTrigger disabled={!!selectedStudentId && showLetterDialog}> {/* Lock if pre-selected */}
                    <SelectValue placeholder="Select student..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_STUDENTS.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notice Type</Label>
                <Select value={letterForm.type} onValueChange={(val: any) => setLetterForm({ ...letterForm, type: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Warning">Warning Notice</SelectItem>
                    <SelectItem value="Suspension">Suspension Notice</SelectItem>
                    <SelectItem value="Expulsion">Expulsion Notice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Subject / Title</Label>
              <Input placeholder="e.g. Urgent: Suspension Notice regarding..." value={letterForm.title} onChange={e => setLetterForm({ ...letterForm, title: e.target.value })} />
            </div>
            
            <div className="space-y-2">
               <Label>Letter Content</Label>
               <Textarea className="min-h-[200px]" placeholder="Formal letter content..." value={letterForm.content} onChange={e => setLetterForm({ ...letterForm, content: e.target.value })} />
               <p className="text-xs text-gray-500">Parent will be required to acknowledge this letter.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLetterDialog(false)}>Cancel</Button>
            <Button onClick={handleSendLetter} className="bg-red-600 hover:bg-red-700">Send Notice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
