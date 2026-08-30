import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { GraduationCap, Users, BookOpen, Mail, PhoneCall, ClipboardList, Receipt } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { tenants } from "@/app/data/tenants";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

export function LandingPage() {
  const schoolTenants = tenants.filter((tenant) => tenant.id !== "admin");
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolAddress: "",
    contactPerson: "",
    contactNumber: "",
    numberOfStudents: "",
    hasExistingSystem: "",
    referrer: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSchoolLogin = (subdomain: string) => {
    const { protocol, hostname, port } = window.location;
    const isLocalhost = hostname === "localhost";
    const isLocalDevHost = isLocalhost || hostname === "127.0.0.1";

    if (isLocalDevHost) {
      window.location.href = `/?tenant=${subdomain}`;
      return;
    }

    const rootDomain = isLocalhost
      ? "localhost"
      : hostname.split(".").slice(-2).join(".");
    const targetHost = `${subdomain}.${rootDomain}`;
    const targetUrl = `${protocol}//${targetHost}${port ? `:${port}` : ""}`;
    window.location.href = targetUrl;
  };

  const features = [
    {
      icon: Users,
      title: "Student & Staff Profiles",
      description: "Centralize all student and staff data in one secure location.",
      longDescription: "Manage enrollments, class assignments, contact information, and medical records with role-based access controls. Never lose track of important student details again.",
      image: "/feature-images/student_staff.jpg",
    },
    {
      icon: BookOpen,
      title: "Class & Subject Management",
      description: "Easily organize classes, subjects, and schedules.",
      longDescription: "Assign teachers, manage class lists, and set up subject schedules with just a few clicks. Simplify classroom logistics and ensure every student is in the right place.",
      image: "/feature-images/class_subject.jpg",
    },
    {
      icon: BookOpen,
      title: "Academic Tracking",
      description: "Monitor grades, attendance, and student progress in real-time.",
      longDescription: "Generate progress reports automatically, identify at-risk students early, and provide data-driven insights for intervention. Keep parents informed with transparent grading systems.",
      image: "/feature-images/academic.jpg",
    },
    {
      icon: GraduationCap,
      title: "Family Communication",
      description: "Bridge the gap between school and home with instant messaging and announcements.",
      longDescription: "Send personalized updates to parents, share important dates, emergency alerts, and celebrate student achievements. Keep everyone connected and informed.",
      image: "/feature-images/family.jpg",
    },
    {
      icon: BookOpen,
      title: "Attendance & ID Scanning",
      description: "Track student attendance with digital logs and ID scanning.",
      longDescription: "Automate attendance tracking for students only. Use ID scanners for quick student check-in and check-out, reducing manual errors and saving time.",
      image: "/feature-images/attendance.jpg",
    },
    {
      icon: BookOpen,
      title: "Grading & Report Cards",
      description: "Automate grading and generate report cards instantly.",
      longDescription: "Teachers can enter grades online, and the system calculates averages, ranks, and generates printable report cards for each term.",
      image: "/feature-images/grades.jpg",
    },
    {
      icon: BookOpen,
      title: "Tuition & Billing",
      description: "Manage tuition payments and billing records with ease.",
      longDescription: "Track student payments, generate invoices, and send reminders for outstanding balances. Simplify financial management for your school and parents.",
      image: "/feature-images/tuition.jpg",
    },
    {
      icon: ClipboardList,
      title: "Registrar Management",
      description: "Handle enrollment records, student documents, and academic requests in one place.",
      longDescription: "Support registrar workflows such as enrollment validation, section placement, credential review, student records maintenance, and school document requests without relying on scattered spreadsheets.",
      image: "/feature-images/student_staff.jpg",
    },
    {
      icon: Receipt,
      title: "Cashier Management",
      description: "Track collections, payment history, and school-issued billing with better control.",
      longDescription: "Give cashiers a clear workspace for receivables, payment posting, invoice handling, and daily transaction monitoring so finance operations stay organized and auditable.",
      image: "/feature-images/tuition.jpg",
    },
    {
      icon: BookOpen,
      title: "Library & Clinic Management",
      description: "Digitize library checkouts and clinic visits.",
      longDescription: "Manage book inventories, track student loans, and log clinic visits for health monitoring. Keep all resources organized and accessible.",
      image: "/feature-images/library.jpg",
    },
    {
      icon: BookOpen,
      title: "Behavior & Merit Tracking",
      description: "Track merits, demerits, and student behavior trends.",
      longDescription: "Log positive and negative behaviors, reward students, and generate reports for parent-teacher conferences.",
      image: "/feature-images/behaviour.jpg",
    },
    {
      icon: BookOpen,
      title: "PACE Learning System",
      description: "Support individualized learning with PACE modules.",
      longDescription: "Assign, track, and assess PACE modules for students, supporting mastery-based education and personalized learning paths.",
      image: "/feature-images/pace.jpg",
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Implement form submission logic (e.g., send to backend or email service)
    console.log("Form submitted:", formData);
    // Simulate submission delay
    setTimeout(() => {
      alert("Thank you for your interest! We'll be in touch soon.");
      setFormData({
        schoolName: "",
        schoolAddress: "",
        contactPerson: "",
        contactNumber: "",
        numberOfStudents: "",
        hasExistingSystem: "",
        referrer: "",
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold tracking-tight">Eskuwela</span>
          </div>
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
                <Button size="lg">Login to School Portal</Button>
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
          </div>
          {schoolTenants.length === 0 && (
            <p className="text-sm text-amber-700">No school domains are configured yet. Please contact support.</p>
          )}
        </div>
      </section>

      <section id="features" className="bg-slate-50 px-4 py-14">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold">Designed for End-to-End School Operations</h2>
            <p className="mx-auto max-w-2xl text-slate-600">
              Run academics, student services, registrar work, cashier operations, and parent communication from one connected platform.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 w-full overflow-hidden bg-slate-200">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardDescription className="text-base font-medium text-slate-700">
                    {feature.description}
                  </CardDescription>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feature.longDescription}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-white px-4 py-16">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold">Simple Pricing</h2>
            <p className="mx-auto max-w-2xl text-slate-600">
              We are focusing on straightforward pricing based on active student count, starting at PHP 40 per student.
            </p>
          </div>

          <Card className="mx-auto max-w-5xl overflow-hidden border-none shadow-lg">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="bg-slate-950 px-8 py-10 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-200">Starting Rate</p>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-5xl font-black leading-none">PHP 40</span>
                  <span className="pb-1 text-lg font-medium text-slate-300">per student</span>
                </div>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
                  Pricing starts at PHP 40 per active student, giving schools a straightforward way to estimate cost as enrollment grows.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "Student information system",
                    "Academic and attendance tools",
                    "Registrar and cashier workflows",
                    "Parent communication",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-medium text-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 px-8 py-10">
                <h3 className="text-2xl font-bold text-slate-900">What this means for your school</h3>
                <div className="mt-6 grid gap-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-semibold text-slate-900">Simple to estimate</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Multiply your active student count by PHP 40 to get your starting monthly baseline.
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-semibold text-slate-900">Built for growing schools</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      The model scales naturally as your enrollment changes, without forcing schools into artificial plan tiers.
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-semibold text-slate-900">Implementation depends on scope</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Final pricing can still vary based on setup, rollout needs, and any school-specific customization.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Call to Action */}
          <div className="mt-16 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
            <div className="max-w-2xl mx-auto">
              <h3 className="mb-3 text-2xl font-bold text-white text-center">Ready to Get in Touch?</h3>
              <p className="mb-8 text-blue-100 text-center">
                Contact us to discuss your school's needs and estimate pricing based on your student count.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName" className="text-slate-900">School Name *</Label>
                    <Input
                      id="schoolName"
                      name="schoolName"
                      placeholder="Enter your school name"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPerson" className="text-slate-900">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      name="contactPerson"
                      placeholder="Enter your name"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      required
                      className="border-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schoolAddress" className="text-slate-900">School Address *</Label>
                  <Textarea
                    id="schoolAddress"
                    name="schoolAddress"
                    placeholder="Enter your school's complete address"
                    value={formData.schoolAddress}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="border-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber" className="text-slate-900">Contact Number *</Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    placeholder="Enter your contact number"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    required
                    className="border-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfStudents" className="text-slate-900">Number of Students *</Label>
                  <Input
                    id="numberOfStudents"
                    name="numberOfStudents"
                    type="number"
                    placeholder="Enter number of students"
                    value={formData.numberOfStudents}
                    onChange={handleInputChange}
                    required
                    className="border-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hasExistingSystem" className="text-slate-900">Do you have an existing system? *</Label>
                  <select
                    id="hasExistingSystem"
                    name="hasExistingSystem"
                    value={formData.hasExistingSystem}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white"
                  >
                    <option value="">Select an option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  <p className="text-xs text-slate-600 mt-1">
                    We can easily migrate from any system if you authenticate us to view its reports.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referrer" className="text-slate-900">Referrer / Discount Code</Label>
                  <Input
                    id="referrer"
                    name="referrer"
                    placeholder="Enter referral or discount code (optional)"
                    value={formData.referrer}
                    onChange={handleInputChange}
                    className="border-slate-300"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-slate-900 text-slate-200">
        <div className="container mx-auto px-4 text-center">
              <p>&copy; 2026 Eskuwela. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
