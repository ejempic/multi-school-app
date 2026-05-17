import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { GraduationCap, Users, BookOpen, Mail, PhoneCall } from "lucide-react";
import { tenants } from "../data/tenants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function LandingPage() {
  const schoolTenants = tenants.filter((tenant) => tenant.id !== "admin");

  const handleSchoolLogin = (subdomain: string) => {
    const port = window.location.port ? `:${window.location.port}` : "";
    const targetUrl = `${window.location.protocol}//${subdomain}.localhost${port}`;
    window.location.href = targetUrl;
  };

  const features = [
    {
      icon: Users,
      title: "Student and Staff Profiles",
      description: "Keep enrollment, class lists, and key information in one secure system.",
    },
    {
      icon: BookOpen,
      title: "Academic Tracking",
      description: "Manage grades, attendance, and student progress with clear records.",
    },
    {
      icon: GraduationCap,
      title: "Family Communication",
      description: "Share school updates with parents, students, and teachers quickly.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold tracking-tight">SchoolApp</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">Login to School Portal</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {schoolTenants.length > 0 ? (
                  schoolTenants.map((tenant) => (
                    <DropdownMenuItem
                      key={tenant.id}
                      onClick={() => handleSchoolLogin(tenant.subdomain)}
                    >
                      {tenant.name}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>No schools available</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <section className="bg-white px-4 py-16 lg:py-24">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="mb-5 text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
            Simple School Portal for Daily Operations
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600">
            Manage your school records, communicate with families, and access classroom tools from one place.
          </p>

          <div className="mx-auto mb-4 flex max-w-md items-center justify-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="lg" className="h-12 px-8">Login to School Portal</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                {schoolTenants.length > 0 ? (
                  schoolTenants.map((tenant) => (
                    <DropdownMenuItem
                      key={tenant.id}
                      onClick={() => handleSchoolLogin(tenant.subdomain)}
                    >
                      {tenant.name}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>No schools available</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button asChild variant="outline" size="lg" className="h-12 px-8">
              <a href="#contact">Contact</a>
            </Button>
          </div>
          {schoolTenants.length === 0 && (
            <p className="text-sm text-amber-700">No school domains are configured yet. Please contact support.</p>
          )}
        </div>
      </section>

      <section id="features" className="bg-slate-50 px-4 py-14">
        <div className="container mx-auto">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold">Built for School Teams</h2>
            <p className="mx-auto max-w-2xl text-slate-600">
              Focus on what matters most: student growth, teacher support, and smooth daily operations.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-sm">
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

      <section id="contact" className="bg-white px-4 py-14">
        <div className="container mx-auto max-w-3xl">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Contact</CardTitle>
              <CardDescription>
                Need access for your school domain or help with login? Reach out to our team.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span>support@schoolapp.local</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-blue-600" />
                <span>+63 900 000 0000</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="py-12 bg-slate-900 text-slate-200">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 SchoolApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
