import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import {
  ArrowRight,
  BadgeInfo,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronRight,
  CircleCheckBig,
  Clock3,
  Dumbbell,
  Facebook,
  FlaskConical,
  GraduationCap,
  Instagram,
  LibraryBig,
  Mail,
  MapPin,
  Megaphone,
  MessageSquareQuote,
  Phone,
  School,
  ShieldCheck,
  Sparkles,
  Users,
  UtensilsCrossed,
  Youtube,
} from "lucide-react";
import landingContent from "@/app/data/tenantLandingPage.json";
import { Tenant } from "@/app/data/tenants";

interface TenantLandingPageProps {
  tenant: Tenant;
  onLogin: () => void;
}

type NavItem = { label: string; href: string };
type ListItem = { title: string; description: string };
type HeroContent = {
  eyebrow: string;
  headline: string;
  tagline: string;
  intro: string;
  primaryCta: string;
  secondaryCta: string;
  imageUrl: string;
  imageAlt: string;
};
type AboutContent = {
  history: string;
  mission: string;
  vision: string;
  coreValues: string[];
};
type ProgramContent = { level: string; description: string };
type StatContent = { label: string; value: string; detail: string };
type FacilityContent = { title: string; description: string };
type NewsItem = { date: string; title: string; category: string; summary: string };
type AdmissionsContent = { requirements: string[]; process: string[]; dates: string; cta: string };
type GalleryItem = { title: string; caption: string; imageUrl: string };
type Testimonial = { name: string; role: string; quote: string };
type ContactContent = {
  address: string;
  phone: string;
  email: string;
  officeHours: string;
  mapQuery: string;
  socialLinks: Array<{ label: string; href: string }>;
};
type FooterContent = { quickLinks: NavItem[] };
type LandingContent = {
  navigation: NavItem[];
  hero: HeroContent;
  about: AboutContent;
  programs: ProgramContent[];
  whyChooseUs: ListItem[];
  statistics: StatContent[];
  facilities: FacilityContent[];
  news: NewsItem[];
  admissions: AdmissionsContent;
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  contact: ContactContent;
  footer: FooterContent;
};

const contentMap = landingContent as Record<string, LandingContent>;

const sectionIcons = {
  whyChooseUs: [CircleCheckBig, ShieldCheck, Sparkles, Users, GraduationCap, BadgeInfo],
  facilities: [School, Building2, FlaskConical, LibraryBig, Dumbbell, UtensilsCrossed],
  programs: [Sparkles, BookOpen, GraduationCap, Users, School],
};

const fallbackContent = contentMap.default;

const socialIconMap = {
  Facebook,
  Instagram,
  YouTube: Youtube,
} as const;

const socialPillStyleMap = {
  Facebook: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800",
  Instagram: "border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100 hover:text-pink-800",
  YouTube: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800",
} as const;

const mergeContent = (base: LandingContent, override?: Partial<LandingContent>): LandingContent => ({
  ...base,
  ...override,
  navigation: override?.navigation ?? base.navigation,
  hero: { ...base.hero, ...override?.hero },
  about: { ...base.about, ...override?.about },
  programs: override?.programs ?? base.programs,
  whyChooseUs: override?.whyChooseUs ?? base.whyChooseUs,
  statistics: override?.statistics ?? base.statistics,
  facilities: override?.facilities ?? base.facilities,
  news: override?.news ?? base.news,
  admissions: { ...base.admissions, ...override?.admissions },
  gallery: override?.gallery ?? base.gallery,
  testimonials: override?.testimonials ?? base.testimonials,
  contact: {
    ...base.contact,
    ...override?.contact,
    socialLinks: override?.contact?.socialLinks ?? base.contact.socialLinks,
  },
  footer: {
    ...base.footer,
    ...override?.footer,
    quickLinks: override?.footer?.quickLinks ?? base.footer.quickLinks,
  },
});

export function TenantLandingPage({ tenant, onLogin }: TenantLandingPageProps) {
  const primary = tenant.theme?.primary || "#1e3a8a";
  const secondary = tenant.theme?.secondary || "#1d4ed8";
  const accent = tenant.theme?.accent || "#0ea5e9";
  const background = tenant.theme?.background || "#f8fafc";
  const [isScrolled, setIsScrolled] = useState(false);

  const content = mergeContent(fallbackContent, contentMap[tenant.id] as Partial<LandingContent> | undefined);
  const heroHeadline = content.hero.headline.replace("{schoolName}", tenant.name);
  const quickStats = tenant.heroStats?.length ? tenant.heroStats : content.statistics.slice(0, 3).map((stat) => ({
    label: stat.label,
    value: stat.value,
  }));

  useEffect(() => {
    document.title = `${tenant.name} - Home`;

    if (!tenant.logo) {
      return;
    }

    let favicon = document.querySelector<HTMLLinkElement>("link[rel='icon']");

    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }

    favicon.href = tenant.logo;
  }, [tenant.name, tenant.logo]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" style={{ backgroundColor: background }}>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isScrolled ? "border-b bg-white/92 shadow-sm backdrop-blur" : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-6">
          <a href="#home" className="flex min-w-0 items-center gap-3">
            {tenant.logo ? (
              <img src={tenant.logo} alt={`${tenant.name} logo`} className="h-12 w-12 shrink-0 object-contain" />
            ) : (
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white ${
                  isScrolled ? "bg-slate-900" : "bg-white/15 backdrop-blur-sm"
                }`}
              >
                SC
              </div>
            )}
            <div className="min-w-0 leading-tight">
              <p
                className={`truncate text-sm font-bold transition-colors ${isScrolled ? "" : "text-white"}`}
                style={isScrolled ? { color: primary } : undefined}
              >
                {tenant.name}
              </p>
              <p className={`truncate text-xs transition-colors ${isScrolled ? "text-slate-500" : "text-white/75"}`}>
                {tenant.tagline || "School domain"}
              </p>
            </div>
          </a>

          <nav
            className={`hidden items-center gap-6 text-sm font-medium transition-colors lg:flex ${
              isScrolled ? "text-slate-600" : "text-white/88"
            }`}
          >
            {content.navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`transition-colors ${isScrolled ? "hover:text-slate-950" : "hover:text-white"}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button onClick={onLogin} className="gap-2" style={{ backgroundColor: secondary }}>
              Login
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main id="home">
        <section className="relative overflow-hidden border-b">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${content.hero.imageUrl})` }}
          />
          <div className="absolute inset-0 bg-slate-950/45" />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, rgba(15,23,42,0.82) 0%, rgba(15,23,42,0.62) 38%, rgba(15,23,42,0.28) 70%, rgba(15,23,42,0.16) 100%)`,
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-32"
            style={{ background: "linear-gradient(180deg, rgba(15,23,42,0) 0%, rgba(15,23,42,0.42) 100%)" }}
          />

          <div className="relative mx-auto flex min-h-[80vh] max-w-7xl flex-col justify-center px-4 py-14 lg:px-6 lg:py-20">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm backdrop-blur-sm">
                <Sparkles className="h-4 w-4" style={{ color: accent }} />
                {content.hero.eyebrow}
              </div>

              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white lg:text-6xl">
                {heroHeadline}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/88">{content.hero.tagline}</p>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/80">{content.hero.intro}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild style={{ backgroundColor: secondary }}>
                  <a href="#contact">{content.hero.primaryCta}</a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-white/25 bg-white/10 text-white hover:bg-white/16 hover:text-white"
                >
                  <a href="#about">{content.hero.secondaryCta}</a>
                </Button>
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {quickStats.map((stat) => (
                <Card key={stat.label} className="border border-white/12 bg-white/12 shadow-sm backdrop-blur-sm">
                  <CardContent className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-white/70">{stat.label}</p>
                    <p className="mt-2 text-lg font-bold text-white">{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
          <Card className="overflow-hidden border-none shadow-sm">
            <CardHeader className="border-b bg-white">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}
                >
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">About the School</CardTitle>
                  <CardDescription className="mt-1">
                    A clear view of the school story, direction, and guiding values.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6 lg:p-8">
              <div className="relative overflow-hidden rounded-3xl border border-slate-200">
                {content.hero.imageUrl ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-15 grayscale"
                    style={{ backgroundImage: `url(${content.hero.imageUrl})` }}
                  />
                ) : null}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${primary}14 0%, ${secondary}10 38%, rgba(255,255,255,0.96) 100%)`,
                  }}
                />
                <div className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: secondary }} />
                <div className="relative px-6 py-8 lg:px-8 lg:py-10">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">School Story</p>
                  <p className="max-w-5xl text-sm leading-8 text-slate-700 lg:text-base">
                    {content.about.history} This school page is designed to give families a fuller view of the campus,
                    the academic direction, and the kind of environment students experience each day. It brings together
                    the school&apos;s public-facing information in one place so parents, learners, and visitors can
                    understand the character of the institution before they make contact or begin the admissions process.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                      <Sparkles className="h-4 w-4" style={{ color: primary }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Mission</p>
                      <p className="text-sm font-semibold text-slate-900">What we commit to do</p>
                    </div>
                  </div>
                  <p className="text-sm leading-7 text-slate-600">{content.about.mission}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                      <ShieldCheck className="h-4 w-4" style={{ color: accent }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Vision</p>
                      <p className="text-sm font-semibold text-slate-900">Where the school is headed</p>
                    </div>
                  </div>
                  <p className="text-sm leading-7 text-slate-600">{content.about.vision}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Core Values</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">The principles behind daily school life</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {content.about.coreValues.map((value) => (
                    <Badge key={value} variant="outline" className="rounded-full px-3 py-1 text-xs font-semibold">
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="programs" className="border-y bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Programs</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Courses Offered</h2>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {content.programs.map((program, index) => {
                const Icon = sectionIcons.programs[index % sectionIcons.programs.length];
                return (
                  <Card key={program.level} className="border-slate-200 shadow-sm">
                    <CardContent className="space-y-4 p-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                        <Icon className="h-5 w-5" style={{ color: primary }} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{program.level}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{program.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {content.statistics.map((stat) => (
              <Card key={stat.label} className="border-none bg-white shadow-sm">
                <CardContent className="space-y-2 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-950">{stat.value}</p>
                  <p className="text-sm leading-6 text-slate-600">{stat.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="facilities" className="border-y bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Facilities</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Spaces That Support Learning</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {content.facilities.map((facility, index) => {
                const Icon = sectionIcons.facilities[index % sectionIcons.facilities.length];
                return (
                  <Card key={facility.title} className="border-none shadow-sm">
                    <CardContent className="space-y-4 p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                          <Icon className="h-5 w-5" style={{ color: accent }} />
                        </div>
                        <p className="text-base font-semibold text-slate-950">{facility.title}</p>
                      </div>
                      <p className="text-sm leading-6 text-slate-600">{facility.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="news" className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">News</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Announcements and Latest Updates</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {content.news.map((item) => (
              <Card key={item.title} className="border-none shadow-sm">
                <CardContent className="flex gap-4 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                    <Megaphone className="h-5 w-5" style={{ color: primary }} />
                  </div>
                  <div className="min-w-0">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="outline" className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.2em]">
                        {item.category}
                      </Badge>
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{item.date}</span>
                    </div>
                    <p className="text-base font-semibold text-slate-950">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="admissions" className="border-y bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Admissions</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Enrollment and Requirements</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                  <CardDescription>Documents families can prepare before enrollment.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {content.admissions.requirements.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-xl border bg-slate-50 px-4 py-3">
                      <CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0" style={{ color: accent }} />
                      <span className="text-sm leading-6 text-slate-700">{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Enrollment Process</CardTitle>
                  <CardDescription>{content.admissions.dates}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {content.admissions.process.map((step, index) => (
                      <div key={step} className="flex gap-3">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-6 text-slate-700">{step}</p>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full" asChild style={{ backgroundColor: secondary }}>
                    <a href="#contact">{content.admissions.cta}</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="gallery" className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Gallery</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Campus, Students, Events, and Activities</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {content.gallery.map((item) => (
              <Card key={item.title} className="overflow-hidden border-none shadow-sm">
                <div className="relative aspect-[4/3]">
                  <img src={item.imageUrl} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs leading-5 text-white/80">{item.caption}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section id="testimonials" className="border-y bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Testimonials</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">What Families Say</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {content.testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="border-none shadow-sm">
                  <CardContent className="space-y-4 p-5">
                    <MessageSquareQuote className="h-5 w-5" style={{ color: primary }} />
                    <p className="text-sm leading-7 text-slate-700">"{testimonial.quote}"</p>
                    <div>
                      <p className="font-semibold text-slate-950">{testimonial.name}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 border-t bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Contact</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Get in Touch</h2>
            </div>

            <div className="grid gap-6">
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
                <Card className="h-full rounded-2xl border border-slate-200 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle>School Information</CardTitle>
                    <CardDescription>Office hours and contact details.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5 text-sm text-slate-600">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: primary }} />
                      <div>
                        <p className="font-medium text-slate-900">School Address</p>
                        <p>{tenant.address || content.contact.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0" style={{ color: primary }} />
                      <div>
                        <p className="font-medium text-slate-900">Phone Number</p>
                        <p>{tenant.phone || content.contact.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="mt-0.5 h-4 w-4 shrink-0" style={{ color: primary }} />
                      <div>
                        <p className="font-medium text-slate-900">Email</p>
                        <p>{tenant.email || content.contact.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock3 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: primary }} />
                      <div>
                        <p className="font-medium text-slate-900">Office Hours</p>
                        <p>{tenant.officeHours || content.contact.officeHours}</p>
                      </div>
                    </div>
                    <div className="pt-2">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Social Links
                      </p>
                      <div className="flex flex-wrap gap-2">
                      {content.contact.socialLinks.map((social) => (
                        <Button
                          key={social.label}
                          variant="outline"
                          className={`w-auto min-w-32 justify-start rounded-xl px-4 ${
                            socialPillStyleMap[social.label as keyof typeof socialPillStyleMap] || ""
                          }`}
                          asChild
                        >
                          <a href={social.href}>
                            {(() => {
                              const Icon = socialIconMap[social.label as keyof typeof socialIconMap];
                              return Icon ? <Icon className="h-4 w-4" /> : null;
                            })()}
                            {social.label}
                          </a>
                        </Button>
                      ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="h-full rounded-2xl border border-slate-200 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle>Contact Form</CardTitle>
                    <CardDescription>Send a school inquiry or request more information.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex h-full flex-col gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="contact-name">Name</Label>
                        <Input id="contact-name" placeholder="Your name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">Email</Label>
                        <Input id="contact-email" type="email" placeholder="you@example.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-subject">Subject</Label>
                      <Input id="contact-subject" placeholder="Enrollment, visit, or general inquiry" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-message">Message</Label>
                      <Textarea id="contact-message" placeholder="Write your message here..." className="min-h-40" />
                    </div>
                    <Button className="mt-auto w-full" style={{ backgroundColor: secondary }}>
                      Send Inquiry
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle>Google Maps</CardTitle>
                  <CardDescription>School location preview</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <iframe
                    title={`${tenant.name} map`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(tenant.address || content.contact.mapQuery)}&output=embed`}
                    className="h-80 w-full border-0"
                    loading="lazy"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-slate-950 text-slate-200">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_auto_auto] lg:px-6">
          <div>
            <div className="flex items-center gap-3">
              {tenant.logo ? (
                <img src={tenant.logo} alt={`${tenant.name} logo`} className="h-10 w-10 object-contain" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-sm font-bold text-slate-950">
                  SC
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-white">{tenant.name}</p>
                <p className="text-xs text-slate-400">{tenant.tagline || "School domain"}</p>
              </div>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
              {tenant.about || content.about.history}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Quick Links</p>
            <div className="mt-4 grid gap-2 text-sm">
              {content.footer.quickLinks.map((link) => (
                <a key={link.label} href={link.href} className="text-slate-300 transition-colors hover:text-white">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Contact</p>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <p>{tenant.address || content.contact.address}</p>
              <p>{tenant.phone || content.contact.phone}</p>
              <p>{tenant.email || content.contact.email}</p>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Copyright {new Date().getFullYear()} {tenant.name}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
