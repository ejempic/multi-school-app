import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { useTenant } from "./TenantContext";

export type GatePassDirection = "IN" | "OUT";
export type GatePassStatus = "Active" | "Checked In" | "Checked Out" | "Expired";

export interface GatePassLog {
  id: string;
  direction: GatePassDirection;
  timestamp: string;
  gate: string;
  actor: string;
  note: string;
}

export interface GatePassRecord {
  id: string;
  tenantId: string;
  passCode: string;
  studentId: string;
  studentName: string;
  parentName: string;
  pickupPerson: string;
  grade: string;
  vehicleType: string;
  purpose: string;
  gate: string;
  validUntil: string;
  status: GatePassStatus;
  createdBy: string;
  createdAt: string;
  logs: GatePassLog[];
}

export interface GatePassCreateInput {
  studentId: string;
  studentName: string;
  parentName: string;
  pickupPerson: string;
  grade: string;
  vehicleType: string;
  purpose: string;
  gate: string;
  validUntil: string;
}

interface GatePassContextValue {
  passes: GatePassRecord[];
  activePasses: GatePassRecord[];
  selectedPassId: string | null;
  selectedPass: GatePassRecord | null;
  setSelectedPassId: (id: string) => void;
  createGatePass: (input: GatePassCreateInput) => GatePassRecord | null;
  recordGateMovement: (
    passId: string,
    direction: GatePassDirection,
    actor: string,
    gate: string,
    note?: string
  ) => void;
}

const GatePassContext = createContext<GatePassContextValue | undefined>(undefined);

const formatTimestamp = (date = new Date()) =>
  date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const createId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`;

const createSeedPass = (tenantId: string, seed: Omit<GatePassRecord, "tenantId">): GatePassRecord => ({
  ...seed,
  tenantId,
});

const initialPassesByTenant: Record<string, GatePassRecord[]> = {
  gtwfsl: [
    createSeedPass("gtwfsl", {
      id: "pass-001",
      passCode: "GTW-2401-A1",
      studentId: "STU-2024-001",
      studentName: "Emma Watson",
      parentName: "Lydia Watson",
      pickupPerson: "Lydia Watson",
      grade: "Grade 12",
      vehicleType: "Car / Van",
      purpose: "Parent conference and early pickup",
      gate: "Main Gate",
      validUntil: "Jul 25, 2026 5:00 PM",
      status: "Checked Out",
      createdBy: "Admin Office",
      createdAt: "Jul 25, 2026 8:15 AM",
      logs: [
        {
          id: "log-001-out",
          direction: "OUT",
          timestamp: "Jul 25, 2026 11:18 AM",
          gate: "Main Gate",
          actor: "Security Desk",
          note: "Parent and student exited campus after early dismissal clearance.",
        },
        {
          id: "log-001",
          direction: "IN",
          timestamp: "Jul 25, 2026 8:24 AM",
          gate: "Main Gate",
          actor: "Gate Officer",
          note: "Parent entered campus after QR pass and ID were verified at the main gate.",
        },
      ],
    }),
    createSeedPass("gtwfsl", {
      id: "pass-002",
      passCode: "GTW-2401-B7",
      studentId: "STU-2024-002",
      studentName: "Liam Johnson",
      parentName: "Carla Johnson",
      pickupPerson: "Carla Johnson",
      grade: "Grade 11",
      vehicleType: "Motorcycle",
      purpose: "Release for medical appointment",
      gate: "North Gate",
      validUntil: "Jul 25, 2026 3:30 PM",
      status: "Checked In",
      createdBy: "Admin Office",
      createdAt: "Jul 25, 2026 7:45 AM",
      logs: [
        {
          id: "log-002",
          direction: "IN",
          timestamp: "Jul 25, 2026 8:05 AM",
          gate: "North Gate",
          actor: "Security Desk",
          note: "Parent entered campus with issued pass.",
        },
      ],
    }),
  ],
  saa: [
    createSeedPass("saa", {
      id: "pass-101",
      passCode: "SAA-2401-C3",
      studentId: "SAA-2024-001",
      studentName: "Zoe Red",
      parentName: "Mina Red",
      pickupPerson: "Mina Red",
      grade: "Grade 9",
      vehicleType: "Walk-in",
      purpose: "Authorized pickup after class",
      gate: "East Gate",
      validUntil: "Jul 25, 2026 4:30 PM",
      status: "Checked Out",
      createdBy: "School Admin",
      createdAt: "Jul 25, 2026 7:30 AM",
      logs: [
        {
          id: "log-101",
          direction: "IN",
          timestamp: "Jul 25, 2026 8:10 AM",
          gate: "East Gate",
          actor: "Gate Officer",
          note: "Parent entered with QR pass.",
        },
        {
          id: "log-102",
          direction: "OUT",
          timestamp: "Jul 25, 2026 10:42 AM",
          gate: "East Gate",
          actor: "Gate Officer",
          note: "Parent exited after handling school business.",
        },
      ],
    }),
  ],
};

export function GatePassProvider({ children }: { children: ReactNode }) {
  const { currentTenant } = useTenant();
  const [passesByTenant, setPassesByTenant] = useState<Record<string, GatePassRecord[]>>(initialPassesByTenant);
  const [selectedPassId, setSelectedPassId] = useState<string | null>(null);

  const tenantId = currentTenant?.id ?? "";
  const passes = passesByTenant[tenantId] ?? [];

  const selectedPass = useMemo(
    () => passes.find((pass) => pass.id === selectedPassId) ?? passes[0] ?? null,
    [passes, selectedPassId]
  );

  const createGatePass = (input: GatePassCreateInput) => {
    if (!tenantId) {
      return null;
    }

    const passId = createId("pass");
    const passCode = `${tenantId.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    const createdAt = formatTimestamp();
    const nextPass: GatePassRecord = {
      id: passId,
      tenantId,
      passCode,
      studentId: input.studentId,
      studentName: input.studentName,
      parentName: input.parentName,
      pickupPerson: input.pickupPerson,
      grade: input.grade,
      vehicleType: input.vehicleType,
      purpose: input.purpose,
      gate: input.gate,
      validUntil: input.validUntil,
      status: "Active",
      createdBy: "Admin",
      createdAt,
      logs: [
        {
          id: createId("log"),
          direction: "IN",
          timestamp: createdAt,
          gate: input.gate,
          actor: "Admin",
          note: "Gate pass issued and approved.",
        },
      ],
    };

    setPassesByTenant((current) => ({
      ...current,
      [tenantId]: [nextPass, ...(current[tenantId] ?? [])],
    }));
    setSelectedPassId(passId);
    return nextPass;
  };

  const recordGateMovement = (
    passId: string,
    direction: GatePassDirection,
    actor: string,
    gate: string,
    note = ""
  ) => {
    if (!tenantId) {
      return;
    }

    const timestamp = formatTimestamp();
    setPassesByTenant((current) => ({
      ...current,
      [tenantId]: (current[tenantId] ?? []).map((pass) => {
        if (pass.id !== passId) {
          return pass;
        }

        return {
          ...pass,
          status: direction === "IN" ? "Checked In" : "Checked Out",
          logs: [
            {
              id: createId("log"),
              direction,
              timestamp,
              gate,
              actor,
              note: note || (direction === "IN" ? "Entry recorded at the gate." : "Exit recorded at the gate."),
            },
            ...pass.logs,
          ],
        };
      }),
    }));
  };

  const value: GatePassContextValue = {
    passes,
    activePasses: passes.filter((pass) => pass.status !== "Checked Out" && pass.status !== "Expired"),
    selectedPassId,
    selectedPass,
    setSelectedPassId,
    createGatePass,
    recordGateMovement,
  };

  return <GatePassContext.Provider value={value}>{children}</GatePassContext.Provider>;
}

export function useGatePasses() {
  const context = useContext(GatePassContext);
  if (!context) {
    throw new Error("useGatePasses must be used within a GatePassProvider");
  }
  return context;
}
