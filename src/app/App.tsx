import { useState } from "react";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { Students } from "./components/Students";
import { Classes } from "./components/Classes";
import { Grades } from "./components/Grades";
import { Tuitions } from "./components/Tuitions";
import { Announcements } from "./components/Announcements";
import { CalendarView } from "./components/CalendarView";
import { ParentDashboard } from "./components/ParentDashboard";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  DollarSign,
  Bell,
  Calendar,
  Menu,
  X,
  LogOut,
} from "lucide-react";

type View = "dashboard" | "students" | "classes" | "grades" | "tuitions" | "announcements" | "calendar";
type UserRole = "admin" | "teacher" | "parent" | null;

interface UserData {
  name: string;
  email: string;
  role: string;
  [key: string]: any;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogin = (role: "admin" | "teacher" | "parent", data: any) => {
    setUserRole(role);
    setUserData(data);
    setIsLoggedIn(true);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUserData(null);
    setCurrentView("dashboard");
  };

  // Define menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      { id: "dashboard" as View, label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "teacher", "parent"] },
      { id: "announcements" as View, label: "Announcements", icon: Bell, roles: ["admin", "teacher", "parent"] },
      { id: "calendar" as View, label: "Calendar", icon: Calendar, roles: ["admin", "teacher", "parent"] },
    ];

    const adminTeacherItems = [
      { id: "students" as View, label: "Students", icon: Users, roles: ["admin", "teacher"] },
      { id: "classes" as View, label: "Classes", icon: BookOpen, roles: ["admin", "teacher"] },
      { id: "grades" as View, label: "Grades", icon: GraduationCap, roles: ["admin", "teacher"] },
      { id: "tuitions" as View, label: "Tuitions", icon: DollarSign, roles: ["admin"] },
    ];

    return [...baseItems, ...adminTeacherItems].filter(item => 
      item.roles.includes(userRole as string)
    );
  };

  const renderView = () => {
    if (userRole === "parent" && currentView === "dashboard") {
      return <ParentDashboard userData={userData} />;
    }
    
    if (userRole === "teacher" && currentView === "dashboard") {
      return <TeacherDashboard userData={userData} />;
    }

    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "students":
        return <Students />;
      case "classes":
        return <Classes />;
      case "grades":
        return <Grades />;
      case "tuitions":
        return <Tuitions />;
      case "announcements":
        return <Announcements userRole={userRole as "admin" | "teacher" | "parent"} />;
      case "calendar":
        return <CalendarView userRole={userRole as "admin" | "teacher" | "parent"} />;
      default:
        return <Dashboard />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl">School Portal</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm">{userData?.name}</p>
              <p className="text-xs text-gray-600">{userData?.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white uppercase">
              {userData?.name.charAt(0)}
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:sticky top-[73px] left-0 z-30 h-[calc(100vh-73px)] w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out`}
        >
          <nav className="p-4 space-y-2">
            {/* User Role Badge */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Logged in as</p>
              <p className="text-sm capitalize">{userRole}</p>
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    if (window.innerWidth < 1024) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
