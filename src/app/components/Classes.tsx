import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Clock, Users, MapPin, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { PageHeader } from "./ui/page-header";

interface ClassItem {
  id: number;
  name: string;
  grade: string;
  teacher: string;
  time: string;
  day: string;
  room: string;
  students: number;
  maxStudents: number;
  color: string;
}

interface ClassesProps {
  userRole: string | null;
  userData: any;
}

export function Classes({ userRole, userData }: ClassesProps) {
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("all");

  const schedule: ClassItem[] = [
    { id: 1, name: "Advanced Mathematics", grade: "Grade 12", teacher: "Mr. Johnson", time: "8:00 AM - 9:30 AM", day: "Monday", room: "Room 101", students: 28, maxStudents: 30, color: "bg-blue-500" },
    { id: 2, name: "English Literature", grade: "Grade 11", teacher: "Ms. Smith", time: "9:45 AM - 11:15 AM", day: "Monday", room: "Room 205", students: 25, maxStudents: 30, color: "bg-green-500" },
    { id: 3, name: "Physics Lab", grade: "Grade 10", teacher: "Dr. Brown", time: "11:30 AM - 1:00 PM", day: "Monday", room: "Lab 3", students: 20, maxStudents: 25, color: "bg-purple-500" },
    { id: 4, name: "World History", grade: "Grade 9", teacher: "Mrs. Davis", time: "2:00 PM - 3:30 PM", day: "Monday", room: "Room 302", students: 30, maxStudents: 30, color: "bg-orange-500" },
    
    { id: 5, name: "Chemistry", grade: "Grade 10", teacher: "Dr. Wilson", time: "8:00 AM - 9:30 AM", day: "Tuesday", room: "Lab 2", students: 22, maxStudents: 25, color: "bg-red-500" },
    { id: 6, name: "Computer Science", grade: "Grade 12", teacher: "Mr. Garcia", time: "9:45 AM - 11:15 AM", day: "Tuesday", room: "Computer Lab", students: 24, maxStudents: 30, color: "bg-indigo-500" },
    { id: 7, name: "Biology", grade: "Grade 11", teacher: "Ms. Martinez", time: "11:30 AM - 1:00 PM", day: "Tuesday", room: "Lab 1", students: 26, maxStudents: 30, color: "bg-teal-500" },
    { id: 8, name: "Art & Design", grade: "Grade 9", teacher: "Mr. Lee", time: "2:00 PM - 3:30 PM", day: "Tuesday", room: "Art Studio", students: 18, maxStudents: 20, color: "bg-pink-500" },

    { id: 9, name: "Economics", grade: "Grade 12", teacher: "Dr. Taylor", time: "8:00 AM - 9:30 AM", day: "Wednesday", room: "Room 201", students: 27, maxStudents: 30, color: "bg-yellow-500" },
    { id: 10, name: "Physical Education", grade: "Grade 10", teacher: "Coach Adams", time: "9:45 AM - 11:15 AM", day: "Wednesday", room: "Gymnasium", students: 35, maxStudents: 40, color: "bg-cyan-500" },
  ];

  // Logic to filter based on user role and selected grade
  const filteredSchedule = schedule.filter((cls) => {
    // 1. Grade Filter
    const matchesGrade = selectedGrade === "all" || cls.grade === selectedGrade;
    
    // 2. Teacher Filter 
    // If user is a teacher, they can ONLY see their own classes.
    // If user is admin (or others), they can filter by the Selected Teacher dropdown.
    let matchesTeacher = true;

    if (userRole === "teacher") {
       matchesTeacher = cls.teacher === userData?.name;
    } else {
       // Admin/Student/Parent logic
       matchesTeacher = selectedTeacher === "all" || cls.teacher === selectedTeacher;
    }

    return matchesGrade && matchesTeacher;
  });

  const uniqueGrades = Array.from(new Set(schedule.map(s => s.grade))).sort();
  const uniqueTeachers = Array.from(new Set(schedule.map(s => s.teacher))).sort();

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Schedule"
        subtitle={userRole === "teacher" 
              ? "Manage and view your class schedule" 
              : "View and manage class schedules"}
        actions={
          <>
           {/* Teacher Filter (Visible only to non-teachers, e.g. Admins) */}
           {userRole !== "teacher" && (
             <div className="w-full sm:w-56">
                <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                  <SelectTrigger className="bg-white">
                    <div className="flex items-center gap-2">
                       <Users className="h-4 w-4 text-gray-400" />
                       <SelectValue placeholder="Filter by Teacher" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teachers</SelectItem>
                    {uniqueTeachers.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
           )}

           {/* Grade Filter */}
           <div className="w-full sm:w-48">
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="bg-white">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <SelectValue placeholder="Filter by Grade" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {uniqueGrades.map(g => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
           </div>
          </>
        }
      />

      <Tabs defaultValue="Monday" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {daysOfWeek.map((day) => (
            <TabsTrigger key={day} value={day}>
              {day}
            </TabsTrigger>
          ))}
        </TabsList>

        {daysOfWeek.map((day) => (
          <TabsContent key={day} value={day} className="space-y-4 mt-6">
            {filteredSchedule.filter(cls => cls.day === day).length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredSchedule
                  .filter(cls => cls.day === day)
                  .map((classItem) => (
                    <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`${classItem.color} w-1 h-16 rounded-full`}></div>
                            <div>
                              <CardTitle className="text-lg mb-2">{classItem.name}</CardTitle>
                              <div className="flex flex-col gap-0.5">
                                <p className="text-sm font-semibold text-gray-700">{classItem.grade}</p>
                                <p className="text-sm text-gray-600">{classItem.teacher}</p>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {classItem.students}/{classItem.maxStudents}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{classItem.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{classItem.day}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{classItem.room}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="h-4 w-4" />
                            <span>{classItem.students} students enrolled</span>
                          </div>
                          <div className="pt-3">
                            <Button className="w-full" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No classes scheduled for {day}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
