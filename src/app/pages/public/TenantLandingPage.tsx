import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import {
  GraduationCap,
  ShieldCheck,
  Users,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock3,
  Sparkles,
  BadgeInfo,
  BookOpen,
  CircleCheckBig,
} from "lucide-react";
import { Tenant } from "@/app/data/tenants";

interface TenantLandingPageProps {
  tenant: Tenant;
  onLogin: () => void;
}

export function TenantLandingPage({ tenant, onLogin }: TenantLandingPageProps) {
  const primary = tenant.theme?.primary || "#1e3a8a";
  const secondary = tenant.theme?.secondary || "#1d4ed8";
  const accent = tenant.theme?.accent || "#0ea5e9";
  const background = tenant.theme?.background || "#f8fafc";
  const heroStats = tenant.heroStats || [
    { label: "School Year", value: tenant.currentSchoolYear || "Open for inquiries" },
    { label: "Location", value: tenant.address || "Available on request" },
    { label: "Portal", value: "School portal ready" },
  ];
  const highlights = tenant.highlights || [
    "School information and contact details",
    "Login access for staff, parents, and students",
    "Announcements, grades, attendance, and updates",
  ];
  const schoolLevels = tenant.schoolLevels || ["Pre-K", "Elementary", "Secondary"];

  return (
    <div className="min-h-screen" style={{ backgroundColor: background }}>
      <header className="border-b bg-white/90 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {tenant.logo ? (
              <img src={tenant.logo} alt={`${tenant.name} logo`} className="h-10 w-10 object-contain" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-900 text-sm font-bold text-white">SC</div>
            )}
            <div className="leading-tight">
              <p className="text-sm font-bold" style={{ color: primary }}>{tenant.name}</p>
              <p className="text-xs text-slate-500">{tenant.tagline || "School domain"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <a href="#contact">Contact</a>
            </Button>
            <Button onClick={onLogin} className="gap-2" style={{ backgroundColor: secondary }}>
              Login
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 lg:py-16">
        <section className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm">
              <Sparkles className="h-4 w-4" style={{ color: primary }} />
              {tenant.currentSchoolYear || "Current School Year"}
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-950 lg:text-6xl">
              Welcome to {tenant.name}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              {tenant.about || "A dedicated school homepage with the latest information, school contacts, and portal access."}
            </p>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              {tenant.mission || "We help schools present a clear public homepage while keeping portals and operations in one place."}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={onLogin} style={{ backgroundColor: secondary }}>
                Proceed to Login
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#about">Explore School Info</a>
              </Button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <Card key={stat.label} className="border-none bg-white/90 shadow-sm">
                  <CardContent className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{stat.label}</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="border-none bg-white/95 shadow-lg">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <BadgeInfo className="h-4 w-4" style={{ color: primary }} />
                School Snapshot
              </div>
              <CardTitle className="text-2xl">{tenant.address || "School details"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 flex-none" style={{ color: primary }} />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Address</p>
                    <p className="text-sm text-slate-600">{tenant.address || "No address configured yet"}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 flex-none" style={{ color: primary }} />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Phone</p>
                      <p className="text-sm text-slate-600">{tenant.phone || "No phone listed"}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 flex-none" style={{ color: primary }} />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Email</p>
                      <p className="text-sm text-slate-600">{tenant.email || "No email listed"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-5 w-5 flex-none" style={{ color: primary }} />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Office hours</p>
                    <p className="text-sm text-slate-600">{tenant.officeHours || "Weekdays during school hours"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="about" className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BookOpen className="h-5 w-5" style={{ color: primary }} />
                About {tenant.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-slate-600">
              <p>{tenant.about}</p>
              <p>
                This homepage is designed to act as a public school front door, while the login area handles
                attendance, grades, announcements, and role-based access for your school community.
              </p>
              {tenant.website && (
                <p className="text-slate-500">
                  Website: <span className="font-medium text-slate-900">{tenant.website}</span>
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="h-5 w-5" style={{ color: primary }} />
                School Levels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {schoolLevels.map((level) => (
                <div key={level} className="flex items-center gap-3 rounded-lg border bg-white px-4 py-3">
                  <CircleCheckBig className="h-4 w-4" style={{ color: accent }} />
                  <span className="text-sm font-medium text-slate-700">{level}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-5 w-5" style={{ color: primary }} />
                Student Services
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-slate-600">
              View records, check schedules, and track student progress from a single school portal.
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="h-5 w-5" style={{ color: primary }} />
                Secure Access
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-slate-600">
              Dedicated school subdomain with role-based access for staff, parents, students, and admin users.
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <GraduationCap className="h-5 w-5" style={{ color: accent }} />
                Daily Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-slate-600">
              Stay informed with announcements, attendance, and academic updates tailored to your school.
            </CardContent>
          </Card>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]" id="contact">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Contact the School</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4" style={{ color: primary }} />
                <div>
                  <p className="font-medium text-slate-900">Address</p>
                  <p>{tenant.address || "Not configured yet"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4" style={{ color: primary }} />
                <div>
                  <p className="font-medium text-slate-900">Phone</p>
                  <p>{tenant.phone || "Not configured yet"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4" style={{ color: primary }} />
                <div>
                  <p className="font-medium text-slate-900">Email</p>
                  <p>{tenant.email || "Not configured yet"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 h-4 w-4" style={{ color: primary }} />
                <div>
                  <p className="font-medium text-slate-900">Office Hours</p>
                  <p>{tenant.officeHours || "Not configured yet"}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={onLogin} style={{ backgroundColor: secondary }}>
                  Login to Portal
                </Button>
                {tenant.email && (
                  <Button variant="outline" asChild>
                    <a href={`mailto:${tenant.email}`}>Email School</a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>What Visitors Can Find Here</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {highlights.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-lg border bg-white px-4 py-3">
                  <CircleCheckBig className="mt-0.5 h-4 w-4 flex-none" style={{ color: accent }} />
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
