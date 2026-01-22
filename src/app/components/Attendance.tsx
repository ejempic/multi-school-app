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
} from "./ui/dialog";
import { Check, X, Clock, Search, Edit, Trash2 } from "lucide-react";
import { showSuccessToast, showErrorToast } from "../utils/toastNotification";

interface AttendanceRecord {
  id: number;
  studentId: string;
  studentName: string;
  className: string;
  checkInTime: string;
  checkOutTime: string | null;
  date: string;
  status: "Present" | "Absent" | "Late" | "Excused";
}

export function Attendance() {
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    status: "",
    checkInTime: "",
    checkOutTime: "",
  });

  // Mock classes
  const classes = [
    { id: 1, name: "Grade 12 A - Advanced Mathematics" },
    { id: 2, name: "Grade 12 B - Mathematics" },
    { id: 3, name: "Grade 11 A - English Literature" },
    { id: 4, name: "Grade 11 B - English Literature" },
    { id: 5, name: "Grade 10 - Physics" },
    { id: 6, name: "Grade 10 - Chemistry" },
  ];

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    { id: 1, studentId: "STU001", studentName: "Emma Watson", className: "Grade 12 A", checkInTime: "08:15", checkOutTime: "14:30", date: selectedDate, status: "Present" },
    { id: 2, studentId: "STU002", studentName: "Liam Johnson", className: "Grade 11 A", checkInTime: "08:45", checkOutTime: "14:30", date: selectedDate, status: "Late" },
    { id: 3, studentId: "STU003", studentName: "Olivia Brown", className: "Grade 10 Physics", checkInTime: "", checkOutTime: null, date: selectedDate, status: "Absent" },
    { id: 4, studentId: "STU004", studentName: "Noah Davis", className: "Grade 12 B", checkInTime: "08:10", checkOutTime: "14:30", date: selectedDate, status: "Present" },
    { id: 5, studentId: "STU005", studentName: "Ava Wilson", className: "Grade 11 B", checkInTime: "08:20", checkOutTime: "14:30", date: selectedDate, status: "Present" },
    { id: 6, studentId: "STU006", studentName: "Ethan Martinez", className: "Grade 10 Chemistry", checkInTime: "", checkOutTime: null, date: selectedDate, status: "Excused" },
  ]);

  const filteredRecords = attendanceRecords.filter(record =>
    (selectedClass === "All" || record.className.includes(selectedClass)) &&
    (record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.studentId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEditClick = (record: AttendanceRecord) => {
    setEditingId(record.id);
    setEditForm({
      status: record.status,
      checkInTime: record.checkInTime,
      checkOutTime: record.checkOutTime || "",
    });
  };

  const handleSaveEdit = () => {
    if (editingId) {
      setAttendanceRecords(attendanceRecords.map(r =>
        r.id === editingId
          ? {
              ...r,
              status: editForm.status as "Present" | "Absent" | "Late" | "Excused",
              checkInTime: editForm.checkInTime,
              checkOutTime: editForm.checkOutTime || null,
            }
          : r
      ));
      showSuccessToast("✓ Attendance updated", "Record has been saved successfully");
      setEditingId(null);
    }
  };

  const handleDeleteRecord = (id: number) => {
    setAttendanceRecords(attendanceRecords.filter(r => r.id !== id));
    showSuccessToast("✓ Record deleted", "Attendance record has been removed");
  };

  const getStatusColor = (status: string) => {
    if (status === "Present") return "bg-green-100 text-green-800";
    if (status === "Late") return "bg-yellow-100 text-yellow-800";
    if (status === "Absent") return "bg-red-100 text-red-800";
    return "bg-blue-100 text-blue-800";
  };

  const getStatusIcon = (status: string) => {
    if (status === "Present") return <Check className="h-4 w-4" />;
    if (status === "Late") return <Clock className="h-4 w-4" />;
    if (status === "Absent") return <X className="h-4 w-4" />;
    return <Check className="h-4 w-4" />;
  };

  const presentCount = attendanceRecords.filter(r => r.status === "Present").length;
  const lateCount = attendanceRecords.filter(r => r.status === "Late").length;
  const absentCount = attendanceRecords.filter(r => r.status === "Absent").length;
  const excusedCount = attendanceRecords.filter(r => r.status === "Excused").length;
  const totalStudents = attendanceRecords.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Attendance Management"
        subtitle={
          <>
            Manage and update student attendance records. Use the scanner at <span className="font-mono bg-gray-100 px-2 py-1 rounded">/student-scanner</span> for check-in/out.
          </>
        }
      />

      {/* Attendance Records */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[250px]">
              <Label htmlFor="date-select" className="text-sm">Date</Label>
              <Input
                id="date-select"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex-1 min-w-[250px]">
              <Label htmlFor="class-select" className="text-sm">Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Classes</SelectItem>
                  {classes.map(cls => (
                    <SelectItem key={cls.id} value={cls.name}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[250px]">
              <Label htmlFor="search" className="text-sm">Search</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono font-semibold">{record.studentId}</TableCell>
                      <TableCell>{record.studentName}</TableCell>
                      <TableCell>{record.className}</TableCell>
                      <TableCell>{record.checkInTime || "-"}</TableCell>
                      <TableCell>{record.checkOutTime || "-"}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.status)}>
                          {getStatusIcon(record.status)}
                          <span className="ml-1">{record.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog open={editingId === record.id} onOpenChange={(open) => !open && setEditingId(null)}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditClick(record)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Edit Attendance</DialogTitle>
                                <DialogDescription>{record.studentName} - {record.studentId}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="status" className="text-sm">Status</Label>
                                  <Select value={editForm.status} onValueChange={(val) => setEditForm({ ...editForm, status: val })}>
                                    <SelectTrigger className="mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Present">Present</SelectItem>
                                      <SelectItem value="Absent">Absent</SelectItem>
                                      <SelectItem value="Late">Late</SelectItem>
                                      <SelectItem value="Excused">Excused</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="checkin" className="text-sm">Check-in Time</Label>
                                  <Input
                                    id="checkin"
                                    type="time"
                                    value={editForm.checkInTime}
                                    onChange={(e) => setEditForm({ ...editForm, checkInTime: e.target.value })}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="checkout" className="text-sm">Check-out Time</Label>
                                  <Input
                                    id="checkout"
                                    type="time"
                                    value={editForm.checkOutTime}
                                    onChange={(e) => setEditForm({ ...editForm, checkOutTime: e.target.value })}
                                    className="mt-1"
                                  />
                                </div>
                                <div className="flex gap-2 justify-end">
                                  <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                                  <Button onClick={handleSaveEdit}>Save Changes</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteRecord(record.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      No records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Present</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{presentCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Late</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{lateCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{absentCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Excused</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{excusedCount}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
