import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { PageHeader } from "./ui/page-header";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
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
import { 
  Plus, 
  Search, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar as CalendarIcon,
  Filter,
  Download,
  Stethoscope
} from "lucide-react";
import { showSuccessToast } from "../utils/toastNotification";

interface SickLeave {
  id: string;
  studentName: string;
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: "Approved" | "Pending" | "Rejected";
  documentAttached: boolean;
  submittedAt: string;
}

interface SickLeavesProps {
  userRole?: string;
}

export function SickLeaves({ userRole = "admin" }: SickLeavesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [leaves, setLeaves] = useState<SickLeave[]>([
    {
      id: "SL-001",
      studentName: "Emma Watson",
      startDate: "2026-01-05",
      endDate: "2026-01-07",
      duration: 3,
      reason: "Severe fever and flu symptoms. Doctor advised bed rest.",
      status: "Approved",
      documentAttached: true,
      submittedAt: "2026-01-04"
    },
    {
      id: "SL-002",
      studentName: "Liam Johnson",
      startDate: "2026-01-10",
      endDate: "2026-01-10",
      duration: 1,
      reason: "Dental appointment (filling and cleaning).",
      status: "Pending",
      documentAttached: false,
      submittedAt: "2026-01-09"
    },
    {
      id: "SL-003",
      studentName: "Olivia Brown",
      startDate: "2025-12-15",
      endDate: "2025-12-16",
      duration: 2,
      reason: "Stomach virus.",
      status: "Approved",
      documentAttached: true,
      submittedAt: "2025-12-14"
    }
  ]);

  const filteredLeaves = leaves.filter(leave => 
    leave.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    leave.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    pending: leaves.filter(l => l.status === "Pending").length,
    approved: leaves.filter(l => l.status === "Approved").length,
    totalThisMonth: leaves.length
  };

  const handleApprove = (id: string) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status: "Approved" } : l));
    showSuccessToast("Leave request approved successfully");
  };

  const handleReject = (id: string) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status: "Rejected" } : l));
    showSuccessToast("Leave request rejected");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Stethoscope}
        title="Sick Leave Management"
        subtitle="Track medical absences, doctor's notes, and student health records"
        actions={
          <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#003366] font-bold rounded-xl px-6 h-12">
                <Plus className="mr-2 h-5 w-5" />
                New Leave Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-[#003366]">Submit Sick Leave Request</DialogTitle>
                <DialogDescription>Please provide medical details and expected duration of absence.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase text-gray-400">Student Name</Label>
                  <Input placeholder="Select Student" defaultValue="Emma Watson" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase text-gray-400">Start Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase text-gray-400">End Date</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase text-gray-400">Reason / Diagnosis</Label>
                  <Textarea placeholder="Explain the medical situation..." className="min-h-[100px]" />
                </div>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <Stethoscope className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-xs font-bold text-gray-500 uppercase">Upload Doctor's Note (PDF/JPG)</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRequestModalOpen(false)}>Cancel</Button>
                <Button className="bg-[#003366]" onClick={() => setIsRequestModalOpen(false)}>Submit Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-xl shadow-gray-100 bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pending Approval</p>
              <p className="text-3xl font-black text-amber-600">{stats.pending}</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-xl shadow-gray-100 bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Approved Leaves</p>
              <p className="text-3xl font-black text-emerald-600">{stats.approved}</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-xl shadow-gray-100 bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Medical Excuses</p>
              <p className="text-3xl font-black text-blue-600">{stats.totalThisMonth}</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <FileText className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Table */}
      <Card className="border-none shadow-xl shadow-gray-100">
        <CardHeader className="bg-white border-b border-gray-50 flex flex-row items-center justify-between space-y-0 p-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by student or reason..." 
              className="pl-10 h-10 rounded-xl bg-gray-50 border-none shadow-none focus-visible:ring-1 focus-visible:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-10 rounded-xl border-gray-100 font-bold px-4">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="h-10 rounded-xl border-gray-100 font-bold px-4">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="hover:bg-transparent border-b border-gray-100">
                <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest text-[#003366] pl-6">Student</TableHead>
                <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest text-[#003366]">Period</TableHead>
                <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest text-[#003366]">Reason & Diagnosis</TableHead>
                <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest text-[#003366]">Docs</TableHead>
                <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest text-[#003366]">Status</TableHead>
                <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest text-[#003366] text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeaves.map((leave) => (
                <TableRow key={leave.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 group">
                  <TableCell className="py-4 pl-6 font-bold text-gray-900">{leave.studentName}</TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-700">{leave.startDate}</span>
                      <span className="text-[10px] text-gray-400 font-medium">to {leave.endDate} ({leave.duration} days)</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 max-w-xs">
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{leave.reason}</p>
                  </TableCell>
                  <TableCell className="py-4">
                    {leave.documentAttached ? (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 font-bold text-[9px] uppercase">
                        <FileText className="h-2.5 w-2.5 mr-1" /> View Note
                      </Badge>
                    ) : (
                      <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">None</span>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge className={`font-black text-[9px] uppercase tracking-tighter px-2 h-5 rounded-full ${
                      leave.status === "Approved" ? "bg-emerald-100 text-emerald-700 border-none" :
                      leave.status === "Pending" ? "bg-amber-100 text-amber-700 border-none" :
                      "bg-rose-100 text-rose-700 border-none"
                    }`}>
                      {leave.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 pr-6 text-right">
                    <div className="flex justify-end gap-1 opacity-10 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      {leave.status === "Pending" && (userRole === "admin" || userRole === "teacher") && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
                            onClick={() => handleApprove(leave.id)}
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                            onClick={() => handleReject(leave.id)}
                          >
                            <XCircle className="h-5 w-5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredLeaves.length === 0 && (
            <div className="py-20 text-center">
              <Stethoscope className="mx-auto h-12 w-12 text-gray-200 mb-4" />
              <p className="text-gray-400 font-bold text-sm uppercase">No medical records found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
