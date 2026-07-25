import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { PageHeader } from "./ui/page-header";
import { Separator } from "./ui/separator";
import {
  ArrowRightLeft,
  Clock3,
  Car,
  Printer,
  QrCode,
  ScanLine,
  ShieldCheck,
  Users,
} from "lucide-react";
import { GatePassCreateInput, useGatePasses } from "../contexts/GatePassContext";
import { studentsByTenant } from "../data/mockData";
import { useTenant } from "../contexts/TenantContext";

interface QrMatrixProps {
  value: string;
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createMatrix(value: string, size = 29) {
  const matrix = Array.from({ length: size }, () => Array(size).fill(false));
  const seedStart = hashString(value);
  let seed = seedStart;

  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const drawFinder = (startRow: number, startCol: number) => {
    for (let row = 0; row < 7; row += 1) {
      for (let col = 0; col < 7; col += 1) {
        const isBorder = row === 0 || row === 6 || col === 0 || col === 6;
        const isCenter = row >= 2 && row <= 4 && col >= 2 && col <= 4;
        matrix[startRow + row][startCol + col] = isBorder || isCenter;
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  for (let index = 8; index < size - 8; index += 1) {
    matrix[6][index] = index % 2 === 0;
    matrix[index][6] = index % 2 === 0;
  }

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const inFinder =
        (row < 7 && col < 7) ||
        (row < 7 && col >= size - 7) ||
        (row >= size - 7 && col < 7);
      const onTiming = row === 6 || col === 6;

      if (!inFinder && !onTiming) {
        matrix[row][col] = random() > 0.5;
      }
    }
  }

  return matrix;
}

function QrMatrix({ value }: QrMatrixProps) {
  const matrix = useMemo(() => createMatrix(value), [value]);
  const size = matrix.length;

  return (
    <svg viewBox={`0 0 ${size + 8} ${size + 8}`} className="h-full w-full" role="img" aria-label="Gate pass QR pattern">
      <rect width={size + 8} height={size + 8} fill="#ffffff" rx="3" />
      {matrix.map((row, rowIndex) =>
        row.map((filled, colIndex) =>
          filled ? (
            <rect
              key={`${rowIndex}-${colIndex}`}
              x={4 + colIndex}
              y={4 + rowIndex}
              width="1"
              height="1"
              rx="0.08"
              fill="#0f172a"
            />
          ) : null
        )
      )}
      <rect x="4" y="4" width="7" height="7" fill="none" stroke="#0f172a" strokeWidth="0.2" />
      <rect x={`${size - 3}`} y="4" width="7" height="7" fill="none" stroke="#0f172a" strokeWidth="0.2" />
      <rect x="4" y={`${size - 3}`} width="7" height="7" fill="none" stroke="#0f172a" strokeWidth="0.2" />
    </svg>
  );
}

const formatDateLabel = (value: string) => value || "No expiry set";
const vehicleTypes = ["Walk-in", "Car / Van", "Motorcycle", "Tricycle", "School Service", "Other"];

interface GatePassesProps {
  userRole?: string | null;
}

export function GatePasses({ userRole }: GatePassesProps) {
  const { passes, activePasses, selectedPass, setSelectedPassId, createGatePass, recordGateMovement } = useGatePasses();
  const { currentTenant } = useTenant();
  const isParentAccess = userRole === "parent";
  const tenantStudents = useMemo(
    () => (currentTenant ? studentsByTenant[currentTenant.id] ?? [] : []).filter((student) => student.status === "Active"),
    [currentTenant]
  );
  const [formData, setFormData] = useState<GatePassCreateInput>({
    studentId: "",
    studentName: "",
    parentName: "",
    pickupPerson: "",
    grade: "",
    vehicleType: vehicleTypes[0],
    purpose: "",
    gate: "Main Gate",
    validUntil: "",
  });
  const [search, setSearch] = useState("");
  const [printPassId, setPrintPassId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedPass && passes[0]) {
      setSelectedPassId(passes[0].id);
    }
  }, [passes, selectedPass, setSelectedPassId]);

  const filteredPasses = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) {
      return passes;
    }

    return passes.filter((pass) =>
      [pass.studentName, pass.studentId, pass.parentName, pass.pickupPerson, pass.passCode, pass.vehicleType, pass.purpose]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [passes, search]);

  const recentLogs = useMemo(
    () =>
      passes
        .flatMap((pass) =>
          pass.logs.map((log) => ({
            ...log,
            passCode: pass.passCode,
            studentName: pass.studentName,
          }))
        )
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
        .slice(0, 6),
    [passes]
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    if (name === "studentId") {
      const student = tenantStudents.find((item) => item.studentId === value);
      setFormData((current) => ({
        ...current,
        studentId: value,
        studentName: student?.name ?? "",
        grade: student?.grade ?? "",
      }));
      return;
    }

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const created = createGatePass(formData);
    if (created) {
      setPrintPassId(created.id);
      setFormData({
        studentId: "",
        studentName: "",
        parentName: "",
        pickupPerson: "",
        grade: "",
        vehicleType: vehicleTypes[0],
        purpose: "",
        gate: "Main Gate",
        validUntil: "",
      });
    }
  };

  const printablePass = passes.find((pass) => pass.id === printPassId) ?? selectedPass ?? passes[0] ?? null;
  const passToDisplay = printablePass ?? selectedPass ?? passes[0] ?? null;

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .gate-pass-printable,
          .gate-pass-printable * {
            visibility: visible !important;
          }
          .gate-pass-printable {
            position: absolute;
            inset: 0;
            margin: 0 !important;
            padding: 24px !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <PageHeader
        title="Gate Passes"
        subtitle={
          isParentAccess
            ? "View your issued gate pass, print it, and review its in/out audit trail."
            : "Generate parent gate passes, print a QR-style slip, and keep an in/out audit trail."
        }
      />

      {!isParentAccess && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-gray-600">Issued passes</p>
              <div className="mt-2 flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-600" />
                <p className="text-2xl">{passes.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-gray-600">Active passes</p>
              <div className="mt-2 flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <p className="text-2xl">{activePasses.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-gray-600">In / out logs</p>
              <div className="mt-2 flex items-center gap-3">
                <ArrowRightLeft className="h-5 w-5 text-violet-600" />
                <p className="text-2xl">{passes.reduce((count, pass) => count + pass.logs.length, 0)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-gray-600">Print-ready</p>
              <div className="mt-2 flex items-center gap-3">
                <Printer className="h-5 w-5 text-amber-600" />
                <p className="text-2xl">Yes</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!isParentAccess && (
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="no-print">
          <CardHeader>
            <CardTitle>Issue a new gate pass</CardTitle>
            <CardDescription>Create a QR-style pass for a parent or guardian and send them to the gate.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student</Label>
                  <select
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select a student</option>
                    {tenantStudents.map((student) => (
                      <option key={student.studentId} value={student.studentId}>
                        {student.name} · {student.studentId}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade level</Label>
                  <Input id="grade" name="grade" value={formData.grade} placeholder="Filled after selecting a student" readOnly required />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="parentName">Parent / guardian</Label>
                  <Input id="parentName" name="parentName" value={formData.parentName} onChange={handleChange} placeholder="Enter parent name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickupPerson">Pickup person</Label>
                  <Input id="pickupPerson" name="pickupPerson" value={formData.pickupPerson} onChange={handleChange} placeholder="Authorized adult" required />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle type</Label>
                  <select
                    id="vehicleType"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    required
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {vehicleTypes.map((vehicleType) => (
                      <option key={vehicleType} value={vehicleType}>
                        {vehicleType}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gate">Gate</Label>
                  <Input id="gate" name="gate" value={formData.gate} onChange={handleChange} placeholder="Main Gate" required />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="validUntil">Valid until</Label>
                  <Input id="validUntil" name="validUntil" type="datetime-local" value={formData.validUntil} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentName">Selected student</Label>
                  <Input id="studentName" name="studentName" value={formData.studentName} placeholder="Filled after selecting a student" readOnly required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Input id="purpose" name="purpose" value={formData.purpose} onChange={handleChange} placeholder="Parent conference, pickup, medical visit" required />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit">
                  <QrCode className="mr-2 h-4 w-4" />
                  Generate pass
                </Button>
                <Button type="button" variant="outline" onClick={() => printablePass && setPrintPassId(printablePass.id)}>
                  Preview latest pass
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pass audit trail</CardTitle>
            <CardDescription>Track each entry and exit against the issued pass.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by parent, student, or pass code"
              />
              <div className="flex items-center justify-between rounded-lg border px-4 py-2 text-sm text-gray-600">
                <span>Matching passes</span>
                <span className="font-medium text-gray-900">{filteredPasses.length}</span>
              </div>
            </div>

            <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
              {filteredPasses.map((pass) => (
                <button
                  key={pass.id}
                  type="button"
                  className={`w-full rounded-xl border p-4 text-left transition hover:border-blue-300 ${
                    selectedPass?.id === pass.id ? "border-blue-400 bg-blue-50/70" : "bg-white"
                  }`}
                  onClick={() => setSelectedPassId(pass.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{pass.studentName}</p>
                      <p className="text-xs text-gray-600">{pass.parentName} · {pass.passCode}</p>
                    </div>
                    <Badge variant={pass.status === "Checked Out" ? "secondary" : pass.status === "Checked In" ? "default" : "outline"}>
                      {pass.status}
                    </Badge>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-gray-600 md:grid-cols-2">
                    <div>
                      <span className="font-medium text-gray-900">Gate:</span> {pass.gate}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Vehicle:</span> {pass.vehicleType}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      )}

      {passToDisplay && (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="gate-pass-printable overflow-hidden border-slate-200 bg-slate-950 text-white shadow-2xl">
            <CardHeader className="border-b border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl text-white">Gate Pass</CardTitle>
                  <CardDescription className="text-slate-300">Admin-issued campus access pass</CardDescription>
                </div>
                <Badge className="bg-emerald-500 text-white hover:bg-emerald-500">Verified</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 p-6">
              <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                <div className="rounded-2xl bg-white p-3 shadow-lg">
                  <QrMatrix value={`${passToDisplay.passCode}-${passToDisplay.studentName}-${passToDisplay.parentName}`} />
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Pass code</p>
                    <p className="text-xl font-semibold text-white">{passToDisplay.passCode}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">Student</p>
                      <p className="font-medium text-white">{passToDisplay.studentName}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">Parent / guardian</p>
                      <p className="font-medium text-white">{passToDisplay.parentName}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">Pickup person</p>
                      <p className="font-medium text-white">{passToDisplay.pickupPerson}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">Grade</p>
                      <p className="font-medium text-white">{passToDisplay.grade}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-white/10" />

              <div className="grid gap-3 sm:grid-cols-4">
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Purpose</p>
                  <p className="mt-1 text-sm text-white">{passToDisplay.purpose}</p>
                </div>
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Gate</p>
                  <p className="mt-1 text-sm text-white">{passToDisplay.gate}</p>
                </div>
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Vehicle</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-white">
                    <Car className="h-4 w-4" />
                    {passToDisplay.vehicleType}
                  </p>
                </div>
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Valid until</p>
                  <p className="mt-1 text-sm text-white">{formatDateLabel(passToDisplay.validUntil)}</p>
                </div>
              </div>

              <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-4 text-sm text-slate-200">
                Present this pass at the gate. The log below records every entry and exit for the selected parent or guardian.
              </div>

              <div className="flex flex-wrap gap-3 no-print">
                <Button variant="secondary" onClick={() => setPrintPassId(passToDisplay.id)}>
                  <Printer className="mr-2 h-4 w-4" />
                  Select for print
                </Button>
                <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10" onClick={() => window.print()}>
                  <ScanLine className="mr-2 h-4 w-4" />
                  Print now
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {!isParentAccess && (
            <Card className="no-print">
              <CardHeader>
                <CardTitle>Gate actions</CardTitle>
                <CardDescription>Record when the pass holder enters or leaves campus.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button
                  onClick={() =>
                    recordGateMovement(
                      selectedPass.id,
                      "IN",
                      "Gate Officer",
                      selectedPass.gate,
                      "Entry confirmed at the gate."
                    )
                  }
                >
                  <ArrowRightLeft className="mr-2 h-4 w-4" />
                  Mark entry
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    recordGateMovement(
                      selectedPass.id,
                      "OUT",
                      "Gate Officer",
                      selectedPass.gate,
                      "Exit confirmed at the gate."
                    )
                  }
                >
                  <Clock3 className="mr-2 h-4 w-4" />
                  Mark exit
                </Button>
              </CardContent>
            </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Audit log</CardTitle>
                <CardDescription>Latest movements for {passToDisplay.studentName}.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {passToDisplay.logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                    <div className={`mt-0.5 rounded-full p-2 ${log.direction === "IN" ? "bg-emerald-100" : "bg-orange-100"}`}>
                      {log.direction === "IN" ? (
                        <ArrowRightLeft className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Clock3 className="h-4 w-4 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-medium text-gray-900">
                          {log.direction === "IN" ? "Entered" : "Exited"} through {log.gate}
                        </p>
                        <Badge variant="outline">{log.direction}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{log.note}</p>
                      <p className="mt-2 text-xs text-gray-500">
                        {log.timestamp} · logged by {log.actor}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {!isParentAccess && (
      <Card className="no-print">
        <CardHeader>
          <CardTitle>Recent gate activity</CardTitle>
          <CardDescription>Fast overview of the latest in/out movements across all passes.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {recentLogs.map((log) => (
            <div key={log.id} className="rounded-xl border bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-gray-900">{log.studentName}</p>
                <Badge variant={log.direction === "IN" ? "default" : "secondary"}>{log.direction}</Badge>
              </div>
              <p className="mt-1 text-sm text-gray-600">{log.passCode}</p>
              <p className="mt-2 text-sm text-gray-700">{log.note}</p>
              <p className="mt-2 text-xs text-gray-500">{log.timestamp}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      )}
    </div>
  );
}
