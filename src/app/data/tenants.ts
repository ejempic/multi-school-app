import gtwfslLogo from "../../assets/gtwfsl.png";
import saaLogo from "../../assets/saa.jpg";

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  logo: string;
  tagline?: string;
  about?: string;
  mission?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  officeHours?: string;
  schoolLevels?: string[];
  highlights?: string[];
  heroStats?: Array<{ label: string; value: string }>;
  theme: {
    primary: string;
    secondary: string;
    accent?: string; // Optional accent color
    background?: string; // Optional background color
  };
  plan?: "Sampaguita" | "Talisay" | "Yakal" | "Narra";
  features?: string[];
  currentSchoolYear?: string;
  currentTerm?: string;
}

export const tenants: Tenant[] = [
  {
    id: "gtwfsl",
    name: "Global Two Wings Foundation School of Legazpi", // Or just Global Two Wings Foundation if preferred
    subdomain: "gtwfsl",
    logo: gtwfslLogo,
    tagline: "Faith-centered learning for growing learners.",
    about:
      "Global Two Wings Foundation School of Legazpi is committed to nurturing students through academic excellence, character formation, and values-driven education.",
    mission:
      "To provide quality Christian education that develops learners academically, spiritually, and socially.",
    address: "Legazpi City, Albay, Philippines",
    phone: "+63 900 000 0001",
    email: "info@gtwfsl.eskuwela.ph",
    website: "gtwfsl.eskuwela.ph",
    officeHours: "Monday to Friday, 8:00 AM to 5:00 PM",
    schoolLevels: ["Elementary", "Junior High School", "Senior High School"],
    highlights: [
      "Christian values and formation",
      "Integrated school operations",
      "PACE and student progress tracking",
      "Parent and teacher collaboration"
    ],
    heroStats: [
      { label: "School Year", value: "SY 2025-2026" },
      { label: "Current Term", value: "2nd Semester" },
      { label: "Core Focus", value: "Academic + Values" }
    ],
    currentSchoolYear: "SY 2025-2026",
    currentTerm: "2nd Semester",
    plan: "Narra",
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
      "Efficacy & Evaluation",
      "Sick Leaves Management",
      "PACE Learning System",
      "Behavior Management (Merits/Demerits)",
      "ID Scanner",
      "Clinic Management",
      "Library Management",
      "School-wide Student Performance",
      "Student Risk Profile",
      "Advanced Authentication"
    ],
    theme: {
      primary: "#1e3a8a", // blue-900
      secondary: "#1d4ed8", // blue-700
      accent: "#eab308", // yellow-500
      background: "#f9fafb" // gray-50
    },
  },
  {
    id: "saa",
    name: "Saint Agnes Academy",
    subdomain: "saa",
    logo: saaLogo,
    tagline: "A school homepage for families, students, and visitors.",
    about:
      "Saint Agnes Academy serves as a trusted learning community where students grow in knowledge, discipline, and service.",
    mission:
      "To form learners who are competent, compassionate, and ready to contribute to society.",
    address: "Legazpi City, Albay, Philippines",
    phone: "+63 900 000 0002",
    email: "office@saa.eskuwela.ph",
    website: "saa.eskuwela.ph",
    officeHours: "Monday to Friday, 8:00 AM to 4:30 PM",
    schoolLevels: ["Preschool", "Elementary", "Junior High School"],
    highlights: [
      "Family-friendly school portal",
      "Clear academic tracking",
      "Announcements and calendar updates",
      "Centralized school contact information"
    ],
    heroStats: [
      { label: "Enrollment", value: "Open" },
      { label: "Program", value: "Talisay" },
      { label: "Community", value: "Student-centered" }
    ],
    plan: "Talisay",
    features: [
      "Student Database (SIS)",
      "Class Management",
      "Attendance Tracking",
      "Teacher Portal Login",
      "Parent Portal Login",
      "Student Portal Login",
      "Grading & Report Cards",
      "Communication Suite",
      "School-wide Student Performance"
    ],
    theme: {
      primary: "#7f1d1d", // red-900
      secondary: "#b91c1c", // red-700
      accent: "#f59e0b", // amber-500
      background: "#fff1f2" // rose-50
    },
  },
  {
    id: "admin",
    name: "SchoolApp Platform", // Company Name
    subdomain: "admin",
    logo: "", // No logo for admin, or use a generic one if available
    tagline: "Platform administration for all school tenants.",
    about:
      "The platform admin area manages school tenants, subscription plans, and system-wide controls.",
    mission:
      "To provide secure multi-school management from one central place.",
    address: "Eskuwela Platform Operations",
    theme: {
      primary: "#0f172a", // slate-900
      secondary: "#334155", // slate-700
      accent: "#2563eb", // blue-600
      background: "#f8fafc" // slate-50
    },
  },
];
