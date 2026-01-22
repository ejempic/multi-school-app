import { useState, useRef, useEffect, createElement } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Barcode, Check, LogOut, Lock, User, ChevronDown, Settings, BookOpen, Award, Zap, Star, Heart, GraduationCap, Lightbulb, ArrowLeft } from "lucide-react";
import { showSuccessToast, showErrorToast } from "../utils/toastNotification";
import { useTenant } from "../contexts/TenantContext";

interface StudentCheckIn {
  studentId: string;
  studentName: string;
  className: string;
  checkInTime: string;
  checkOutTime: string | null;
  status: "CheckedIn" | "CheckedOut";
}

export function StudentScanner() {
  console.log("StudentScanner mounted");
  const navigate = useNavigate();
  const { currentTenant } = useTenant();
  const [authStep, setAuthStep] = useState<"login" | "scanner">("scanner");
  const [schoolId, setSchoolId] = useState("");
  const [password, setPassword] = useState("");
  const [idInput, setIdInput] = useState("");
  const [authenticatedSchoolId, setAuthenticatedSchoolId] = useState(currentTenant?.id.toUpperCase() || "SCHOOL");

  // Mock students with IDs
  const students = [
    { id: "STU001", name: "Emma Watson", className: "Grade 12 A" },
    { id: "STU002", name: "Liam Johnson", className: "Grade 11 A" },
    { id: "STU003", name: "Olivia Brown", className: "Grade 10" },
    { id: "STU004", name: "Noah Davis", className: "Grade 12 B" },
    { id: "STU005", name: "Ava Wilson", className: "Grade 11 B" },
    { id: "STU006", name: "Ethan Martinez", className: "Grade 10" },
    { id: "STU007", name: "Sophia Garcia", className: "Grade 12 A" },
    { id: "STU008", name: "Mason Lee", className: "Grade 11 A" },
  ];

  // Mock school login credentials with school names and colors
  const validCredentials = [
    { schoolId: currentTenant?.id.toUpperCase() || "SCHOOL", password: "School@2026", schoolName: currentTenant?.name || "School Name", defaultColor: "from-blue-500 to-blue-700" },
    { schoolId: "SCHOOL001", password: "Scanner@2024", schoolName: "Central High School", defaultColor: "from-blue-500 to-blue-700" },
    { schoolId: "SCHOOL002", password: "Access@2024", schoolName: "Riverside Academy", defaultColor: "from-purple-500 to-purple-700" },
  ];

  const colorOptions = [
    { name: "Blue", value: "from-blue-500 to-blue-700" },
    { name: "Purple", value: "from-purple-500 to-purple-700" },
    { name: "Green", value: "from-green-500 to-green-700" },
    { name: "Red", value: "from-red-500 to-red-700" },
    { name: "Pink", value: "from-pink-500 to-pink-700" },
    { name: "Indigo", value: "from-indigo-500 to-indigo-700" },
    { name: "Cyan", value: "from-cyan-500 to-cyan-700" },
    { name: "Amber", value: "from-amber-500 to-amber-700" },
  ];

  const logoOptions = [
    { name: "Book", icon: BookOpen },
    { name: "Award", icon: Award },
    { name: "Zap", icon: Zap },
    { name: "Star", icon: Star },
    { name: "Heart", icon: Heart },
    { name: "Graduation", icon: GraduationCap },
    { name: "Lightbulb", icon: Lightbulb },
    { name: "Barcode", icon: Barcode },
  ];

  const [todayCheckIns, setTodayCheckIns] = useState<StudentCheckIn[]>([]);
  const [lastScannedStudent, setLastScannedStudent] = useState<{name: string, status: "in" | "out"} | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [schoolName, setSchoolName] = useState("Global Two Wings Foundation School of Legazpi");
  const [schoolColor, setSchoolColor] = useState("from-blue-500 to-blue-700");
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedLogo, setSelectedLogo] = useState<typeof BookOpen>(BookOpen);
  const [colorOpacity, setColorOpacity] = useState(100);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-focus input every 5 seconds when on scanner screen
  useEffect(() => {
    const autoFocusTimer = setInterval(() => {
      if (authStep === "scanner") {
        inputRef.current?.focus();
      }
    }, 5000);

    return () => clearInterval(autoFocusTimer);
  }, [authStep]);

  // Capture all keyboard input and redirect to input field
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (authStep === "scanner") {
        // Don't intercept special keys like Tab, Escape, etc.
        if (e.key === "Tab" || e.key === "Escape" || e.ctrlKey || e.altKey) {
          return;
        }
        
        // Focus input and let the key event propagate
        if (inputRef.current && document.activeElement !== inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [authStep]);

  const handleLogin = () => {
    if (!schoolId.trim() || !password.trim()) {
      showErrorToast("Missing credentials", "Please enter school ID and password");
      return;
    }

    const credential = validCredentials.find(
      cred => cred.schoolId === schoolId && cred.password === password
    );

    if (credential) {
      setAuthenticatedSchoolId(schoolId);
      setSchoolName(credential.schoolName);
      setSchoolColor(credential.defaultColor);
      setAuthStep("scanner");
      setSchoolId("");
      setPassword("");
      showSuccessToast("✓ Authentication successful", "Scanner ready");
      setIdInput("");
      
      // Auto-focus input after login
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      showErrorToast("Authentication failed", "Invalid school ID or password");
    }
  };

  const handleIdScan = () => {
    if (!idInput.trim()) {
      return;
    }

    const student = students.find(s => s.id.toLowerCase() === idInput.toLowerCase());
    if (!student) {
      showErrorToast("Student Not Found", `No student found with ID: ${idInput}`);
      setIdInput("");
      return;
    }

    const existingCheckIn = todayCheckIns.find(ci => ci.studentId === student.id);

    if (existingCheckIn) {
      // Check-out
      const now = new Date();
      const timeString = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

      setTodayCheckIns(todayCheckIns.map(ci =>
        ci.studentId === student.id
          ? { ...ci, status: "CheckedOut", checkOutTime: timeString }
          : ci
      ));
      setLastScannedStudent({ name: student.name, status: "out" });
      showSuccessToast(`✓ Check-out`, `${student.name}`);
    } else {
      // Check-in
      const now = new Date();
      const timeString = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

      setTodayCheckIns([...todayCheckIns, {
        studentId: student.id,
        studentName: student.name,
        className: student.className,
        checkInTime: timeString,
        checkOutTime: null,
        status: "CheckedIn"
      }]);

      setLastScannedStudent({ name: student.name, status: "in" });
      showSuccessToast(`✓ Check-in`, `${student.name}`);
    }

    setIdInput("");
    // Keep focus on input for next scan
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleLogout = () => {
    setAuthStep("login");
    setAuthenticatedSchoolId("");
    setSchoolName("");
    setSchoolColor("from-blue-500 to-blue-700");
    setTodayCheckIns([]);
    setIdInput("");
    setLastScannedStudent(null);
    showSuccessToast("✓ Logged out", "Session closed");
  };

  if (authStep === "login") {
    return (
      <div 
        className={`min-h-screen flex items-center justify-center p-4 ${!currentTenant?.theme?.background ? 'bg-gradient-to-br from-blue-600 to-blue-900' : ''}`}
        style={{ backgroundColor: currentTenant?.theme?.background ? currentTenant.theme.background : undefined }}
      >
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="bg-blue-50 border-b flex flex-col items-center pt-6 pb-6">
            {currentTenant?.logo && <img src={currentTenant.logo} alt="School Logo" className="h-24 w-24 object-contain mb-3" />}
            <div className="text-center">
              <h1 className="text-lg font-bold text-blue-900 leading-tight">{currentTenant?.name || "School Scanner"}</h1>
             {/* <h2 className="text-base font-medium text-blue-700">School of Legazpi</h2> */}
            </div>
            <CardTitle className="mt-4 text-gray-700 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Barcode className="h-4 w-4" />
              Student Scanner Portal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-4">Authenticate to access scanner</p>
            </div>

            <div>
              <Label htmlFor="school-id" className="text-sm font-semibold">School ID</Label>
              <Input
                id="school-id"
                placeholder="Enter school ID"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                className="mt-2"
                autoFocus
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                className="mt-2"
              />
            </div>

            <Button 
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              size="lg"
            >
              <Lock className="h-4 w-4 mr-2" />
              Login
            </Button>

            <div className="bg-gray-50 p-3 rounded-lg border text-xs">
              <p className="text-gray-600 mb-1 font-semibold">Demo:</p>
              <p className="text-gray-600">ID: <span className="font-mono">{currentTenant?.id.toUpperCase() || "SCHOOL"}</span></p>
              <p className="text-gray-600">PW: <span className="font-mono">School@2026</span></p>
            </div>

            <Button 
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full text-gray-700"
              size="sm"
            >
              Back to Main Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const checkedInCount = todayCheckIns.filter(ci => ci.status === "CheckedIn").length;

  // Get base colors for the selected gradient
  const getBackgroundStyle = () => {
    // Priority: Global Theme Background
    if (currentTenant?.theme?.background) {
        return { backgroundColor: currentTenant.theme.background };
    }

    const colorMap: { [key: string]: [string, string] } = {
      "from-blue-500 to-blue-700": ["59, 130, 246", "29, 78, 216"],
      "from-purple-500 to-purple-700": ["168, 85, 247", "109, 40, 217"],
      "from-green-500 to-green-700": ["34, 197, 94", "21, 128, 61"],
      "from-red-500 to-red-700": ["239, 68, 68", "185, 28, 28"],
      "from-pink-500 to-pink-700": ["236, 72, 153", "190, 24, 93"],
      "from-indigo-500 to-indigo-700": ["99, 102, 241", "67, 56, 202"],
      "from-cyan-500 to-cyan-700": ["34, 211, 238", "6, 182, 212"],
      "from-amber-500 to-amber-700": ["245, 158, 11", "180, 83, 9"],
    };
    
    const [color1, color2] = colorMap[schoolColor] || colorMap["from-blue-500 to-blue-700"];
    const opacity = colorOpacity / 100;
    
    return {
      background: `linear-gradient(to bottom right, rgba(${color1}, ${opacity}), rgba(${color2}, ${opacity}))`
    };
  };

  return (
    <div className="min-h-screen" style={getBackgroundStyle()}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentTenant?.logo && <img src={currentTenant.logo} alt="School Logo" className="h-12 w-12 object-contain" />}
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">{currentTenant?.name || schoolName}</h1>
              {/* <h2 className="text-sm sm:text-base font-medium text-blue-600">School of Legazpi</h2> */}
            </div>
          </div>
          
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <ChevronDown className="h-4 w-4" />
                <span className="hidden sm:inline">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                onClick={() => setShowSettingsDialog(true)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="flex items-center gap-2 cursor-pointer text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-700" />
              <DialogTitle>Scanner Settings</DialogTitle>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-6 py-4 px-4">
            
            {/* Logo Selection removed - using hardcoded image */}

            {/* Color Selection */}
            <div>
              <Label className="text-sm font-semibold mb-3 block">School Theme Color</Label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSchoolColor(color.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      schoolColor === color.value
                        ? "border-gray-900 ring-2 ring-offset-1"
                        : "border-gray-200"
                    }`}
                    title={color.name}
                  >
                    <div className={`bg-gradient-to-br ${color.value} h-6 w-full rounded`} />
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Selected: <span className="font-semibold">{colorOptions.find(c => c.value === schoolColor)?.name}</span></p>
            </div>

            {/* Color Opacity */}
            <div>
              <Label className="text-sm font-semibold mb-3 block">Background Opacity</Label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={colorOpacity}
                  onChange={(e) => setColorOpacity(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-700"
                />
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Opacity:</span>
                  <span className="font-semibold text-gray-900">{colorOpacity}%</span>
                </div>
              </div>
            </div>

          </div>
          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-[calc(100vh-200px)]">
          
          {/* Left Sidebar - History (Hidden on mobile, visible on lg) */}
          <div className="hidden lg:block lg:col-span-1">
            <Card className="h-full flex flex-col bg-white">
              <CardHeader className="border-b pb-3">
                <CardTitle className="text-sm font-semibold">History</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-3 space-y-2">
                {todayCheckIns.length > 0 ? (
                  todayCheckIns.reverse().map((checkIn, idx) => (
                    <div 
                      key={idx} 
                      className={`p-2 rounded-lg text-xs border ${
                        checkIn.status === "CheckedIn"
                          ? "bg-green-50 border-green-200"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <p className="font-semibold text-gray-900">{checkIn.studentName}</p>
                      <p className="text-gray-600">{checkIn.studentId}</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-gray-700">{checkIn.checkInTime}</span>
                        {checkIn.checkOutTime && (
                          <span className="text-gray-700">{checkIn.checkOutTime}</span>
                        )}
                      </div>
                      <Badge className={`mt-1 text-xs ${
                        checkIn.status === "CheckedIn"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {checkIn.status === "CheckedIn" ? "In" : "Out"}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-xs">No history yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Main Area - Scanner */}
          <div className="lg:col-span-3 flex flex-col">
            <Card className="flex-1 border-2 border-blue-400 bg-white shadow-lg">
              <CardContent className="p-6 h-full flex flex-col items-center justify-center">
                
                {/* Date and Time Display */}
                <div className="mb-10 text-center">
                  <p className="text-4xl sm:text-5xl font-bold text-gray-900">
                    {currentTime.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true 
                    })}
                  </p>
                  <p className="text-lg sm:text-xl text-gray-600 mt-2">
                    {currentTime.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long',
                      day: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                {/* Face/Avatar Display */}
                <div className="mb-8">
                  {lastScannedStudent ? (
                    <div className="flex flex-col items-center">
                      <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-4 ${
                        lastScannedStudent.status === "in" 
                          ? "bg-green-100 border-4 border-green-500" 
                          : "bg-blue-100 border-4 border-blue-500"
                      }`}>
                        <User className={`w-10 h-10 sm:w-12 sm:h-12 ${
                          lastScannedStudent.status === "in" 
                            ? "text-green-600" 
                            : "text-blue-600"
                        }`} />
                      </div>
                      <p className="text-lg sm:text-xl font-semibold text-gray-900 text-center">{lastScannedStudent.name}</p>
                      <Badge className={`mt-2 ${
                        lastScannedStudent.status === "in"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {lastScannedStudent.status === "in" ? "✓ Checked In" : "Checked Out"}
                      </Badge>
                    </div>
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 border-4 border-gray-300 flex items-center justify-center mb-4">
                      <Barcode className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Scanner Input */}
                <div className="w-full max-w-sm">
                  <Input
                    ref={inputRef}
                    placeholder="Scan Student ID"
                    value={idInput}
                    onChange={(e) => setIdInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleIdScan()}
                    autoFocus
                    className="text-center text-lg font-semibold py-3 border-2 h-12 sm:h-14"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Mobile History - Bottom */}
            <div className="lg:hidden mt-4">
              <Card className="bg-white">
                <CardHeader className="border-b pb-3">
                  <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {todayCheckIns.length > 0 ? (
                      todayCheckIns.reverse().slice(0, 5).map((checkIn, idx) => (
                        <div 
                          key={idx} 
                          className={`p-2 rounded-lg text-xs border flex justify-between items-center ${
                            checkIn.status === "CheckedIn"
                              ? "bg-green-50 border-green-200"
                              : "bg-blue-50 border-blue-200"
                          }`}
                        >
                          <div>
                            <p className="font-semibold text-gray-900">{checkIn.studentName}</p>
                            <p className="text-gray-600">{checkIn.checkInTime}</p>
                          </div>
                          <Badge className={`text-xs ${
                            checkIn.status === "CheckedIn"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {checkIn.status === "CheckedIn" ? "In" : "Out"}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-400 py-4 text-xs">No activity yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
