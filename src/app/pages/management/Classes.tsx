import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Download,
  Link as LinkIcon,
  Mic,
  MicOff,
  MessageSquareText,
  Paperclip,
  Plus,
  Video,
  VideoOff,
} from "lucide-react";
import { PageHeader } from "@/app/components/ui/page-header";

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

interface ClassPost {
  id: number;
  classId: number;
  title: string;
  message: string;
  date: string;
  createdBy: string;
  links: Array<{ label: string; url: string }>;
  downloads: Array<{ label: string; fileName: string }>;
}

interface ClassroomSection {
  id: number;
  name: string;
  grade: string;
  section: string;
  adviser: string;
  room: string;
  students: number;
  timeline: number[];
}

interface SeatAssignment {
  id: number;
  classroomId: number;
  seat: string;
  studentName: string;
  photo: string;
  videoEnabled: boolean;
  audioEnabled?: boolean;
  status: "Present" | "Late" | "Absent";
}

interface ClassesProps {
  userRole: string | null;
  userData: any;
}

export function Classes({ userRole, userData }: ClassesProps) {
  const [selectedSectionId, setSelectedSectionId] = useState<number>(101);
  const [newPostMessage, setNewPostMessage] = useState("");
  const [isClassVideoStarted, setIsClassVideoStarted] = useState(false);

  const schedule: ClassItem[] = [
    { id: 1, name: "Advanced Mathematics", grade: "Grade 12", teacher: "John Smith", time: "8:00 AM - 9:30 AM", day: "Monday", room: "Room 101", students: 28, maxStudents: 30, color: "bg-blue-500" },
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

  const classroomSections: ClassroomSection[] = [
    {
      id: 101,
      name: "Grade 12 - St. Matthew",
      grade: "Grade 12",
      section: "St. Matthew",
      adviser: "John Smith",
      room: "Room 101",
      students: 28,
      timeline: [1, 9, 6],
    },
    {
      id: 102,
      name: "Grade 11 - St. Anne",
      grade: "Grade 11",
      section: "St. Anne",
      adviser: "Ms. Smith",
      room: "Room 205",
      students: 25,
      timeline: [2, 7],
    },
    {
      id: 103,
      name: "Grade 10 - St. Luke",
      grade: "Grade 10",
      section: "St. Luke",
      adviser: "Dr. Brown",
      room: "Lab 3",
      students: 26,
      timeline: [5, 3, 10],
    },
    {
      id: 104,
      name: "Grade 9 - St. Mark",
      grade: "Grade 9",
      section: "St. Mark",
      adviser: "Mrs. Davis",
      room: "Room 302",
      students: 30,
      timeline: [4, 8],
    },
  ];

  const teacherTodayClassroomIds = userRole === "teacher" ? [101, 102, 103] : [];
  const teacherClassrooms = classroomSections.filter((section) => (
    teacherTodayClassroomIds.includes(section.id) ||
    section.adviser === userData?.name ||
    section.timeline.some((classId) => schedule.find((classItem) => classItem.id === classId)?.teacher === userData?.name)
  ));
  const visibleClassrooms = userRole === "teacher" && teacherClassrooms.length > 0 ? teacherClassrooms : classroomSections;
  const selectedClassroom = classroomSections.find((section) => section.id === selectedSectionId) || visibleClassrooms[0] || classroomSections[0];
  const currentClass = schedule.find((classItem) => classItem.id === selectedClassroom.timeline[0]) || schedule[0];
  const canManageClassroom = userRole === "admin" || userRole === "teacher";
  const subjectLegend = [
    { name: "Math", color: "bg-fuchsia-500" },
    { name: "APE", color: "bg-yellow-300" },
    { name: "EP", color: "bg-slate-300" },
    { name: "GMRC", color: "bg-amber-400" },
    { name: "Science", color: "bg-yellow-400" },
    { name: "Filipino", color: "bg-blue-500" },
    { name: "English", color: "bg-indigo-600" },
    { name: "CLE", color: "bg-pink-300" },
    { name: "TLE", color: "bg-lime-400" },
  ];
  const timelineRows = [
    {
      label: "Morning",
      blocks: [
        { subject: "APE", width: "7%", color: "bg-yellow-300" },
        { subject: "CLE", width: "10%", color: "bg-pink-300" },
        { subject: "EP", width: "10%", color: "bg-slate-400" },
        { subject: "English", width: "12%", color: "bg-indigo-600" },
        { subject: "Filipino", width: "9%", color: "bg-cyan-300" },
        { subject: "TLE", width: "9%", color: "bg-lime-400" },
        { subject: "Science", width: "13%", color: "bg-yellow-400" },
        { subject: "Break", width: "10%", color: "bg-slate-300" },
        { subject: "Math", width: "11%", color: "bg-fuchsia-500" },
        { subject: "APE", width: "9%", color: "bg-yellow-300" },
      ],
    },
    {
      label: "Afternoon",
      blocks: [
        { subject: "TLE", width: "7%", color: "bg-lime-400" },
        { subject: "Math", width: "10%", color: "bg-fuchsia-500" },
        { subject: "APE", width: "10%", color: "bg-yellow-300" },
        { subject: "EP", width: "12%", color: "bg-slate-300" },
        { subject: "Science", width: "9%", color: "bg-yellow-400" },
        { subject: "GMRC", width: "9%", color: "bg-amber-200" },
        { subject: "Science", width: "13%", color: "bg-yellow-400" },
        { subject: "English", width: "10%", color: "bg-indigo-600" },
        { subject: "CLE", width: "11%", color: "bg-pink-300" },
        { subject: "TLE", width: "9%", color: "bg-lime-400" },
      ],
    },
  ];

  const [classPosts, setClassPosts] = useState<ClassPost[]>([
    {
      id: 4,
      classId: 101,
      title: "Morning classroom reminder",
      message: "Good morning Grade 12 - St. Matthew. Please prepare your notebook before Advanced Mathematics starts.",
      date: "2026-08-30",
      createdBy: "John Smith",
      links: [],
      downloads: [],
    },
    {
      id: 1,
      classId: 1,
      title: "Quiz reviewer uploaded",
      message: "Please review the attached practice worksheet before Friday. Parents can help students check the sample problems.",
      date: "2026-08-30",
      createdBy: "John Smith",
      links: [{ label: "Open lesson reference", url: "https://example.com/math-reference" }],
      downloads: [{ label: "Download reviewer", fileName: "grade-12-math-reviewer.pdf" }],
    },
    {
      id: 2,
      classId: 1,
      title: "Seat plan updated",
      message: "The classroom seating plan has been updated for this week. Please check your assigned seat before class starts.",
      date: "2026-08-29",
      createdBy: "John Smith",
      links: [],
      downloads: [],
    },
    {
      id: 3,
      classId: 2,
      title: "Reading assignment",
      message: "Read chapter 4 and prepare one question for class discussion.",
      date: "2026-08-28",
      createdBy: "Ms. Smith",
      links: [{ label: "Reading guide", url: "https://example.com/reading-guide" }],
      downloads: [],
    },
    {
      id: 5,
      classId: 102,
      title: "English literature discussion",
      message: "Grade 11 - St. Anne, please bring your reading notes for our group discussion.",
      date: "2026-08-30",
      createdBy: "Ms. Smith",
      links: [],
      downloads: [],
    },
    {
      id: 6,
      classId: 103,
      title: "Lab reminder",
      message: "Grade 10 - St. Luke will use Lab 3 today. Please follow the safety reminders before entering.",
      date: "2026-08-30",
      createdBy: "Dr. Brown",
      links: [],
      downloads: [],
    },
    {
      id: 7,
      classId: 104,
      title: "History activity",
      message: "Grade 9 - St. Mark will prepare a short timeline activity for World History.",
      date: "2026-08-30",
      createdBy: "Mrs. Davis",
      links: [],
      downloads: [],
    },
  ]);

  const [seats, setSeats] = useState<SeatAssignment[]>([
    {
      id: 1,
      classroomId: 101,
      seat: "A1",
      studentName: "Emma Watson",
      photo: "https://images.unsplash.com/photo-1633381182794-01b10764b431?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400",
      videoEnabled: true,
      audioEnabled: true,
      status: "Present",
    },
    {
      id: 2,
      classroomId: 101,
      seat: "A2",
      studentName: "Luis Mendoza",
      photo: "https://images.unsplash.com/photo-1624918201580-388eae33e802?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400",
      videoEnabled: false,
      status: "Late",
    },
    {
      id: 3,
      classroomId: 101,
      seat: "B1",
      studentName: "Ana Reyes",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
      videoEnabled: false,
      status: "Present",
    },
    {
      id: 4,
      classroomId: 101,
      seat: "B2",
      studentName: "Pedro Garcia",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
      videoEnabled: true,
      status: "Absent",
    },
    {
      id: 5,
      classroomId: 101,
      seat: "C1",
      studentName: "Maya Santos",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
      videoEnabled: false,
      status: "Present",
    },
    {
      id: 6,
      classroomId: 101,
      seat: "C2",
      studentName: "Liam Johnson",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
      videoEnabled: false,
      status: "Present",
    },
    { id: 7, classroomId: 102, seat: "A1", studentName: "Sophia Cruz", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia", videoEnabled: true, audioEnabled: true, status: "Present" },
    { id: 8, classroomId: 102, seat: "A2", studentName: "Marco Lim", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco", videoEnabled: false, status: "Present" },
    { id: 9, classroomId: 102, seat: "B1", studentName: "Isabella Tan", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella", videoEnabled: false, status: "Late" },
    { id: 10, classroomId: 102, seat: "B2", studentName: "Noah Reyes", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah", videoEnabled: true, status: "Present" },
    { id: 11, classroomId: 103, seat: "A1", studentName: "Daniel Santos", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel", videoEnabled: true, audioEnabled: true, status: "Present" },
    { id: 12, classroomId: 103, seat: "A2", studentName: "Julia Ramos", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julia", videoEnabled: false, status: "Absent" },
    { id: 13, classroomId: 103, seat: "B1", studentName: "Miguel Dela Cruz", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel", videoEnabled: false, status: "Present" },
    { id: 14, classroomId: 103, seat: "B2", studentName: "Chloe Ong", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe", videoEnabled: true, status: "Late" },
    { id: 15, classroomId: 104, seat: "A1", studentName: "Gabriel Yu", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gabriel", videoEnabled: true, status: "Present" },
    { id: 16, classroomId: 104, seat: "A2", studentName: "Amelia Flores", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amelia", videoEnabled: false, status: "Present" },
    { id: 17, classroomId: 104, seat: "B1", studentName: "Rafael Torres", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rafael", videoEnabled: false, status: "Present" },
    { id: 18, classroomId: 104, seat: "B2", studentName: "Sofia Mercado", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia", videoEnabled: true, status: "Absent" },
  ]);

  const visiblePosts = classPosts.filter((post) => (
    post.classId === selectedClassroom.id || selectedClassroom.timeline.includes(post.classId)
  ));
  const visibleSeats = seats.filter((seat) => seat.classroomId === selectedClassroom.id);

  const handleCreatePost = () => {
    const trimmedMessage = newPostMessage.trim();
    if (!trimmedMessage) return;

    const post: ClassPost = {
      id: classPosts.length + 1,
      classId: selectedClassroom.id,
      title: trimmedMessage.length > 46 ? `${trimmedMessage.slice(0, 46)}...` : trimmedMessage,
      message: trimmedMessage,
      date: new Date().toISOString().split("T")[0],
      createdBy: userRole === "teacher" ? userData?.name || selectedClassroom.adviser : "Admin User",
      links: [],
      downloads: [],
    };

    setClassPosts([post, ...classPosts]);
    setNewPostMessage("");
  };

  const toggleSeatAudio = (seatId: number) => {
    setSeats(seats.map((seat) => (
      seat.id === seatId ? { ...seat, audioEnabled: !seat.audioEnabled } : seat
    )));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={MessageSquareText}
        title="Classroom"
        subtitle="A simple class feed organized by Grade and Section, with each classroom showing the subject timeline for the day."
      />

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Grade and Section</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {visibleClassrooms.map((classroom) => {
              const isSelected = classroom.id === selectedClassroom.id;

              return (
                <button
                  key={classroom.id}
                  type="button"
                  onClick={() => setSelectedSectionId(classroom.id)}
                  className={`rounded-lg border-2 p-4 text-left transition ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                  }`}
                >
                  <p className="font-bold text-slate-950">{classroom.grade}</p>
                  <p className="text-sm font-semibold text-slate-700">{classroom.section}</p>
                  <p className="mt-2 text-xs text-slate-500">{classroom.students} students - {classroom.room}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-12">
        <aside className="xl:col-span-8">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-base">Class Seats</CardTitle>
                  <p className="text-sm text-slate-500">{selectedClassroom.name} - {selectedClassroom.room}</p>
                </div>
                <Badge variant="outline">{visibleSeats.length} seats</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative min-h-[520px] overflow-hidden rounded-lg border border-slate-200 bg-white p-5">
                <div
                  className={`mx-auto flex aspect-video w-full max-w-72 items-center justify-center border-4 ${
                    isClassVideoStarted
                      ? "border-blue-600 bg-slate-950 text-white"
                      : "border-slate-950 bg-white text-slate-950"
                  }`}
                >
                  <div className="text-center">
                    {isClassVideoStarted ? (
                      <Video className="mx-auto h-7 w-7" />
                    ) : (
                      <VideoOff className="mx-auto h-7 w-7 text-slate-500" />
                    )}
                    <p className="mt-2 text-xs font-bold">Teacher Video</p>
                    <p className="text-[11px] opacity-70">{selectedClassroom.adviser}</p>
                    <Button
                      size="sm"
                      className={`mt-3 ${isClassVideoStarted ? "bg-red-600 hover:bg-red-700" : "bg-slate-950 hover:bg-slate-800"}`}
                      disabled={!canManageClassroom && !isClassVideoStarted}
                      onClick={() => canManageClassroom && setIsClassVideoStarted((started) => !started)}
                    >
                      {isClassVideoStarted ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                      {canManageClassroom
                        ? isClassVideoStarted ? "Leave Class" : "Enter Class"
                        : isClassVideoStarted ? "Enter Class" : "Class Offline"}
                    </Button>
                  </div>
                </div>
                <div className="mx-auto mt-5 h-2 w-36 bg-slate-950" />

                <div className="mt-10 grid grid-cols-4 gap-3 sm:grid-cols-5 xl:grid-cols-6">
                  {visibleSeats.map((seat) => (
                    <div
                      key={seat.id}
                      className={`relative flex aspect-square overflow-hidden border-2 text-left ${
                        seat.status === "Absent"
                          ? "border-red-600 bg-red-600 text-white"
                          : isClassVideoStarted && seat.videoEnabled
                            ? "border-blue-600 bg-slate-950 text-white"
                            : "border-slate-950 bg-white text-slate-950"
                      }`}
                    >
                      {seat.status === "Absent" ? (
                        <div className="flex h-full w-full items-center justify-center p-2 text-center text-[11px] font-bold leading-tight">
                          {seat.studentName}
                        </div>
                      ) : isClassVideoStarted && seat.videoEnabled ? (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-2 text-center">
                          <Video className="h-5 w-5" />
                          <p className="line-clamp-2 text-[11px] font-bold leading-tight">{seat.studentName}</p>
                        </div>
                      ) : (
                        <>
                          <img src={seat.photo} alt={seat.studentName} className="absolute inset-0 h-full w-full object-cover" />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent p-2 pt-6">
                            <p className="line-clamp-2 text-[11px] font-bold leading-tight text-white">{seat.studentName}</p>
                          </div>
                        </>
                      )}
                      {canManageClassroom && seat.status !== "Absent" && (
                        <Button
                          type="button"
                          size="icon"
                          variant="secondary"
                          aria-label={`${seat.audioEnabled ? "Mute" : "Unmute"} ${seat.studentName}`}
                          title={`${seat.audioEnabled ? "Mute" : "Unmute"} ${seat.studentName}`}
                          onClick={() => toggleSeatAudio(seat.id)}
                          className={`absolute bottom-1 left-1 h-6 w-6 rounded-full p-0 ${
                            seat.audioEnabled
                              ? "bg-emerald-500 text-white hover:bg-emerald-600"
                              : "bg-white text-slate-950 hover:bg-slate-100"
                          }`}
                        >
                          {seat.audioEnabled ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3" />}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-5 right-5 h-24 w-2 bg-slate-950" />
              </div>
            </CardContent>
          </Card>
        </aside>

        <Card className="overflow-hidden border-2 border-blue-600 shadow-sm xl:col-span-4">
          <CardContent className="space-y-5 p-4">
            <div>
              <p className="font-bold text-slate-950">Timeline</p>
              <p className="text-sm text-slate-500">{selectedClassroom.name}</p>
            </div>

            <div className="grid grid-cols-[68px_minmax(0,1fr)] gap-2 px-2 text-[10px] text-slate-600">
              <span>Time</span>
              <div className="grid grid-cols-6">
                <span>7:00</span>
                <span>8:30</span>
                <span>9:00</span>
                <span>10:00</span>
                <span>11:00</span>
                <span className="text-right">16:00</span>
              </div>
            </div>

            <div className="space-y-3">
              {timelineRows.map((row) => (
                <div key={row.label} className="grid grid-cols-[68px_minmax(0,1fr)] gap-2 rounded-xl border border-slate-200 bg-white p-2">
                  <div className="flex items-center justify-center rounded-sm bg-slate-50 px-1 text-center text-[11px] font-bold leading-tight text-slate-950">
                    {row.label}
                  </div>
                  <div className="relative overflow-hidden rounded-2xl border-2 border-blue-600">
                    <span className="absolute left-[18%] top-0 z-10 h-full w-px bg-red-500" />
                    <div className="flex h-12">
                      {row.blocks.map((block, index) => (
                        <span
                          key={`${row.label}-${block.subject}-${index}`}
                          className={`${block.color} h-full border-r border-white/70 text-[0px] last:border-r-0`}
                          style={{ width: block.width }}
                          title={block.subject}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-3">
              {selectedClassroom.timeline.map((classId, index) => {
                const classItem = schedule.find((item) => item.id === classId);
                if (!classItem) return null;

                return (
                  <div key={classItem.id} className="rounded-lg border border-slate-200 bg-white p-3 text-left">
                    <p className="text-xs font-semibold text-slate-500">{index === 0 ? "Current" : "Next"}</p>
                    <p className="font-bold text-slate-950">{classItem.name}</p>
                    <p className="text-xs text-slate-500">{classItem.time}</p>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-200 pt-4">
              <p className="mb-3 text-sm font-bold text-slate-950">Subjects</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {subjectLegend.map((subject) => (
                  <div key={subject.name} className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                    <span className={`h-4 w-4 shrink-0 rounded-sm ${subject.color}`} />
                    {subject.name}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="space-y-4 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {canManageClassroom ? "T" : "S"}
                </div>
                <div>
                  <p className="font-bold text-slate-950">{selectedClassroom.name}</p>
                  <p className="text-sm text-slate-500">
                    Posting to {currentClass.name} timeline for students and parents
                  </p>
                </div>
              </div>

              {canManageClassroom ? (
                <>
                  <Textarea
                    value={newPostMessage}
                    onChange={(event) => setNewPostMessage(event.target.value)}
                    placeholder={`Write something to ${selectedClassroom.name}...`}
                    className="min-h-28 resize-none border-slate-200 bg-slate-50 text-base"
                  />
                  <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        <Paperclip className="h-4 w-4" />
                        Attach
                      </Button>
                      <Button variant="outline" size="sm">
                        <LinkIcon className="h-4 w-4" />
                        Link
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                        File
                      </Button>
                    </div>
                    <Button onClick={handleCreatePost} disabled={!newPostMessage.trim()}>
                      <Plus className="h-4 w-4" />
                      Post
                    </Button>
                  </div>
                </>
              ) : (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  New announcements, links, and downloads from the teacher will appear here.
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            {visiblePosts.map((post) => (
              <Card key={post.id} className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                      {post.createdBy.split(" ").map((name) => name[0]).join("").slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base">{post.createdBy}</CardTitle>
                      <p className="text-sm text-slate-500">
                        {selectedClassroom.name} - {post.date}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="whitespace-pre-line text-sm leading-7 text-slate-700">{post.message}</p>
                  {(post.links.length > 0 || post.downloads.length > 0) && (
                    <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                      {post.links.map((link) => (
                        <Button key={link.url} variant="outline" size="sm" asChild>
                          <a href={link.url} target="_blank" rel="noreferrer">
                            <LinkIcon className="h-4 w-4" />
                            {link.label}
                          </a>
                        </Button>
                      ))}
                      {post.downloads.map((file) => (
                        <Button key={file.fileName} variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                          {file.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
