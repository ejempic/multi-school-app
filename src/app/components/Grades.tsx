import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Progress } from "./ui/progress";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Grade {
  id: number;
  subject: string;
  assignment: string;
  score: number;
  maxScore: number;
  date: string;
  grade: string;
  trend: "up" | "down" | "stable";
}

export function Grades() {
  const [selectedStudent, setSelectedStudent] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const grades: Grade[] = [
    { id: 1, subject: "Mathematics", assignment: "Midterm Exam", score: 92, maxScore: 100, date: "2026-01-05", grade: "A", trend: "up" },
    { id: 2, subject: "Mathematics", assignment: "Homework Set 5", score: 88, maxScore: 100, date: "2026-01-03", grade: "B+", trend: "stable" },
    { id: 3, subject: "English", assignment: "Essay: Shakespeare", score: 95, maxScore: 100, date: "2026-01-04", grade: "A", trend: "up" },
    { id: 4, subject: "Physics", assignment: "Lab Report 3", score: 85, maxScore: 100, date: "2026-01-02", grade: "B", trend: "down" },
    { id: 5, subject: "Chemistry", assignment: "Quiz 4", score: 90, maxScore: 100, date: "2026-01-06", grade: "A-", trend: "up" },
    { id: 6, subject: "History", assignment: "Research Paper", score: 87, maxScore: 100, date: "2025-12-28", grade: "B+", trend: "stable" },
    { id: 7, subject: "Computer Science", assignment: "Project 2", score: 98, maxScore: 100, date: "2026-01-07", grade: "A+", trend: "up" },
    { id: 8, subject: "Biology", assignment: "Chapter Test", score: 82, maxScore: 100, date: "2025-12-30", grade: "B", trend: "down" },
  ];

  const subjects = ["all", ...Array.from(new Set(grades.map(g => g.subject)))];

  const filteredGrades = grades.filter(grade => {
    if (selectedSubject !== "all" && grade.subject !== selectedSubject) return false;
    return true;
  });

  const averageScore = filteredGrades.length > 0
    ? filteredGrades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / filteredGrades.length
    : 0;

  const subjectAverages = subjects
    .filter(s => s !== "all")
    .map(subject => {
      const subjectGrades = grades.filter(g => g.subject === subject);
      const avg = subjectGrades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / subjectGrades.length;
      return { subject, average: avg };
    });

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "bg-green-100 text-green-800";
    if (grade.startsWith("B")) return "bg-blue-100 text-blue-800";
    if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Grades & Assessments</h1>
        <p className="text-gray-600">Track student performance and progress</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.filter(s => s !== "all").map(subject => (
              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Overall Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl mb-2">{averageScore.toFixed(1)}%</div>
            <Progress value={averageScore} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Total Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{filteredGrades.length}</div>
            <p className="text-sm text-gray-600 mt-2">Graded assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Latest Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl mb-2">{filteredGrades[0]?.grade || "N/A"}</div>
            <p className="text-sm text-gray-600">{filteredGrades[0]?.subject || ""}</p>
          </CardContent>
        </Card>
      </div>

      {/* Subject Averages */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectAverages.map(({ subject, average }) => (
              <div key={subject}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{subject}</span>
                  <span className="text-sm">{average.toFixed(1)}%</span>
                </div>
                <Progress value={average} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredGrades.map((grade) => (
              <div key={grade.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4>{grade.assignment}</h4>
                    <Badge className={getGradeColor(grade.grade)}>
                      {grade.grade}
                    </Badge>
                    {getTrendIcon(grade.trend)}
                  </div>
                  <p className="text-sm text-gray-600">{grade.subject} • {grade.date}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg">{grade.score}/{grade.maxScore}</div>
                  <div className="text-sm text-gray-600">{((grade.score / grade.maxScore) * 100).toFixed(0)}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
