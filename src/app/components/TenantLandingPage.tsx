import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { GraduationCap, ShieldCheck, Users, ArrowRight } from "lucide-react";
import { Tenant } from "../data/tenants";

interface TenantLandingPageProps {
  tenant: Tenant;
  onLogin: () => void;
}

export function TenantLandingPage({ tenant, onLogin }: TenantLandingPageProps) {
  const primary = tenant.theme?.primary || "#1e3a8a";
  const secondary = tenant.theme?.secondary || "#1d4ed8";
  const accent = tenant.theme?.accent || "#0ea5e9";
  const background = tenant.theme?.background || "#f8fafc";

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
              <p className="text-xs text-slate-500">School Domain</p>
            </div>
          </div>
          <Button onClick={onLogin} className="gap-2" style={{ backgroundColor: secondary }}>
            Login
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <GraduationCap className="h-4 w-4" style={{ color: primary }} />
            {tenant.currentSchoolYear || "Current School Year"}
          </div>

          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
            Welcome to {tenant.name}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600">
            Access your school portal for attendance, grades, announcements, and class updates.
          </p>

          <Button size="lg" className="h-12 px-10" onClick={onLogin} style={{ backgroundColor: secondary }}>
            Proceed to Login
          </Button>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-5 w-5" style={{ color: primary }} />
                Student Services
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              View records, check schedules, and track student progress.
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="h-5 w-5" style={{ color: primary }} />
                Secure Access
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              Dedicated school domain with role-based access for staff and families.
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <GraduationCap className="h-5 w-5" style={{ color: accent }} />
                Daily Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              Stay informed with attendance, announcements, and academic updates.
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
