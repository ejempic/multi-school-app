import gtwfslLogo from "../../assets/gtwfsl.png";
import saaLogo from "../../assets/saa.jpg";

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  logo: string;
  theme: {
    primary: string;
    secondary: string;
    accent?: string; // Optional accent color
    background?: string; // Optional background color
  };
  plan?: "Basic" | "Pro" | "Enterprise";
  features?: string[];
  address?: string;
  currentSchoolYear?: string;
  currentTerm?: string;
}

export const tenants: Tenant[] = [
  {
    id: "gtwfsl",
    name: "Global Two Wings Foundation School of Legazpi", // Or just Global Two Wings Foundation if preferred
    subdomain: "gtwfsl",
    logo: gtwfslLogo,
    address: "Legazpi City, Albay, Philippines",
    currentSchoolYear: "SY 2025-2026",
    currentTerm: "2nd Semester",
    plan: "Enterprise",
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
    plan: "Pro",
    features: [
      "Student Database (SIS)",
      "Class Management",
      "Attendance Tracking",
      "Teacher Portal Login",
      "Parent Portal Login",
      "Student Portal Login",
      "Grading & Report Cards",
      "Communication Suite"
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
    theme: {
      primary: "#0f172a", // slate-900
      secondary: "#334155", // slate-700
      accent: "#2563eb", // blue-600
      background: "#f8fafc" // slate-50
    },
  },
];

