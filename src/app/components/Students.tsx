import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Search, Plus, Mail, Phone, ChevronDown, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Student {
  id: number;
  studentId: string;
  name: string;
  grade: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive";
  gpa: number;
  photo: string;
}

export function Students() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGrades, setExpandedGrades] = useState<string[]>(["Grade 12", "Grade 11", "Grade 10", "Grade 9"]);
  const [students] = useState<Student[]>([
    { 
      id: 1, 
      studentId: "STU-2024-001",
      name: "Emma Watson", 
      grade: "Grade 12", 
      email: "emma.w@school.com", 
      phone: "(555) 123-4567", 
      status: "Active", 
      gpa: 3.8,
      photo: "https://images.unsplash.com/photo-1633381182794-01b10764b431?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXQlMjBmZW1hbGV8ZW58MXx8fHwxNzY3ODA2MTg4fDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    { 
      id: 2, 
      studentId: "STU-2024-002",
      name: "Liam Johnson", 
      grade: "Grade 11", 
      email: "liam.j@school.com", 
      phone: "(555) 234-5678", 
      status: "Active", 
      gpa: 3.6,
      photo: "https://images.unsplash.com/photo-1624918201580-388eae33e802?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXQlMjBtYWxlfGVufDF8fHx8MTc2NzgwNjE4OXww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    { 
      id: 3, 
      studentId: "STU-2024-003",
      name: "Olivia Brown", 
      grade: "Grade 10", 
      email: "olivia.b@school.com", 
      phone: "(555) 345-6789", 
      status: "Active", 
      gpa: 3.9,
      photo: "https://images.unsplash.com/photo-1705753449583-90daa4d7ad91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuYWdlJTIwc3R1ZGVudCUyMGdpcmx8ZW58MXx8fHwxNzY3ODA2MTkwfDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    { 
      id: 4, 
      studentId: "STU-2024-004",
      name: "Noah Davis", 
      grade: "Grade 12", 
      email: "noah.d@school.com", 
      phone: "(555) 456-7890", 
      status: "Active", 
      gpa: 3.7,
      photo: "https://images.unsplash.com/photo-1624728323853-9e7873077452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuYWdlJTIwc3R1ZGVudCUyMGJveXxlbnwxfHx8fDE3Njc4MDYxODl8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    { 
      id: 5, 
      studentId: "STU-2024-005",
      name: "Ava Wilson", 
      grade: "Grade 11", 
      email: "ava.w@school.com", 
      phone: "(555) 567-8901", 
      status: "Active", 
      gpa: 3.5,
      photo: "https://images.unsplash.com/photo-1633381182794-01b10764b431?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXQlMjBmZW1hbGV8ZW58MXx8fHwxNzY3ODA2MTg4fDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    { 
      id: 6, 
      studentId: "STU-2024-006",
      name: "Ethan Martinez", 
      grade: "Grade 10", 
      email: "ethan.m@school.com", 
      phone: "(555) 678-9012", 
      status: "Inactive", 
      gpa: 3.4,
      photo: "https://images.unsplash.com/photo-1624918201580-388eae33e802?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXQlMjBtYWxlfGVufDF8fHx8MTc2NzgwNjE4OXww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    { 
      id: 7, 
      studentId: "STU-2024-007",
      name: "Sophia Garcia", 
      grade: "Grade 12", 
      email: "sophia.g@school.com", 
      phone: "(555) 789-0123", 
      status: "Active", 
      gpa: 4.0,
      photo: "https://images.unsplash.com/photo-1705753449583-90daa4d7ad91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuYWdlJTIwc3R1ZGVudCUyMGdpcmx8ZW58MXx8fHwxNzY3ODA2MTkwfDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    { 
      id: 8, 
      studentId: "STU-2024-008",
      name: "Mason Lee", 
      grade: "Grade 11", 
      email: "mason.l@school.com", 
      phone: "(555) 890-1234", 
      status: "Active", 
      gpa: 3.3,
      photo: "https://images.unsplash.com/photo-1624728323853-9e7873077452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuYWdlJTIwc3R1ZGVudCUyMGJveXxlbnwxfHx8fDE3Njc4MDYxODl8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
  ]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleGrade = (grade: string) => {
    setExpandedGrades(prev => 
      prev.includes(grade) 
        ? prev.filter(g => g !== grade)
        : [...prev, grade]
    );
  };

  const gradeOrder = ["Grade 12", "Grade 11", "Grade 10", "Grade 9"];
  const studentsByGrade = gradeOrder.map(grade => ({
    grade,
    students: filteredStudents.filter(s => s.grade === grade)
  }));

  const StudentCard = ({ student }: { student: Student }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-4">
          <img 
            src={student.photo} 
            alt={student.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{student.name}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">ID: {student.studentId}</p>
              </div>
              <Badge variant={student.status === "Active" ? "default" : "secondary"}>
                {student.status}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{student.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{student.phone}</span>
          </div>
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">GPA</span>
              <span className="text-sm">{student.gpa.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Students</h1>
          <p className="text-gray-600">Manage and view all student information</p>
        </div>
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
              <DialogDescription>
                Enter the student's information below.
              </DialogDescription>
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
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students by name, email, ID or grade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Students by Grade Tree */}
      <div className="space-y-4">
        {studentsByGrade.map(({ grade, students: gradeStudents }) => (
          <div key={grade} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleGrade(grade)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                {expandedGrades.includes(grade) ? (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                )}
                <h2 className="text-xl">{grade}</h2>
                <Badge variant="outline">{gradeStudents.length} students</Badge>
              </div>
            </button>
            
            {expandedGrades.includes(grade) && gradeStudents.length > 0 && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gradeStudents.map((student) => (
                  <StudentCard key={student.id} student={student} />
                ))}
              </div>
            )}

            {expandedGrades.includes(grade) && gradeStudents.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No students found in {grade}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}