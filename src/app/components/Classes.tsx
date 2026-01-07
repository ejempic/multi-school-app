import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface ClassItem {
  id: number;
  name: string;
  teacher: string;
  time: string;
  day: string;
  room: string;
  students: number;
  maxStudents: number;
  color: string;
}

export function Classes() {
  const schedule: ClassItem[] = [
    { id: 1, name: "Advanced Mathematics", teacher: "Mr. Johnson", time: "8:00 AM - 9:30 AM", day: "Monday", room: "Room 101", students: 28, maxStudents: 30, color: "bg-blue-500" },
    { id: 2, name: "English Literature", teacher: "Ms. Smith", time: "9:45 AM - 11:15 AM", day: "Monday", room: "Room 205", students: 25, maxStudents: 30, color: "bg-green-500" },
    { id: 3, name: "Physics Lab", teacher: "Dr. Brown", time: "11:30 AM - 1:00 PM", day: "Monday", room: "Lab 3", students: 20, maxStudents: 25, color: "bg-purple-500" },
    { id: 4, name: "World History", teacher: "Mrs. Davis", time: "2:00 PM - 3:30 PM", day: "Monday", room: "Room 302", students: 30, maxStudents: 30, color: "bg-orange-500" },
    
    { id: 5, name: "Chemistry", teacher: "Dr. Wilson", time: "8:00 AM - 9:30 AM", day: "Tuesday", room: "Lab 2", students: 22, maxStudents: 25, color: "bg-red-500" },
    { id: 6, name: "Computer Science", teacher: "Mr. Garcia", time: "9:45 AM - 11:15 AM", day: "Tuesday", room: "Computer Lab", students: 24, maxStudents: 30, color: "bg-indigo-500" },
    { id: 7, name: "Biology", teacher: "Ms. Martinez", time: "11:30 AM - 1:00 PM", day: "Tuesday", room: "Lab 1", students: 26, maxStudents: 30, color: "bg-teal-500" },
    { id: 8, name: "Art & Design", teacher: "Mr. Lee", time: "2:00 PM - 3:30 PM", day: "Tuesday", room: "Art Studio", students: 18, maxStudents: 20, color: "bg-pink-500" },

    { id: 9, name: "Economics", teacher: "Dr. Taylor", time: "8:00 AM - 9:30 AM", day: "Wednesday", room: "Room 201", students: 27, maxStudents: 30, color: "bg-yellow-500" },
    { id: 10, name: "Physical Education", teacher: "Coach Adams", time: "9:45 AM - 11:15 AM", day: "Wednesday", room: "Gymnasium", students: 35, maxStudents: 40, color: "bg-cyan-500" },
  ];

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Class Schedule</h1>
        <p className="text-gray-600">View and manage class timetables</p>
      </div>

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
            {schedule.filter(cls => cls.day === day).length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {schedule
                  .filter(cls => cls.day === day)
                  .map((classItem) => (
                    <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`${classItem.color} w-1 h-16 rounded-full`}></div>
                            <div>
                              <CardTitle className="text-lg mb-2">{classItem.name}</CardTitle>
                              <p className="text-sm text-gray-600">{classItem.teacher}</p>
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
