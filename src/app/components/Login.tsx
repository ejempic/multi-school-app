import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { GraduationCap, Barcode } from "lucide-react";
import { useTenant } from "../contexts/TenantContext";

interface LoginProps {
  onLogin: (role: "admin" | "teacher" | "parent" | "student" | "nurse" | "librarian", userData: any) => void;
  onNavigateToScanner?: () => void;
}

export function Login({ onLogin, onNavigateToScanner }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { currentTenant } = useTenant();

  const handleLogin = (role: "admin" | "teacher" | "parent" | "student" | "nurse" | "librarian") => {
    // Mock login - in a real app, this would validate credentials
    const mockUsers = {
      admin: {
        name: "Admin User",
        username: "admin",
        role: "admin",
      },
      teacher: {
        name: "John Smith",
        username: "teacher",
        role: "teacher",
        subject: "Mathematics",
      },
      parent: {
        name: "Sarah Johnson",
        username: "parent",
        role: "parent",
        children: ["Emma Watson", "Liam Johnson"],
      },
      student: {
        name: "Russell Joshua R. Empic",
        username: "student",
        role: "student",
        grade: "Grade 3",
      },
      nurse: {
        name: "Nurse Joy",
        username: "nurse",
        role: "nurse",
      },
      librarian: {
        name: "Madam Pinta",
        username: "librarian",
        role: "librarian",
      },
    };

    onLogin(role, mockUsers[role]);
  };

  useEffect(() => {
    // Check for autofill or autologin param
    const params = new URLSearchParams(window.location.search);
    const autofill = params.get("autofill");
    const autologin = params.get("autologin");
    
    if (autologin === "true") {
       handleLogin("admin");
    } else if (autofill === "admin") {
       setUsername("admin");
       // Optional: could auto-focus password field here
    }
  }, []);

  return (
    <div 
      className={`min-h-screen flex items-center justify-center p-4 ${!currentTenant?.theme?.background ? 'bg-gradient-to-br from-blue-50 to-indigo-100' : ''}`}
      style={{ backgroundColor: currentTenant?.theme?.background ? currentTenant.theme.background : undefined }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center justify-center gap-4 mb-4">
            {currentTenant?.logo ? (
              <img src={currentTenant.logo} alt="Logo" className="h-32 w-32 object-contain drop-shadow-md" />
            ) : (
               currentTenant?.id === 'admin' && <div className="h-20 w-20 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-3xl">SA</div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-blue-900 leading-tight">{currentTenant?.name || "Global Two Wings Foundation"}</h1>
              <p className="text-xs font-bold text-blue-500 mt-1 uppercase tracking-widest">
                {currentTenant?.id === 'admin' ? 'SYSTEM ADMINISTRATION' : (currentTenant?.id.toUpperCase() || "SCHOOL PORTAL")}
              </p>
            </div>
          </div>
          <p className="text-gray-600">Welcome back! Please login to continue.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>{currentTenant ? `Sign in to ${currentTenant.name}` : "Sign in to your account"}</CardDescription>
          </CardHeader>
          <CardContent>
            {!currentTenant && (
                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md mb-4 text-sm border border-yellow-200">
                    Warning: You are accessing this page without a specific school subdomain. Defaulting to system view or a specific school may apply.
                </div>
            )}

            <Tabs defaultValue="admin" className="w-full">
              {currentTenant?.id === 'admin' ? (
                <TabsList className="grid w-full grid-cols-1">
                   <TabsTrigger value="admin">Platform Administrator</TabsTrigger>
                </TabsList>
              ) : (
                <TabsList className="flex flex-wrap h-auto gap-1">
                    <TabsTrigger value="admin" className="flex-1">Admin</TabsTrigger>
                    <TabsTrigger value="teacher" className="flex-1">Teacher</TabsTrigger>
                    <TabsTrigger value="parent" className="flex-1">Parent</TabsTrigger>
                    <TabsTrigger value="student" className="flex-1">Student</TabsTrigger>
                    {currentTenant?.features?.includes("Clinic Management") && (
                        <TabsTrigger value="nurse" className="flex-1">Clinic</TabsTrigger>
                    )}
                    {currentTenant?.features?.includes("Library Management") && (
                        <TabsTrigger value="librarian" className="flex-1">Library</TabsTrigger>
                    )}
                </TabsList>
              )}

              <TabsContent value="admin" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="admin-username">Username</Label>
                  <Input
                    id="admin-username"
                    type="text"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <Button className="w-full" onClick={() => handleLogin("admin")}>
                  Login as Admin
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Demo: Use any username/password
                </p>
              </TabsContent>

              <TabsContent value="teacher" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="teacher-username">Username</Label>
                  <Input
                    id="teacher-username"
                    type="text"
                    placeholder="teacher"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="teacher-password">Password</Label>
                  <Input
                    id="teacher-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={() => handleLogin("teacher")}>
                  Login as Teacher
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Demo: Use any username/password
                </p>
              </TabsContent>

              <TabsContent value="parent" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="parent-username">Username</Label>
                  <Input
                    id="parent-username"
                    type="text"
                    placeholder="parent"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="parent-password">Password</Label>
                  <Input
                    id="parent-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={() => handleLogin("parent")}>
                  Login as Parent
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Demo: Use any username/password
                </p>
              </TabsContent>

              <TabsContent value="student" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="student-username">Username</Label>
                  <Input
                    id="student-username"
                    type="text"
                    placeholder="student"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="student-password">Password</Label>
                  <Input
                    id="student-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={() => handleLogin("student")}>
                  Login as Student
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Demo: Use any username/password
                </p>
              </TabsContent>
              <TabsContent value="nurse" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="nurse-username">Username</Label>
                  <Input
                    id="nurse-username"
                    type="text"
                    placeholder="nurse"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="nurse-password">Password</Label>
                  <Input
                    id="nurse-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={() => handleLogin("nurse")}>
                  Login as Clinic Nurse
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Demo: Use any username/password
                </p>
              </TabsContent>

              <TabsContent value="librarian" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="librarian-username">Username</Label>
                  <Input
                    id="librarian-username"
                    type="text"
                    placeholder="librarian"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="librarian-password">Password</Label>
                  <Input
                    id="librarian-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={() => handleLogin("librarian")}>
                  Login as Librarian
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Demo: Use any username/password
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6 pt-6 border-t border-gray-300">
          <p className="text-sm text-gray-600 mb-3">Need to check in students?</p>
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => onNavigateToScanner && onNavigateToScanner()}
          >
            <Barcode className="h-4 w-4 mr-2" />
            Go to Student ID Scanner
          </Button>
        </div>
      </div>
    </div>
  );
}
