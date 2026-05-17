import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { GraduationCap, Users, BookOpen, Layers } from "lucide-react";
import { tenants } from "../data/tenants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function LandingPage() {
  const features = [
    {
      icon: Layers,
      title: "Multi-Tenant Architecture",
      description: "Secure, isolated environments for each school with custom subdomains and branding.",
    },
    {
      icon: Users,
      title: "Student & Staff Management",
      description: "Comprehensive profiles, attendance tracking, and performance monitoring.",
    },
    {
      icon: BookOpen,
      title: "Academic Excellence",
      description: "Manage grades, curriculums, and PACE progress efficiently.",
    },
    {
      icon: GraduationCap,
      title: "Parent Portal",
      description: "Keep parents informed with real-time updates on their child's progress.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl tracking-tight">SchoolApp Platform</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">Login to School Portal</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {tenants.filter((tenant) => tenant.id !== "admin").map((tenant) => (
                  <DropdownMenuItem 
                    key={tenant.id}
                    onClick={() => window.location.href = `http://${tenant.subdomain}.localhost:5173`}
                  >
                    {tenant.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm">Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 px-4 bg-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
            The Modern Operating System for <span className="text-blue-600">Educational Institutions</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Streamline administration, enhance learning, and connect your entire school community with one powerful platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-12 px-8 text-lg">Request a Demo</Button>
            <Button variant="outline" size="lg" className="h-12 px-8 text-lg">View Features</Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to run your school</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our platform is built with the needs of administrators, teachers, parents, and students in mind.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-md">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-slate-200">
        <div className="container mx-auto px-4 text-center">
            <p>&copy; 2026 SchoolApp Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
