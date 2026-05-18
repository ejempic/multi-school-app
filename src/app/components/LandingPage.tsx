import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { GraduationCap, Users, BookOpen, Mail, PhoneCall, Check, X } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { tenants } from "../data/tenants";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function LandingPage() {
  const schoolTenants = tenants.filter((tenant) => tenant.id !== "admin");
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolAddress: "",
    contactPerson: "",
    contactNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Define subscription plans with their features
  const subscriptionPlans = [
    {
      name: "Basic",
      description: "Perfect for small schools getting started",
      color: "blue",
      features: [
        "Student Database (SIS)",
        "Class Management",
        "Attendance Tracking",
        "Teacher Portal Login",
        "Parent Portal Login",
      ],
    },
    {
      name: "Pro",
      description: "Great for growing schools",
      color: "purple",
      popular: true,
      features: [
        "Student Database (SIS)",
        "Class Management",
        "Attendance Tracking",
        "Teacher Portal Login",
        "Parent Portal Login",
        "Student Portal Login",
        "Grading & Report Cards",
        "Communication Suite",
      ],
    },
    {
      name: "Enterprise",
      description: "Complete solution for established schools",
      color: "amber",
      features: [
        "Student Database (SIS)",
        "Class Management",
        "Attendance Tracking",
        "Teacher Portal Login",
        "Parent Portal Login",
        "Student Portal Login",
        "Grading & Report Cards",
        "Tuition & Billing",
        "Communication Suite",
        "Sick Leaves Management",
        "PACE Learning System",
        "Behavior Management (Merits/Demerits)",
        "ID Scanner",
        "Clinic Management",
        "Library Management",
        "Advanced Authentication",
      ],
    },
  ];

  // Get all unique features across plans
  const allFeatures = Array.from(
    new Set(subscriptionPlans.flatMap((plan) => plan.features))
  );

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
      blue: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
      },
      purple: {
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200",
      },
      amber: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
      },
    };
    return colorMap[color] || colorMap.blue;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
            <span className="text-xl font-bold tracking-tight">SchoolApp</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
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

      <section id="pricing" className="bg-white px-4 py-16">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold">Subscription Plans</h2>
            <p className="mx-auto max-w-2xl text-slate-600">
              Choose the perfect plan for your school. All plans include core features with additional capabilities as you scale.
            </p>
          </div>

          {/* Plans Overview Cards */}
          <div className="mb-12 grid gap-6 lg:grid-cols-3">
            {subscriptionPlans.map((plan, index) => {
              const colors = getColorClasses(plan.color);
              return (
                <Card
                  key={index}
                  className={`relative overflow-hidden border-2 transition-all ${
                    plan.popular
                      ? `${colors.border} ring-2 ring-offset-2 ring-${plan.color}-300`
                      : "border-slate-200"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className={plan.popular ? colors.bg : ""}>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="mb-6">
                      <div className={`text-sm font-medium ${colors.text}`}>
                        {plan.features.length} features included
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Choose Plan
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Detailed Features Comparison */}
          <div className="mt-16">
            <h3 className="mb-8 text-center text-2xl font-bold">Feature Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-300">
                    <th className="text-left py-4 px-4 font-bold text-slate-900 w-1/4">
                      Feature
                    </th>
                    {subscriptionPlans.map((plan) => (
                      <th
                        key={plan.name}
                        className="text-center py-4 px-4 font-bold text-slate-900"
                      >
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allFeatures.map((feature, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-slate-200 ${
                        idx % 2 === 0 ? "bg-slate-50" : "bg-white"
                      }`}
                    >
                      <td className="py-4 px-4 text-sm font-medium text-slate-900">
                        {feature}
                      </td>
                      {subscriptionPlans.map((plan) => (
                        <td
                          key={`${plan.name}-${feature}`}
                          className="text-center py-4 px-4"
                        >
                          {plan.features.includes(feature) ? (
                            <Check className="h-5 w-5 text-green-600 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-slate-300 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
            <div className="max-w-2xl mx-auto">
              <h3 className="mb-3 text-2xl font-bold text-white text-center">Ready to Get in Touch?</h3>
              <p className="mb-8 text-blue-100 text-center">
                Contact us to discuss your school's needs and explore which plan is right for you.
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
          <p>&copy; 2026 SchoolApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
