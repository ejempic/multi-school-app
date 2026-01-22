import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { DollarSign, Calendar, CreditCard, AlertCircle, CheckCircle, Search, Mail } from "lucide-react";
import { Progress } from "./ui/progress";
import { showSuccessToast } from "../utils/toastNotification";
import { PageHeader } from "./ui/page-header";

interface TuitionRecord {
  id: number;
  studentName: string;
  grade: string;
  totalFee: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue";
  semester: string;
}

interface PaymentHistory {
  id: number;
  studentName: string;
  amount: number;
  date: string;
  method: string;
  transactionId: string;
}

export function Tuitions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("Spring 2026");
  const [sortColumn, setSortColumn] = useState<string>("studentName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<"All" | "Overdue" | "Pending" | "Paid">("Overdue");

  const tuitionRecords: TuitionRecord[] = [
    { id: 1, studentName: "Emma Watson", grade: "Grade 12", totalFee: 12000, paidAmount: 12000, dueAmount: 0, dueDate: "2026-01-15", status: "Paid", semester: "Spring 2026" },
    { id: 2, studentName: "Liam Johnson", grade: "Grade 11", totalFee: 11500, paidAmount: 8000, dueAmount: 3500, dueDate: "2026-01-15", status: "Pending", semester: "Spring 2026" },
    { id: 3, studentName: "Olivia Brown", grade: "Grade 10", totalFee: 11000, paidAmount: 11000, dueAmount: 0, dueDate: "2026-01-15", status: "Paid", semester: "Spring 2026" },
    { id: 4, studentName: "Noah Davis", grade: "Grade 12", totalFee: 12000, paidAmount: 4000, dueAmount: 8000, dueDate: "2025-12-20", status: "Overdue", semester: "Spring 2026" },
    { id: 5, studentName: "Ava Wilson", grade: "Grade 11", totalFee: 11500, paidAmount: 11500, dueAmount: 0, dueDate: "2026-01-15", status: "Paid", semester: "Spring 2026" },
    { id: 6, studentName: "Ethan Martinez", grade: "Grade 10", totalFee: 11000, paidAmount: 6000, dueAmount: 5000, dueDate: "2026-01-15", status: "Pending", semester: "Spring 2026" },
    { id: 7, studentName: "Sophia Garcia", grade: "Grade 12", totalFee: 12000, paidAmount: 12000, dueAmount: 0, dueDate: "2026-01-10", status: "Paid", semester: "Spring 2026" },
    { id: 8, studentName: "Mason Lee", grade: "Grade 11", totalFee: 11500, paidAmount: 2000, dueAmount: 9500, dueDate: "2025-12-30", status: "Overdue", semester: "Spring 2026" },
  ];

  const recentPayments: PaymentHistory[] = [
    { id: 1, studentName: "Emma Watson", amount: 12000, date: "2026-01-05", method: "Credit Card", transactionId: "TXN001234" },
    { id: 2, studentName: "Olivia Brown", amount: 11000, date: "2026-01-04", method: "Bank Transfer", transactionId: "TXN001235" },
    { id: 3, studentName: "Ava Wilson", amount: 11500, date: "2026-01-03", method: "Check", transactionId: "TXN001236" },
    { id: 4, studentName: "Sophia Garcia", amount: 12000, date: "2026-01-02", method: "Credit Card", transactionId: "TXN001237" },
  ];

  const filteredRecords = tuitionRecords.filter(record =>
    (record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.grade.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (statusFilter === "All" || record.status === statusFilter)
  );

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    let aValue: any = a[sortColumn as keyof TuitionRecord];
    let bValue: any = b[sortColumn as keyof TuitionRecord];

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const SortableHeader = ({ column, label }: { column: string; label: string }) => (
    <TableHead 
      className="cursor-pointer hover:bg-gray-100 select-none"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-2">
        {label}
        {sortColumn === column && (
          <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
        )}
      </div>
    </TableHead>
  );

  const totalCollected = tuitionRecords.reduce((sum, record) => sum + record.paidAmount, 0);
  const totalDue = tuitionRecords.reduce((sum, record) => sum + record.dueAmount, 0);
  const totalExpected = tuitionRecords.reduce((sum, record) => sum + record.totalFee, 0);
  const collectionRate = (totalCollected / totalExpected) * 100;

  const getStatusColor = (status: string) => {
    if (status === "Paid") return "bg-green-100 text-green-800";
    if (status === "Pending") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getStatusIcon = (status: string) => {
    if (status === "Paid") return <CheckCircle className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tuition Management"
        subtitle="Track and manage student fee payments"
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                data-slot="dialog-trigger"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Record Payment
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Payment</DialogTitle>
                <DialogDescription>
                  Enter payment details for a student.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="student">Student</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {tuitionRecords.map((record) => (
                        <SelectItem key={record.id} value={record.id.toString()}>
                          {record.studentName} - {record.grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" type="number" placeholder="0.00" />
                </div>
                <div>
                  <Label htmlFor="method">Payment Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Credit Card</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="transaction">Transaction ID</Label>
                  <Input id="transaction" placeholder="Enter transaction ID" />
                </div>
                <Button className="w-full">Submit Payment</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Total Expected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-1">${totalExpected.toLocaleString()}</div>
            <p className="text-sm text-gray-600">{selectedSemester}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Total Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-1 text-green-600">${totalCollected.toLocaleString()}</div>
            <Progress value={collectionRate} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-1 text-red-600">${totalDue.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Pending collection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Collection Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-1">{collectionRate.toFixed(1)}%</div>
            <p className="text-sm text-gray-600">Payment completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by student name or grade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Spring 2026">Spring 2026</SelectItem>
                <SelectItem value="Fall 2025">Fall 2025</SelectItem>
                <SelectItem value="Spring 2025">Spring 2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tuition Records Table */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle>Student Tuition Status</CardTitle>
            <div className="flex gap-2">
              {(["All", "Overdue", "Pending", "Paid"] as const).map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="text-xs"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => {
              const overdueCount = filteredRecords.filter(r => r.status === "Overdue" || r.status === "Pending").length;
              showSuccessToast(`✓ Reminders sent`, `${overdueCount} reminder(s) sent to students with pending payments`);
            }}
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Reminders
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader column="studentName" label="Student Name" />
                  <SortableHeader column="grade" label="Grade" />
                  <SortableHeader column="totalFee" label="Total Fee" />
                  <SortableHeader column="paidAmount" label="Paid" />
                  <SortableHeader column="dueAmount" label="Due Amount" />
                  <SortableHeader column="dueDate" label="Due Date" />
                  <SortableHeader column="status" label="Status" />
                  <TableHead>Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.studentName}</TableCell>
                    <TableCell>{record.grade}</TableCell>
                    <TableCell>${record.totalFee.toLocaleString()}</TableCell>
                    <TableCell className="text-green-600 font-semibold">${record.paidAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-red-600 font-semibold">${record.dueAmount.toLocaleString()}</TableCell>
                    <TableCell>{record.dueDate}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(record.status)}>
                        {getStatusIcon(record.status)}
                        <span className="ml-1">{record.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="w-20">
                        <Progress value={(record.paidAmount / record.totalFee) * 100} className="h-2" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Dues */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Dues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tuitionRecords
              .filter(record => record.status === "Pending" || record.status === "Overdue")
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4" 
                  style={{ borderColor: record.status === "Overdue" ? "#ef4444" : "#f59e0b" }}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{record.studentName}</h4>
                      <Badge variant={record.status === "Overdue" ? "destructive" : "secondary"}>
                        {record.status === "Overdue" ? "🔴 Overdue" : "🟡 Due Soon"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Due Amount</p>
                        <p className="font-semibold text-red-600">${record.dueAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Due Date</p>
                        <p className="font-semibold">{record.dueDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Grade</p>
                        <p className="font-semibold">{record.grade}</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Send Reminder</Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded">
                    <CreditCard className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-sm mb-1">{payment.studentName}</h4>
                    <p className="text-xs text-gray-600">
                      {payment.method} • {payment.transactionId}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm mb-1">${payment.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">{payment.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
