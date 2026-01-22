import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { PageHeader } from "./ui/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, Search, Stethoscope, Activity, FileText, AlertTriangle, Pill, Trash2 } from "lucide-react";
import { showSuccessToast } from "../utils/toastNotification";

interface ClinicVisit {
  id: number;
  studentId: string;
  studentName: string;
  grade: string;
  reason: string;
  treatment: string;
  timeIn: string;
  timeOut: string;
  nurse: string;
  status: "Active" | "Discharged" | "Sent Home";
  date: string;
}

interface StudentHealthRecord {
  id: string;
  studentName: string;
  grade: string;
  allergies: string[];
  medications: string[];
  medicalConditions: string[];
  emergencyContact: string;
  bloodType: string;
}

export function ClinicManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("visits");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newVisit, setNewVisit] = useState({
    studentName: "",
    reason: "",
    treatment: "",
    status: "Active",
  });

  const [visits, setVisits] = useState<ClinicVisit[]>([
    {
      id: 1,
      studentId: "STU001",
      studentName: "Emma Watson",
      grade: "12-A",
      reason: "Headache",
      treatment: "Paracetamol, Rest",
      timeIn: "09:15 AM",
      timeOut: "10:30 AM",
      nurse: "Nurse Joy",
      status: "Discharged",
      date: new Date().toISOString().split("T")[0],
    },
    {
      id: 2,
      studentId: "STU004",
      studentName: "Noah Davis",
      grade: "12-B",
      reason: "Stomach Pain",
      treatment: "Observation",
      timeIn: "11:00 AM",
      timeOut: "-",
      nurse: "Nurse Joy",
      status: "Active",
      date: new Date().toISOString().split("T")[0],
    },
  ]);

  const [healthRecords, setHealthRecords] = useState<StudentHealthRecord[]>([
    {
      id: "STU001",
      studentName: "Emma Watson",
      grade: "12-A",
      allergies: ["Peanuts", "Penicillin"],
      medications: ["Albuterol Inhaler (PRN)"],
      medicalConditions: ["Asthma"],
      emergencyContact: "(555) 123-4567",
      bloodType: "A+"
    },
    {
      id: "STU002",
      studentName: "Liam Johnson",
      grade: "11-B",
      allergies: [],
      medications: [],
      medicalConditions: [],
      emergencyContact: "(555) 987-6543",
      bloodType: "O+"
    },
    {
      id: "STU004",
      studentName: "Noah Davis",
      grade: "12-B",
      allergies: ["Dust Mites"],
      medications: ["Claritin (Daily)"],
      medicalConditions: ["Seasonal Allergies"],
      emergencyContact: "(555) 555-5555",
      bloodType: "B-"
    },
    {
      id: "STU006",
      studentName: "Ethan Martinez",
      grade: "10-C",
      allergies: ["Bee Stings"],
      medications: ["EpiPen (Carried)"],
      medicalConditions: ["Anaphylaxis Risk"],
      emergencyContact: "(555) 111-2222",
      bloodType: "AB+"
    }
  ]);

  const [editingRecord, setEditingRecord] = useState<StudentHealthRecord | null>(null);

  const handleUpdateRecord = () => {
    if (!editingRecord) return;
    setHealthRecords(records => records.map(r => r.id === editingRecord.id ? editingRecord : r));
    setEditingRecord(null);
    showSuccessToast("Health record updated");
  };

  const handleDeleteVisit = (id: number) => {
    setVisits(visits.filter(v => v.id !== id));
    showSuccessToast("Clinic visit record deleted");
  };

  const handleAddVisit = () => {
    const visit: ClinicVisit = {
      id: visits.length + 1,
      studentId: `STU${Math.floor(Math.random() * 1000)}`,
      studentName: newVisit.studentName,
      grade: "N/A", // In a real app, we'd look this up
      reason: newVisit.reason,
      treatment: newVisit.treatment,
      timeIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeOut: "-",
      nurse: "Nurse Joy",
      status: newVisit.status as any,
      date: new Date().toISOString().split("T")[0],
    };

    setVisits([visit, ...visits]);
    setIsAddOpen(false);
    setNewVisit({ studentName: "", reason: "", treatment: "", status: "Active" });
    showSuccessToast("Clinic visit recorded successfully");
  };

  const filteredVisits = visits.filter(visit =>
    visit.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    visit.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRecords = healthRecords.filter(record => 
    record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clinic Management"
        subtitle="Manage student health records and clinic visits"
      />

      <Tabs defaultValue="visits" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
            <TabsList>
                <TabsTrigger value="visits">Daily Visits</TabsTrigger>
                <TabsTrigger value="records">Student Health Records</TabsTrigger>
            </TabsList>
            
            {activeTab === 'visits' && (
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                    <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Visit
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Record New Clinic Visit</DialogTitle>
                    <DialogDescription>
                        Enter the details of the student's visit to the clinic.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="student">Student Name</Label>
                        <Input
                        id="student"
                        value={newVisit.studentName}
                        onChange={(e) => setNewVisit({ ...newVisit, studentName: e.target.value })}
                        placeholder="Select student..."
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="reason">Reason for Visit</Label>
                        <Input
                        id="reason"
                        value={newVisit.reason}
                        onChange={(e) => setNewVisit({ ...newVisit, reason: e.target.value })}
                        placeholder="e.g. Headache, Fever, Injury"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="treatment">Treatment / Action</Label>
                        <Input
                        id="treatment"
                        value={newVisit.treatment}
                        onChange={(e) => setNewVisit({ ...newVisit, treatment: e.target.value })}
                        placeholder="e.g. Meds given, Rest, Sent home"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                        value={newVisit.status}
                        onValueChange={(value) => setNewVisit({ ...newVisit, status: value })}
                        >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Active">Active (In Clinic)</SelectItem>
                            <SelectItem value="Discharged">Discharged (Back to Class)</SelectItem>
                            <SelectItem value="Sent Home">Sent Home</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    </div>
                    <Button onClick={handleAddVisit} className="w-full">Record Visit</Button>
                </DialogContent>
                </Dialog>
            )}
        </div>

        <TabsContent value="visits" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Visits</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                    {visits.filter(v => v.status === "Active").length}
                    </div>
                    <p className="text-xs text-muted-foreground">Students currently in clinic</p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Today</CardTitle>
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                    {visits.filter(v => v.date === new Date().toISOString().split("T")[0]).length}
                    </div>
                    <p className="text-xs text-muted-foreground">Visits recorded today</p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sent Home</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                    {visits.filter(v => v.status === "Sent Home").length}
                    </div>
                    <p className="text-xs text-muted-foreground">Students sent home today</p>
                </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                <CardTitle>Recent Visits</CardTitle>
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search students or reasons..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 max-w-sm"
                    />
                    </div>
                </div>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Time In</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Treatment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredVisits.map((visit) => (
                        <TableRow key={visit.id}>
                        <TableCell>
                            <div>
                            <div className="font-medium">{visit.studentName}</div>
                            <div className="text-xs text-muted-foreground">{visit.grade} • {visit.studentId}</div>
                            </div>
                        </TableCell>
                        <TableCell>{visit.timeIn}</TableCell>
                        <TableCell>{visit.reason}</TableCell>
                        <TableCell>{visit.treatment}</TableCell>
                        <TableCell>
                            <Badge variant={
                            visit.status === "Active" ? "destructive" :
                            visit.status === "Sent Home" ? "secondary" : "default"
                            }>
                            {visit.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteVisit(visit.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="records" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Student Health Records</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 max-w-sm"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student Details</TableHead>
                                <TableHead>Allergies</TableHead>
                                <TableHead>Medications</TableHead>
                                <TableHead>Conditions</TableHead>
                                <TableHead>Blood Type</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRecords.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>
                                        <div className="font-medium">{record.studentName}</div>
                                        <div className="text-xs text-muted-foreground">{record.grade} • {record.id}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {record.allergies.length > 0 ? (
                                                record.allergies.map((allergy, i) => (
                                                    <Badge key={i} variant="destructive" className="text-[10px]">{allergy}</Badge>
                                                ))
                                            ) : (
                                                <span className="text-muted-foreground text-xs">-</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {record.medications.length > 0 ? (
                                                record.medications.map((med, i) => (
                                                    <Badge key={i} variant="secondary" className="text-[10px]"><Pill className="h-3 w-3 mr-1"/>{med}</Badge>
                                                ))
                                            ) : (
                                                <span className="text-muted-foreground text-xs">-</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {record.medicalConditions.length > 0 ? (
                                                record.medicalConditions.map((cond, i) => (
                                                    <Badge key={i} variant="outline" className="text-[10px]"><AlertTriangle className="h-3 w-3 mr-1 text-yellow-500"/>{cond}</Badge>
                                                ))
                                            ) : (
                                                <span className="text-muted-foreground text-xs">None</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono">{record.bloodType}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm" onClick={() => setEditingRecord(record)}>Edit</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={!!editingRecord} onOpenChange={(open) => !open && setEditingRecord(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Health Record</DialogTitle>
                        <DialogDescription>
                            Update medical information for {editingRecord?.studentName}
                        </DialogDescription>
                    </DialogHeader>
                    {editingRecord && (
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Allergies (comma separated)</Label>
                                <Input 
                                    value={editingRecord.allergies.join(", ")} 
                                    onChange={(e) => setEditingRecord({...editingRecord, allergies: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Medications (comma separated)</Label>
                                <Input 
                                    value={editingRecord.medications.join(", ")} 
                                    onChange={(e) => setEditingRecord({...editingRecord, medications: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Medical Conditions (comma separated)</Label>
                                <Input 
                                    value={editingRecord.medicalConditions.join(", ")} 
                                    onChange={(e) => setEditingRecord({...editingRecord, medicalConditions: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Blood Type</Label>
                                    <Select 
                                        value={editingRecord.bloodType} 
                                        onValueChange={(val) => setEditingRecord({...editingRecord, bloodType: val})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(t => (
                                                <SelectItem key={t} value={t}>{t}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Emergency Contact</Label>
                                    <Input 
                                        value={editingRecord.emergencyContact} 
                                        onChange={(e) => setEditingRecord({...editingRecord, emergencyContact: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingRecord(null)}>Cancel</Button>
                        <Button onClick={handleUpdateRecord}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}
