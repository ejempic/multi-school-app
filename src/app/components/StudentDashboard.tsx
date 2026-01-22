import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { 
  Layers, 
  Bell, 
  Calendar, 
  BookOpen, 
  ArrowRight,
  Smile,
  LogOut,
  User,
  GraduationCap
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { PageHeader } from "./ui/page-header";

interface StudentDashboardProps {
  userData: any;
  onNavigate: (view: any) => void;
  onLogout: () => void;
}

export function StudentDashboard({ userData, onNavigate, onLogout }: StudentDashboardProps) {
  const menuItems = [
    {
      id: "phases",
      title: "PACE Progress",
      description: "Update your workbooks and check your goals",
      icon: Layers,
      color: "from-amber-400 to-orange-500",
      iconColor: "text-amber-100"
    },
    {
      id: "announcements",
      title: "Announcements",
      description: "See what's happening at school today",
      icon: Bell,
      color: "from-blue-400 to-indigo-500",
      iconColor: "text-blue-100"
    },
    {
      id: "grades",
      title: "My Report Cards",
      description: "Official transcripts and PACE scores",
      icon: GraduationCap,
      color: "from-pink-400 to-rose-500",
      iconColor: "text-pink-100"
    },
    {
      id: "calendar",
      title: "Schedule",
      description: "Class times, holidays, and event dates",
      icon: Calendar,
      color: "from-emerald-400 to-teal-500",
      iconColor: "text-emerald-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-6 lg:p-12">
      <PageHeader
        title={`Hi, ${userData?.name?.split(' ')[0]}!`}
        subtitle="Welcome back to your dashboard"
        icon={Smile}
        actions={
          <Button 
            variant="outline" 
            size="lg" 
            onClick={onLogout}
            className="rounded-xl border-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all font-bold px-8"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        }
        className="mb-12"
      />

      {/* Main Grid - Coffee Table Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto w-full">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="group text-left"
            >
              <Card className="h-full border-none overflow-hidden shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/50 transition-all duration-300 rounded-[2.5rem] bg-white group-hover:-translate-y-2">
                <CardContent className="p-0 h-full flex flex-col">
                  {/* Visual Top Part */}
                  <div className={`h-40 bg-gradient-to-br ${item.color} flex items-center justify-center p-8 transition-all group-hover:h-44`}>
                    <div className={`${item.iconColor} bg-white/20 p-6 rounded-3xl backdrop-blur-md`}>
                      <Icon className="h-16 w-16" strokeWidth={2.5} />
                    </div>
                  </div>
                  
                  {/* Content Part */}
                  <div className="p-10 flex flex-col justify-between flex-1">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h2>
                      <p className="text-gray-500 text-lg leading-relaxed">{item.description}</p>
                    </div>
                    <div className="mt-8 flex items-center gap-3 font-bold text-lg text-gray-400 group-hover:text-blue-600 transition-colors">
                      Open Feature
                      <ArrowRight className="h-6 w-6 transform group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-6 px-10 py-5 bg-white rounded-full shadow-lg border-2 border-gray-100">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-blue-500" />
            <span className="text-gray-700 font-bold text-lg">{userData?.grade || 'Grade 3'}</span>
          </div>
          <div className="h-6 w-px bg-gray-200" />
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 text-indigo-500" />
            <span className="text-gray-700 font-bold text-lg">{userData?.username}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
