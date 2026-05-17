import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { LandingPage } from "./components/LandingPage";
import { TenantLandingPage } from "./components/TenantLandingPage";
import { useTenant } from "./contexts/TenantContext";
import { Students } from "./components/Students";
import { Classes } from "./components/Classes";
import { Grades } from "./components/Grades";
import { Tuitions } from "./components/Tuitions";
import { Announcements } from "./components/Announcements";
import { CalendarView } from "./components/CalendarView";
import { ParentDashboard } from "./components/ParentDashboard";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { StudentDashboard } from "./components/StudentDashboard";
import { ParentControls } from "./components/ParentControls";
import { TeacherControls } from "./components/TeacherControls";
import { Attendance } from "./components/Attendance";
import { StudentScanner } from "./components/StudentScanner";
import { Phases } from "./components/Phases";
import { PaceManagement } from "./components/PaceManagement";
import { SickLeaves } from "./components/SickLeaves";
import { BehaviorManager } from "./components/BehaviorManager";
import { TenantManagement } from "./components/TenantManagement";
import { PlanManagement } from "./components/PlanManagement";
import { ClinicManagement } from "./components/ClinicManagement";
import { LibraryManagement } from "./components/LibraryManagement";
import { Settings as SettingsComponent } from "./components/Settings";
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
  Barcode,
  Layers,
  Settings,
  ArrowLeft,
  Stethoscope,
  Award,
  Activity,
  Library,
} from "lucide-react";

// Helper to check brightness
const getContrastDetails = (hexColor?: string) => {
  if (!hexColor || !hexColor.startsWith('#')) return { isDark: false, textColor: '#111827', borderColor: '#e5e7eb' };
  
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  const isDark = brightness < 128;
  return {
    isDark,
    textColor: isDark ? '#f9fafb' : '#111827', // gray-50 vs gray-900
    subTextColor: isDark ? '#9ca3af' : '#6b7280', // gray-400 vs gray-500
    borderColor: isDark ? '#374151' : '#e5e7eb', // gray-700 vs gray-200
    cardBg: isDark ? '#1f2937' : '#ffffff' // gray-800 vs white
  };
};

type View = "dashboard" | "students" | "classes" | "grades" | "tuitions" | "announcements" | "calendar" | "parents" | "staff" | "attendance" | "phases" | "pace-management" | "sick-leaves" | "behavior" | "tenants" | "plans" | "clinic" | "library" | "settings";
type UserRole = "admin" | "teacher" | "parent" | "student" | "nurse" | "librarian" | null;

interface UserData {
  name: string;
  username: string;
  role: string;
  email?: string;
  [key: string]: any;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { currentTenant } = useTenant();
  
  const theme = getContrastDetails(currentTenant?.theme?.background);

  // If no tenant is selected, show the landing page (unless we are on a specific route that shouldn't be blocked?)
  // Actually, we can just conditionally render the whole App structure or the Landing Page.
  if (!currentTenant) {
     return <LandingPage />;
  }

  const handleLogin = (role: UserRole, data: any) => {
    setUserRole(role);
    setUserData(data);
    setIsLoggedIn(true);
    setCurrentView("dashboard");
    navigate("/");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUserData(null);
    setCurrentView("dashboard");
    navigate("/");
  };

  // Define menu items based on user role
  const getMenuItems = () => {
    // Platform Admin Menu
    if (currentTenant?.id === 'admin') {
       return [
         { id: "tenants" as View, label: "Tenants", icon: Layers, roles: ["admin"], category: "PLATFORM" },
         { id: "plans" as View, label: "Plans", icon: DollarSign, roles: ["admin"], category: "PLATFORM" },
       ];
    }

    const items = [
      { id: "dashboard" as View, label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "teacher", "parent", "student", "nurse", "librarian"], category: "OVERVIEW" },
      
      // Communications
      { id: "announcements" as View, label: "Announcements", icon: Bell, roles: ["admin", "teacher", "parent", "student", "nurse", "librarian"], category: "COMMUNICATION" },
      { id: "calendar" as View, label: "Calendar", icon: Calendar, roles: ["admin", "teacher", "parent", "student", "nurse", "librarian"], category: "COMMUNICATION" },
      
      // Academic Tracking
      { id: "phases" as View, label: "PACE Progress", icon: Layers, roles: ["admin", "teacher", "parent", "student"], category: "ACADEMICS" },
      { id: "grades" as View, label: "Report Cards", icon: GraduationCap, roles: ["admin", "teacher", "student"], category: "ACADEMICS" },
      { id: "attendance" as View, label: "Attendance", icon: Barcode, roles: ["admin", "teacher", "student"], category: "ACADEMICS" },
      { id: "behavior" as View, label: "Merits & Demerits", icon: Award, roles: ["admin", "teacher", "parent"], category: "ACADEMICS" },
      
      // Management
      { id: "students" as View, label: "Students", icon: Users, roles: ["admin", "teacher"], category: "MANAGEMENT" },
      { id: "classes" as View, label: "Classes", icon: BookOpen, roles: ["admin", "teacher"], category: "MANAGEMENT" },
      { id: "tuitions" as View, label: "Tuitions", icon: DollarSign, roles: ["admin"], category: "MANAGEMENT" },
      { id: "staff" as View, label: "School Staff", icon: BookOpen, roles: ["admin"], category: "MANAGEMENT" },
      { id: "sick-leaves" as View, label: "Sick Leaves", icon: Stethoscope, roles: ["admin", "teacher", "parent"], category: "MANAGEMENT" },
      
      // Admin / Config
      { id: "parents" as View, label: "Parent Accounts", icon: Users, roles: ["admin"], category: "ADMINISTRATION" },
      { id: "pace-management" as View, label: "PACE Config", icon: Settings, roles: ["admin", "teacher", "parent"], category: "ADMINISTRATION" },
      { id: "settings" as View, label: "School Settings", icon: Settings, roles: ["admin"], category: "ADMINISTRATION" },
    ];

    // Conditionally add modules based on tenant features
    if (currentTenant?.features?.includes("Clinic Management")) {
      items.push({ id: "clinic" as View, label: "Clinic", icon: Activity, roles: ["admin", "nurse"], category: "MANAGEMENT" });
    }

    if (currentTenant?.features?.includes("Library Management")) {
      items.push({ id: "library" as View, label: "Library", icon: Library, roles: ["admin"], category: "MANAGEMENT" });
    }

    return items.filter(item => 
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

    if (userRole === "student" && currentView === "dashboard") {
      return <StudentDashboard userData={userData} onNavigate={setCurrentView} onLogout={handleLogout} />;
    }

    if (userRole === "nurse" && currentView === "dashboard") {
        return <ClinicManagement />;
    }

    if (userRole === "librarian" && currentView === "dashboard") {
        return <LibraryManagement />;
    }

    switch (currentView) {
      case "dashboard":
        if (currentTenant?.id === 'admin') return <TenantManagement />;
        return <Dashboard />;
      case "students":
        return <Students onNavigate={setCurrentView} />;
      case "classes":
        return <Classes userRole={userRole} userData={userData} />;
      case "grades":
        return <Grades userRole={userRole} userData={userData} />;
      case "tuitions":
        return <Tuitions />;
      case "announcements":
        return <Announcements userRole={userRole as "admin" | "teacher" | "parent" | "student"} />;
      case "calendar":
        return <CalendarView userRole={userRole as "admin" | "teacher" | "parent" | "student"} />;
      case "parents":
        return <ParentControls />;
      case "staff":
        return <TeacherControls />;
      case "attendance":
        return <Attendance />;
      case "phases":
        return <Phases userRole={userRole} userData={userData} onNavigate={setCurrentView} />;
      case "clinic":
        return <ClinicManagement />;
      case "library":
        return <LibraryManagement />;
      case "pace-management":
        return <PaceManagement />;
      case "sick-leaves":
        return <SickLeaves userRole={userRole as string} />;
      case "behavior":
        return <BehaviorManager userRole={userRole} userData={userData} />;
      case "tenants":
        return <TenantManagement />;
      case "plans":
        return <PlanManagement />;
      case "settings":
        return <SettingsComponent />;
      default:
        return <Dashboard />;
    }
  };

  const isCoffeeTableMode = userRole === "student" && currentView === "dashboard";

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={
        !isLoggedIn ? (
          <TenantLandingPage
            tenant={currentTenant}
            onLogin={() => navigate("/login")}
          />
        ) : isCoffeeTableMode ? (
          <div 
            className="min-h-screen"
            style={{ 
              backgroundColor: currentTenant?.theme?.background || '#f9fafb',
              color: currentTenant?.theme?.primary || '#1e3a8a'
             }}
          >
            <style>{`\n              :root {\n                --theme-primary: ${currentTenant?.theme?.primary || '#1e3a8a'};\n                --theme-secondary: ${currentTenant?.theme?.secondary || '#1d4ed8'};\n                --theme-accent: ${currentTenant?.theme?.accent || '#eab308'};\n                --theme-background: ${currentTenant?.theme?.background || '#f9fafb'};\n              }\n              h1, h2, h3, h4, h5, h6 {\n                color: var(--theme-primary) !important;\n              }\n              // Sidebar overrides\n              .sidebar-nav {\n                background-color: var(--theme-background) !important;\n                border-right-color: var(--theme-secondary) !important;\n              }\n            `}</style>
            <Toaster />
            {renderView()}
          </div>
        ) : userRole === "student" ? (
          <div 
            className="min-h-screen"
            style={{ 
              backgroundColor: currentTenant?.theme?.background || '#f9fafb',
              color: currentTenant?.theme?.primary || '#1e3a8a'
            }}
          >
            <style>{`\n              :root {\n                --theme-primary: ${currentTenant?.theme?.primary || '#1e3a8a'};\n                --theme-secondary: ${currentTenant?.theme?.secondary || '#1d4ed8'};\n                --theme-accent: ${currentTenant?.theme?.accent || '#eab308'};\n                --theme-background: ${currentTenant?.theme?.background || '#f9fafb'};\n              }\n              h1, h2, h3, h4, h5, h6 {\n                color: var(--theme-primary) !important;\n              }\n            `}</style>
            <Toaster />
            <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-40">
              <Button 
                variant="ghost" 
                onClick={() => setCurrentView("dashboard")}
                className="flex items-center gap-2 font-bold text-gray-600 hover:text-blue-600"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Home
              </Button>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-500">{userData?.name}</span>
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                  {userData?.name?.charAt(0)}
                </div>
              </div>
            </header>
            <main className="p-6 lg:p-12">
              <div className="max-w-7xl mx-auto">
                {renderView()}
              </div>
            </main>
          </div>
        ) : (
          <>
            <div 
              className="min-h-screen transition-colors duration-300"
              style={{ backgroundColor: currentTenant?.theme?.background || '#f9fafb', color: theme.textColor }}
            >
             <style>{`\n              :root {\n                --theme-primary: ${currentTenant?.theme?.primary || '#1e3a8a'};\n                --theme-secondary: ${currentTenant?.theme?.secondary || '#1d4ed8'};\n                --theme-accent: ${currentTenant?.theme?.accent || '#eab308'};\n                --theme-background: ${currentTenant?.theme?.background || '#f9fafb'};\n                --theme-text: ${theme.textColor};\n                --theme-border: ${theme.borderColor};\n                --theme-card-bg: ${theme.cardBg};\n                --theme-nav-hover: ${theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(30,58,138,0.08)'};\n                --theme-nav-active: ${currentTenant?.theme?.secondary || '#2563eb'};\n                --theme-nav-text: ${theme.textColor};\n                --theme-nav-muted: ${theme.subTextColor};\n              }\n              body {\n                color: var(--theme-text);\n              }\n              h1, h2, h3, h4, h5, h6 {\n                color: var(--theme-text) !important;\n              }\n              .text-muted-foreground {\n                color: var(--theme-nav-muted) !important;\n              }\n              .border-gray-200, .border-b, .border-r {\n                border-color: var(--theme-border) !important;\n              }\n              .bg-white {\n                background-color: var(--theme-card-bg) !important;\n              }\n              .sidebar-wrapper {\n                 background-color: var(--theme-background) !important;\n                 border-right: 1px solid var(--theme-border) !important;\n              }\n              .sidebar-wrapper button {\n                color: var(--theme-nav-text) !important;\n                background: none;\n                transition: background 0.15s, color 0.15s;\n              }\n              .sidebar-wrapper button:hover {\n                background: var(--theme-nav-hover) !important;\n                color: var(--theme-nav-text) !important;\n              }\n              .sidebar-wrapper button[aria-current=\"page\"],\n              .sidebar-wrapper button.active {\n                background: var(--theme-nav-active) !important;\n                color: #fff !important;\n              }\n            `}</style>
              <Toaster />
              {/* Header */}
              <header 
                className="sticky top-0 z-40 transition-colors duration-300"
                style={{ 
                    backgroundColor: currentTenant?.theme?.background || '#ffffff',
                    borderBottomColor: theme.borderColor
                }}
              >
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
                       {currentTenant?.logo ? (
                         <img src={currentTenant.logo} alt={currentTenant?.id || "School Logo"} className="h-10 w-10 object-contain" />
                       ) : (
                         currentTenant?.id === 'admin' && <div className="h-10 w-10 bg-slate-900 rounded flex items-center justify-center text-white font-bold">SA</div>
                       )}
                       <div className="flex flex-col">
                        <span 
                          className="text-sm font-bold leading-none"
                          style={{ color: currentTenant?.theme?.primary && currentTenant.theme.primary.startsWith('#') ? currentTenant.theme.primary : undefined }}
                        >
                          {currentTenant?.id === 'admin' ? 'PLATFORM ADMIN' : (currentTenant?.id.toUpperCase() || "SCHOOL")}
                        </span>
                        <span 
                            className="text-[10px]"
                            style={{ color: theme.subTextColor }}
                        >
                          {currentTenant?.id === 'admin' ? 'System Management' : 'School Portal'}
                        </span>
                       </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {userRole === 'admin' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate("/student-scanner")}
                        className="hidden md:flex items-center gap-2"
                        style={{
                            borderColor: currentTenant?.theme?.accent && currentTenant.theme.accent.startsWith('#') ? currentTenant.theme.accent : undefined,
                            color: currentTenant?.theme?.accent && currentTenant.theme.accent.startsWith('#') ? currentTenant.theme.accent : undefined,
                        }}
                      >
                        <Barcode className="h-4 w-4" />
                        <span className="text-xs">ID Scanner</span>
                      </Button>
                    )}
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium" style={{ color: theme.textColor }}>{userData?.name}</p>
                      <p className="text-xs" style={{ color: theme.subTextColor }}>{userData?.username}</p>
                    </div>
                    <div 
                      className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white uppercase"
                      style={{ backgroundColor: currentTenant?.theme?.primary && currentTenant.theme.primary.startsWith('#') ? currentTenant.theme.primary : undefined }}
                    >
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
                  className={`sidebar-wrapper ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                  } lg:translate-x-0 fixed lg:sticky top-[73px] left-0 z-30 h-[calc(100vh-73px)] w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out`}
                >
                  <nav className="p-4 space-y-4">
                    {/* User Role Badge */}
                    <div 
                      className="mb-2 p-3 bg-blue-50 rounded-lg"
                      style={{ 
                        backgroundColor: currentTenant?.theme?.secondary && currentTenant.theme.secondary.startsWith('#') ? `${currentTenant.theme.secondary}15` : undefined, // 15 is hex for ~10% opacity
                        borderColor: currentTenant?.theme?.secondary && currentTenant.theme.secondary.startsWith('#') ? `${currentTenant.theme.secondary}30` : undefined,
                      }}
                    >
                      <p className="text-xs mb-1" style={{ color: theme.subTextColor }}>Logged in as</p>
                      <p className="text-sm capitalize font-semibold" style={{ color: theme.textColor }}>{userRole}</p>
                    </div>

                    {(() => {
                      const grouped = getMenuItems().reduce((acc, item) => {
                        const cat = item.category || "GENERAL";
                        if (!acc[cat]) acc[cat] = [];
                        acc[cat].push(item);
                        return acc;
                      }, {} as Record<string, any[]>);

                      const categoryOrder = ["PLATFORM", "OVERVIEW", "COMMUNICATION", "MANAGEMENT", "ACADEMICS", "ADMINISTRATION"];

                      return Object.entries(grouped)
                        .sort(([catA], [catB]) => {
                          const idxA = categoryOrder.indexOf(catA);
                          const idxB = categoryOrder.indexOf(catB);
                          return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
                        })
                        .map(([category, items]) => (
                          <div key={category} className="space-y-1">
                            <h3 
                              className="px-4 text-[10px] font-bold tracking-wider"
                              style={{ color: currentTenant?.theme?.accent && currentTenant.theme.accent.startsWith('#') ? currentTenant.theme.accent : theme.subTextColor }}
                            >
                              {category}
                            </h3>
                            {items.map((item) => {
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
                                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                                    isActive
                                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                      : "hover:bg-opacity-10 hover:bg-gray-500"
                                  }`}
                                  style={{
                                    ...(isActive ? {
                                      backgroundColor: currentTenant?.theme?.secondary || '#2563eb',
                                      boxShadow: `0 4px 6px -1px ${currentTenant?.theme?.secondary}40`
                                    } : {
                                        color: theme.subTextColor
                                    })
                                  }}
                                >
                                  <Icon className="h-4 w-4" />
                                  <span className="text-sm font-medium">{item.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        ));
                    })()}
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
          </>
        )
      } />

      <Route path="/login" element={
        !isLoggedIn ? (
          <Login 
            onLogin={handleLogin} 
            onNavigateToScanner={() => navigate("/student-scanner")}
          />
        ) : (
          <Navigate to="/" replace />
        )
      } />

      {/* Barcode Scanner Route */}
      <Route path="/student-scanner" element={
        <div 
          className="min-h-screen"
          style={{ backgroundColor: currentTenant?.theme?.background || '#f9fafb' }}
        >
          <Toaster />
          <StudentScanner />
        </div>
      } />

      {/* Catch all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
