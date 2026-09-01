import { Shield, Zap, Star, LucideIcon } from "lucide-react";

export const AVAILABLE_FEATURES = [
    "Student Database (SIS)",
    "Class Management",
    "Attendance Tracking",
    "Teacher Portal Login",
    "Parent Portal Login",
    "Student Portal Login",
    "Registrar",
    "Cashier",
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
  ];
  
export const PLAN_FEATURES: Record<string, string[]> = {
    Sampaguita: [
      "Student Database (SIS)",
      "Class Management",
      "Attendance Tracking",
      "Teacher Portal Login"
    ],
    Talisay: [
      "Student Database (SIS)",
      "Class Management",
      "Attendance Tracking",
      "Teacher Portal Login",
      "Parent Portal Login",
      "Student Portal Login",
      "Registrar",
      "Cashier",
      "Grading & Report Cards",
      "Tuition & Billing",
      "Communication Suite",
      "School-wide Student Performance",
      "Sick Leaves Management"
    ],
    Yakal: [
      "Student Database (SIS)",
      "Class Management",
      "Attendance Tracking",
      "Teacher Portal Login",
      "Parent Portal Login",
      "Student Portal Login",
      "Registrar",
      "Cashier",
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
    Narra: [
      "Everything in Yakal",
      "Registrar",
      "Cashier",
      "PACE Learning System",
      "Behavior Management (Merits/Demerits)",
      "ID Scanner",
      "Clinic Management",
      "Library Management",
      "School-wide Student Performance",
      "Student Risk Profile",
      "Efficacy & Evaluation",
      "Advanced Authentication"
    ]
  };

export interface PlanDefinition {
    name: string;
    description: string;
    price: string;
    monthly: string;
    onboarding: string;
    icon: LucideIcon;
    image: string;
    features: string[];
  }

  export const SUBSCRIPTION_PLANS: PlanDefinition[] = [
    {
        name: "Sampaguita",
        description: "Essentials for small schools starting their digital journey.",
        price: "₱25,000 / SY",
        monthly: "₱2,500 / mo",
        onboarding: "+ ₱10,000 Setup Fee",
        icon: Shield,
        image: "/plans/sampaguita.png",
        features: PLAN_FEATURES.Sampaguita
      },
      {
        name: "Talisay",
        description: "Comprehensive management for growing institutions.",
        price: "₱45,000 / SY",
        monthly: "₱4,500 / mo",
        onboarding: "+ ₱15,000 Setup Fee",
        icon: Zap,
        image: "/plans/talisay.png",
        features: PLAN_FEATURES.Talisay
      },
      {
        name: "Yakal",
        description: "Full-scale solution for established universities/colleges.",
        price: "₱85,000 / SY",
        monthly: "₱8,500 / mo",
        onboarding: "+ ₱25,000 Setup Fee",
        icon: Star,
        image: "/plans/yakal.png",
        features: PLAN_FEATURES.Yakal
      },
      {
        name: "Narra",
        description: "Premium campus operations with the full bundled school experience.",
        price: "₱125,000 / SY",
        monthly: "₱12,500 / mo",
        onboarding: "+ ₱35,000 Setup Fee",
        icon: Star,
        image: "/plans/narra.png",
        features: PLAN_FEATURES.Narra
      }
  ];
