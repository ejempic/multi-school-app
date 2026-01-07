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
import { DollarSign, Calendar, CreditCard, AlertCircle, CheckCircle, Search } from "lucide-react";
import { Progress } from "./ui/progress";

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
    record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.grade.toLowerCase().includes(searchQuery.toLowerCase())
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Tuition Management</h1>
          <p className="text-gray-600">Track and manage student fee payments</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <DollarSign className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
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
      </div>

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

      {/* Tuition Records */}
      <Card>
        <CardHeader>
          <CardTitle>Student Tuition Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredRecords.map((record) => (
              <div key={record.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4>{record.studentName}</h4>
                      <Badge className={getStatusColor(record.status)}>
                        {getStatusIcon(record.status)}
                        <span className="ml-1">{record.status}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{record.grade} • Due: {record.dueDate}</p>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-2">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total Fee</p>
                    <p className="text-sm">${record.totalFee.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Paid</p>
                    <p className="text-sm text-green-600">${record.paidAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Due</p>
                    <p className="text-sm text-red-600">${record.dueAmount.toLocaleString()}</p>
                  </div>
                </div>
                <Progress value={(record.paidAmount / record.totalFee) * 100} className="h-2" />
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
