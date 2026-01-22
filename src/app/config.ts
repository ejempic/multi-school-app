import { Shield, Zap, Star, LucideIcon } from "lucide-react";

export const AVAILABLE_FEATURES = [
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
  ];
  
  export const PLAN_FEATURES: Record<string, string[]> = {
    Basic: [
      "Student Database (SIS)",
      "Class Management",
      "Attendance Tracking",
      "Teacher Portal Login"
    ],
    Pro: [
      "Student Database (SIS)",
      "Class Management",
      "Attendance Tracking",
      "Teacher Portal Login",
      "Parent Portal Login",
      "Student Portal Login",
      "Grading & Report Cards",
      "Tuition & Billing",
      "Communication Suite",
      "Sick Leaves Management"
    ],
    Enterprise: [
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
    ]
  };

  export interface PlanDefinition {
    name: string;
    description: string;
    price: string;
    monthly: string;
    onboarding: string;
    icon: LucideIcon;
    features: string[];
  }

  export const SUBSCRIPTION_PLANS: PlanDefinition[] = [
    {
        name: "Basic",
        description: "Essentials for small schools starting their digital journey.",
        price: "₱25,000 / SY",
        monthly: "₱2,500 / mo",
        onboarding: "+ ₱10,000 Setup Fee",
        icon: Shield,
        features: PLAN_FEATURES.Basic
      },
      {
        name: "Pro",
        description: "Comprehensive management for growing institutions.",
        price: "₱45,000 / SY",
        monthly: "₱4,500 / mo",
        onboarding: "+ ₱15,000 Setup Fee",
        icon: Zap,
        features: PLAN_FEATURES.Pro
      },
      {
        name: "Enterprise",
        description: "Full-scale solution for established universities/colleges.",
        price: "₱85,000 / SY",
        monthly: "₱8,500 / mo",
        onboarding: "+ ₱25,000 Setup Fee",
        icon: Star,
        features: [
            "Everything in Pro",
            "PACE Learning System",
            "Behavior Management (Merits/Demerits)",
            "ID Scanner",
            "Clinic Management",
            "Library Management"
        ]
      }
  ];