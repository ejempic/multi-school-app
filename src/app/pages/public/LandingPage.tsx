import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LibraryBig,
  HeartPulse,
  Megaphone,
  Presentation,
  Receipt,
  ScanLine,
  Globe2,
  Users,
} from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/app/components/ui/carousel";
import { tenants } from "@/app/data/tenants";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

export function LandingPage() {
  const schoolTenants = tenants.filter((tenant) => tenant.id !== "admin");
  const [heroCarouselApi, setHeroCarouselApi] = useState<CarouselApi>();
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
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

  const getDemoSchoolLabel = (schoolName: string) => `Demo - ${schoolName}`;

  const heroSlides = [
    {
      title: "Announcements families see on time",
      description: "Send class suspensions, reminders, events, and urgent school updates straight to the people who need them.",
      image: "/feature-images/ver2/announcement.png",
    },
    {
      title: "Attendance built for the morning rush",
      description: "Digital check-ins help schools keep attendance records accurate without slowing students down.",
      image: "/feature-images/ver2/attendance_1.png",
    },
    {
      title: "Cashier workflows families can trust",
      description: "Track tuition, payments, invoices, and daily collections in one organized finance workspace.",
      image: "/feature-images/ver2/cashier.png",
    },
    {
      title: "Clinic records for safer student care",
      description: "Log clinic visits, appointments, prescriptions, and student health notes in one searchable place.",
      image: "/feature-images/ver2/clinic.png",
    },
    {
      title: "Classroom tools where learning happens",
      description: "Support everyday class work with digital access to lessons, records, and learning progress.",
      image: "/feature-images/ver2/in_class_laptop.png",
    },
    {
      title: "Academic records made easier to review",
      description: "Keep grades, report cards, and learner progress visible for faculty, administrators, and families.",
      image: "/feature-images/ver2/grades.png",
    },
    {
      title: "Parent portals that stay close to school life",
      description: "Guardians can check grades, attendance, classes, and key updates from a mobile-friendly portal.",
      image: "/feature-images/ver2/parent_portal.png",
    },
    {
      title: "Library borrowing with cleaner records",
      description: "Scan IDs, track borrowed books, monitor overdue items, and keep library activity easy to review.",
      image: "/feature-images/ver2/library_borrow.png",
    },
    {
      title: "Registrar records without scattered spreadsheets",
      description: "Manage enrollment, student profiles, documents, and school records with less manual searching.",
      image: "/feature-images/ver2/registrar.png",
    },
    {
      title: "A school website ready for admissions and announcements",
      description: "Give each school a public-facing homepage with programs, admissions, news, contact details, and login access.",
      image: "/feature-images/ver2/school_website.png",
    },
    {
      title: "Student portals for learner progress",
      description: "Students can open their dashboard, review learning progress, and keep track of school updates.",
      image: "/feature-images/ver2/student_portal.png",
    },
    {
      title: "Teacher dashboards for every class day",
      description: "Give faculty a clearer view of classes, attendance, grading work, and student progress.",
      image: "/feature-images/ver2/teacher_meeting.png",
    },
  ];

  const features = [
    {
      icon: Megaphone,
      title: "Announcements",
      description: "Publish school updates, advisories, and class notices in one place.",
      longDescription: "Keep families informed about weather advisories, schedule changes, events, reminders, and official announcements without relying on scattered group chats.",
      image: "/feature-images/ver2/announcement.png",
    },
    {
      icon: ScanLine,
      title: "Attendance & ID Scanning",
      description: "Track student attendance with digital logs and ID scanning.",
      longDescription: "Speed up morning check-ins, record arrivals accurately, and give the school a reliable daily attendance trail for students.",
      image: "/feature-images/ver2/attendance_1.png",
    },
    {
      icon: Receipt,
      title: "Cashier Management",
      description: "Track collections, payment history, and school-issued billing with better control.",
      longDescription: "Give cashiers a clear workspace for receivables, payment posting, invoice handling, and daily transaction monitoring so finance operations stay organized and auditable.",
      image: "/feature-images/ver2/cashier.png",
    },
    {
      icon: HeartPulse,
      title: "Clinic Management",
      description: "Digitize clinic visits, appointments, and student health notes.",
      longDescription: "Help clinic staff record consultations, follow-ups, prescriptions, and basic health monitoring with a clearer view of each student's care history.",
      image: "/feature-images/ver2/clinic.png",
    },
    {
      icon: Presentation,
      title: "Classroom Learning",
      description: "Support class activities with digital learning and progress tools.",
      longDescription: "Give teachers and students access to class resources, progress views, and learning records that fit naturally into daily classroom routines.",
      image: "/feature-images/ver2/in_class_laptop.png",
    },
    {
      icon: BookOpen,
      title: "Grades & Academic Records",
      description: "Review grades, report cards, and academic standing with less manual work.",
      longDescription: "Teachers and administrators can manage grade records, calculate performance, and prepare report card information from a structured academic workspace.",
      image: "/feature-images/ver2/grades.png",
    },
    {
      icon: LibraryBig,
      title: "Library Borrowing",
      description: "Track book loans, returns, borrowers, and overdue items.",
      longDescription: "Library staff can scan student IDs, record checkouts and returns, review active loans, and keep circulation history organized.",
      image: "/feature-images/ver2/library_borrow.png",
    },
    {
      icon: Users,
      title: "Parent Portal",
      description: "Give guardians a direct view of student progress and daily updates.",
      longDescription: "Parents can check grades, attendance, class information, announcements, and student status from a mobile-friendly portal.",
      image: "/feature-images/ver2/parent_portal.png",
    },
    {
      icon: ClipboardList,
      title: "Registrar Management",
      description: "Handle enrollment records, student documents, and academic requests in one place.",
      longDescription: "Support enrollment validation, profile updates, document handling, section placement, and school record requests without relying on scattered spreadsheets.",
      image: "/feature-images/ver2/registrar.png",
    },
    {
      icon: Globe2,
      title: "School Website",
      description: "Give each school a public homepage for families and applicants.",
      longDescription: "Publish a school-facing website with hero content, programs, admissions information, news, contact details, maps, and login access tied to the portal.",
      image: "/feature-images/ver2/school_website.png",
    },
    {
      icon: LayoutDashboard,
      title: "Student Portal",
      description: "Give learners their own dashboard for progress and school updates.",
      longDescription: "Students can review PACE progress, announcements, schedules, and learning information from a focused portal built for daily use.",
      image: "/feature-images/ver2/student_portal.png",
    },
    {
      icon: GraduationCap,
      title: "Teacher Portal",
      description: "Give faculty one dashboard for classes, tasks, and student progress.",
      longDescription: "Teachers can review schedules, class lists, pending grading work, attendance, announcements, and learner progress from one focused workspace.",
      image: "/feature-images/ver2/teacher_meeting.png",
    },
  ];

  useEffect(() => {
    if (!heroCarouselApi) return;

    const updateActiveSlide = () => {
      setActiveHeroSlide(heroCarouselApi.selectedScrollSnap());
    };

    updateActiveSlide();
    heroCarouselApi.on("select", updateActiveSlide);
    heroCarouselApi.on("reInit", updateActiveSlide);

    return () => {
      heroCarouselApi.off("select", updateActiveSlide);
      heroCarouselApi.off("reInit", updateActiveSlide);
    };
  }, [heroCarouselApi]);

  useEffect(() => {
    if (!heroCarouselApi) return;

    const timer = window.setInterval(() => {
      heroCarouselApi.scrollNext();
    }, 5500);

    return () => window.clearInterval(timer);
  }, [heroCarouselApi]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <header
        className={`fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "border-b border-slate-200 bg-white/92 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/78"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <GraduationCap className={`h-6 w-6 transition-colors ${isScrolled ? "text-blue-600" : "text-white"}`} />
            <span className={`text-xl font-bold tracking-tight transition-colors ${isScrolled ? "text-slate-950" : "text-white"}`}>
              Eskuwela
            </span>
          </div>
          <nav className={`hidden items-center gap-6 text-sm font-medium transition-colors md:flex ${
            isScrolled ? "text-slate-600" : "text-white/85"
          }`}>
            <a className={`transition-colors ${isScrolled ? "hover:text-slate-950" : "hover:text-white"}`} href="#objective">
              Objective
            </a>
            <a className={`transition-colors ${isScrolled ? "hover:text-slate-950" : "hover:text-white"}`} href="#why-schools">
              Why Eskuwela
            </a>
            <a className={`transition-colors ${isScrolled ? "hover:text-slate-950" : "hover:text-white"}`} href="#features">
              Features
            </a>
            <a className={`transition-colors ${isScrolled ? "hover:text-slate-950" : "hover:text-white"}`} href="#pricing">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={isScrolled ? "outline" : "secondary"}
                  size="sm"
                  className={
                    isScrolled
                      ? ""
                      : "border border-white/20 bg-white/12 text-white backdrop-blur hover:bg-white/20 hover:text-white"
                  }
                >
                  Login to School Portal
                </Button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {schoolTenants.length > 0 ? (
                  schoolTenants.map((tenant) => (
                    <DropdownMenuItem
                      key={tenant.id}
                      onClick={() => handleSchoolLogin(tenant.subdomain)}
                    >
                      {getDemoSchoolLabel(tenant.name)}
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

      <section className="relative overflow-hidden bg-slate-950">
        <Carousel
          setApi={setHeroCarouselApi}
          opts={{ align: "start", loop: true }}
          className="relative"
        >
          <CarouselContent className="ml-0">
            {heroSlides.map((slide) => (
              <CarouselItem key={slide.image} className="pl-0">
                <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/45" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-950/58 to-slate-950/12" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="pointer-events-none absolute inset-0">
            <div className="container pointer-events-auto mx-auto flex min-h-[calc(100vh-4rem)] flex-col justify-center px-4 py-14 lg:py-20">
              <div className="max-w-3xl text-white">
                <p className="mb-4 inline-flex w-fit items-center rounded-full border border-white/20 bg-white/12 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/85 backdrop-blur">
                  Eskuwela School Management System
                </p>
                <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight lg:text-6xl">
                  School technology should be easier, safer, and better for every child.
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/88">
                  Eskuwela helps schools move beyond spreadsheets and social media chats with safer records, clearer communication,
                  and easier tools for teachers, parents, and students.
                </p>
                <div className="mt-6 max-w-2xl border-l-4 border-blue-400 pl-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
                    {heroSlides[activeHeroSlide]?.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/78">
                    {heroSlides[activeHeroSlide]?.description}
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                        Login to School Portal
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {schoolTenants.length > 0 ? (
                        schoolTenants.map((tenant) => (
                          <DropdownMenuItem
                            key={tenant.id}
                            onClick={() => handleSchoolLogin(tenant.subdomain)}
                          >
                            {getDemoSchoolLabel(tenant.name)}
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <DropdownMenuItem disabled>No schools available</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="border-white/25 bg-white/10 text-white hover:bg-white/16 hover:text-white"
                  >
                    <a href="#book-demo">Book Demo</a>
                  </Button>
                </div>
                {schoolTenants.length === 0 && (
                  <p className="mt-4 text-sm text-amber-100">No school domains are configured yet. Please contact support.</p>
                )}
              </div>
            </div>
          </div>

          <CarouselPrevious className="left-4 top-auto bottom-6 h-10 w-10 border-white/20 bg-white/12 text-white hover:bg-white/20 hover:text-white disabled:opacity-35 lg:left-auto lg:right-20" />
          <CarouselNext className="right-4 top-auto bottom-6 h-10 w-10 border-white/20 bg-white/12 text-white hover:bg-white/20 hover:text-white disabled:opacity-35" />
        </Carousel>

        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2 lg:left-6 lg:translate-x-0">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              aria-label={`Show ${slide.title}`}
              onClick={() => heroCarouselApi?.scrollTo(index)}
              className={`h-2.5 rounded-full transition-all ${
                activeHeroSlide === index ? "w-9 bg-white" : "w-2.5 bg-white/45 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </section>

      <section id="objective" className="scroll-mt-20 bg-white px-4 py-16">
        <div className="container mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Our Objective</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 lg:text-4xl">
                I built <strong>Eskuwela</strong> because school tools should feel simple, safe, and easy to use.
              </h2>
              <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm">
                <img
                  src="/feature-images/ver2/my_photo.jpg"
                  alt="Eskuwela founder with family and school community"
                  className="aspect-[4/3] w-full object-cover object-center"
                />
                <div className="bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Founder and Developer</p>
                  <p className="mt-1 text-base font-bold text-slate-950">Earl Julius Empic</p>
                  <p className="text-sm font-semibold text-slate-900">Created as a developer, guided as a father.</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    A personal mission shaped by what my child, our teachers, and school families needed most.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 text-base leading-8 text-slate-650">
              <p>
                I created this app because I want the best software experience for my kid and for the people around him
                at school. During the pandemic, I saw how hard online classes, account setup, scattered links, and daily
                updates became for everyone. Teachers were adjusting. Schools were adjusting. Parents were adjusting too,
                especially older parents who needed something clear and intuitive instead of another complicated system.
              </p>
              <p>
                I also saw schools working hard with the tools they already had, but many systems still lacked the simple
                options families actually needed. Communication often moved to <strong>Facebook</strong> or <strong>Messenger</strong>, and I did not want
                those platforms to become the main source of school communication for my child. Important school updates
                should be organized, official, and safe without exposing students to social media.
              </p>
              <p>
                <strong>Eskuwela</strong> is my answer to that problem: one place that is easier for schools to manage, easier for teachers
                to use, easier for parents to understand, and better for students who deserve connection without confusion.
              </p>
              <div className="grid gap-3 pt-2 sm:grid-cols-2">
                {[
                  "Less setup friction for schools",
                  "Clearer tools for teachers",
                  "Better visibility for parents",
                  "A smoother experience for students",
                ].map((item) => (
                  <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="why-schools" className="scroll-mt-20 border-y bg-slate-50 px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Why Schools Need This</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 lg:text-4xl">
                Your school deserves more than spreadsheets and group chats.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                Excel sheets, Messenger groups, and paper forms can help for a while, but they are not built to organize a
                whole school. Eskuwela gives schools a cleaner, safer, and more official way to manage daily operations.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-5 shadow-sm md:col-span-2">
                <p className="text-base font-bold text-slate-950">Fast AI-assisted transition</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Moving from spreadsheets and Excel does not have to be difficult. With AI-assisted transition, we can
                  help translate your existing files into live, safer school data in just a few moments, making setup and
                  onboarding feel easy as pie.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-base font-bold text-slate-950">Not just spreadsheets</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Student records, grades, attendance, billing, clinic logs, and registrar work need structure that a
                  spreadsheet was never designed to provide.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-base font-bold text-slate-950">Official communication</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  School communication should not depend on <strong>Messenger</strong> or <strong>WhatsApp</strong>, where
                  parents can create separate group chats without the teacher or school having a clear record.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-base font-bold text-slate-950">Safer school data</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Important student and family information should stay in a school system with clear access, organized
                  records, and less exposure through scattered files or social apps.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-base font-bold text-slate-950">Paperless access for parents</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Parents who are away from school can still view updates, balances, records, and student progress without
                  waiting for printed forms or manually forwarded messages.
                </p>
              </div>
            </div>
          </div>
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
              Clear, student-based pricing that schools can understand quickly: PHP 33 per student.
            </p>
          </div>

          <Card className="mx-auto max-w-5xl overflow-hidden border-none shadow-lg">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="bg-slate-950 px-8 py-10 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-200">Core Rate</p>
                <div className="mt-4 flex flex-wrap items-end gap-x-3 gap-y-2">
                  <span className="text-6xl font-black leading-none">PHP 33</span>
                  <span className="pb-2 text-xl font-semibold text-slate-200">per student</span>
                </div>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
                  One simple rate for the school tools families, teachers, and administrators use every day. No confusing
                  plan names, no bloated bundles, and no guessing what the system will cost as enrollment changes.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "Free demo available",
                    "Demo ceiling: 200 students",
                    "Student information system",
                    "Academic and attendance tools",
                    "Registrar and cashier workflows",
                    "Parent and student portals",
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
                <h3 className="text-2xl font-bold text-slate-900">Straightforward from demo to rollout</h3>
                <div className="mt-6 grid gap-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-semibold text-slate-900">PHP 33 per student</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Pricing is based on students, making the cost easy to estimate and explain.
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-semibold text-slate-900">Free demo up to 200 students</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Schools can test the system with a demo setup before committing to a full rollout.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Call to Action */}
          <div id="book-demo" className="mt-16 scroll-mt-20 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
            <div className="max-w-2xl mx-auto">
              <h3 className="mb-3 text-2xl font-bold text-white text-center">Ready to Get in Touch?</h3>
              <p className="mb-8 text-blue-100 text-center">
                Contact us to request a free demo and see how Eskuwela can fit your school.
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
