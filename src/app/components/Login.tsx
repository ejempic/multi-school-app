import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { GraduationCap } from "lucide-react";

interface LoginProps {
  onLogin: (role: "admin" | "teacher" | "parent", userData: any) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (role: "admin" | "teacher" | "parent") => {
    // Mock login - in a real app, this would validate credentials
    const mockUsers = {
      admin: {
        name: "Admin User",
        email: "admin@school.com",
        role: "admin",
      },
      teacher: {
        name: "John Smith",
        email: "john.smith@school.com",
        role: "teacher",
        subject: "Mathematics",
      },
      parent: {
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        role: "parent",
        children: ["Emma Watson", "Liam Johnson"],
      },
    };

    onLogin(role, mockUsers[role]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="h-12 w-12 text-blue-600" />
            <h1 className="text-3xl">School Portal</h1>
          </div>
          <p className="text-gray-600">Welcome back! Please login to continue.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Choose your role and enter your credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="admin" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="admin">Admin</TabsTrigger>
                <TabsTrigger value="teacher">Teacher</TabsTrigger>
                <TabsTrigger value="parent">Parent</TabsTrigger>
              </TabsList>

              <TabsContent value="admin" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@school.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  Demo: Use any email/password
                </p>
              </TabsContent>

              <TabsContent value="teacher" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="teacher-email">Email</Label>
                  <Input
                    id="teacher-email"
                    type="email"
                    placeholder="teacher@school.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  Demo: Use any email/password
                </p>
              </TabsContent>

              <TabsContent value="parent" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="parent-email">Email</Label>
                  <Input
                    id="parent-email"
                    type="email"
                    placeholder="parent@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  Demo: Use any email/password
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
