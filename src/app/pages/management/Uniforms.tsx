import { useRef, useState } from "react";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { PageHeader } from "@/app/components/ui/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Download, ImagePlus, Package, Search, Shirt, Trash2, Upload } from "lucide-react";
import { showSuccessToast } from "@/app/utils/toastNotification";

interface UniformItem {
  id: number;
  level: string;
  schoolYear: string;
  item: string;
  sizes: string;
  price: number;
  stock: number;
  photo: string;
}

const initialUniforms: UniformItem[] = [
  { id: 1, level: "Grade School", schoolYear: "SY 2026-2027", item: "Daily Uniform Set", sizes: "XS - XL", price: 1450, stock: 86, photo: "" },
  { id: 2, level: "Grade School", schoolYear: "SY 2026-2027", item: "PE Uniform Set", sizes: "XS - XL", price: 950, stock: 42, photo: "" },
  { id: 3, level: "Junior High", schoolYear: "SY 2026-2027", item: "JHS Daily Uniform", sizes: "S - 2XL", price: 1550, stock: 54, photo: "" },
  { id: 4, level: "Junior High", schoolYear: "SY 2026-2027", item: "School Jacket", sizes: "S - XL", price: 1200, stock: 12, photo: "" },
  { id: 5, level: "Senior High", schoolYear: "SY 2026-2027", item: "SHS Polo Uniform", sizes: "S - 2XL", price: 1650, stock: 30, photo: "" },
  { id: 6, level: "Senior High", schoolYear: "SY 2026-2027", item: "Formal Vest", sizes: "S - XL", price: 890, stock: 9, photo: "" },
];

const blankUniform = {
  level: "Grade School",
  schoolYear: "SY 2026-2027",
  item: "",
  sizes: "",
  price: "0",
  stock: "0",
  photo: "",
};

const samplePhoto = (color: string, accent: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'%3E%3Crect width='240' height='240' rx='28' fill='%23f8fafc'/%3E%3Cpath d='M85 52h70l28 32-23 29-9-8v83H89v-83l-9 8-23-29 28-32Z' fill='%23${color}'/%3E%3Cpath d='M105 52h30l-15 38-15-38Z' fill='%23${accent}'/%3E%3Cpath d='M91 132h58v10H91zM91 151h58v10H91z' fill='%23ffffff' opacity='.78'/%3E%3C/svg%3E`;

const dummyUniforms = [
  { level: "Grade School", item: "Daily Uniform Set", sizes: "XS - XL", price: "1450", stock: "80", photo: samplePhoto("1d4ed8", "facc15") },
  { level: "Grade School", item: "PE Uniform Set", sizes: "XS - XL", price: "950", stock: "45", photo: samplePhoto("16a34a", "ffffff") },
  { level: "Junior High", item: "JHS Daily Uniform", sizes: "S - 2XL", price: "1550", stock: "50", photo: samplePhoto("334155", "60a5fa") },
  { level: "Junior High", item: "School Jacket", sizes: "S - XL", price: "1200", stock: "20", photo: samplePhoto("0f172a", "f97316") },
  { level: "Senior High", item: "SHS Polo Uniform", sizes: "S - 2XL", price: "1650", stock: "35", photo: samplePhoto("7c2d12", "fef3c7") },
  { level: "Senior High", item: "Formal Vest", sizes: "S - XL", price: "890", stock: "18", photo: samplePhoto("4338ca", "e0e7ff") },
  { level: "Senior High", item: "Graduation Necktie", sizes: "Standard", price: "180", stock: "100", photo: samplePhoto("be123c", "ffffff") },
];

export function Uniforms() {
  const [uniforms, setUniforms] = useState<UniformItem[]>(initialUniforms);
  const [searchQuery, setSearchQuery] = useState("");
  const [schoolYear, setSchoolYear] = useState("all");
  const [level, setLevel] = useState("all");
  const [newUniform, setNewUniform] = useState(blankUniform);
  const [sampleSearch, setSampleSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  const filteredUniforms = uniforms.filter((uniform) => {
    const matchesSearch = `${uniform.item} ${uniform.sizes}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = schoolYear === "all" || uniform.schoolYear === schoolYear;
    const matchesLevel = level === "all" || uniform.level === level;
    return matchesSearch && matchesYear && matchesLevel;
  });

  const levelGroups = Array.from(new Set(filteredUniforms.map((uniform) => uniform.level))).sort();
  const totalStock = filteredUniforms.reduce((sum, uniform) => sum + uniform.stock, 0);
  const lowStock = filteredUniforms.filter((uniform) => uniform.stock <= 12).length;

  const updateUniform = (id: number, updates: Partial<UniformItem>) => {
    setUniforms((current) => current.map((uniform) => (uniform.id === id ? { ...uniform, ...updates } : uniform)));
  };

  const handlePhotoUpload = (id: number, file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateUniform(id, { photo: String(reader.result || "") });
    reader.readAsDataURL(file);
  };

  const handleNewPhotoUpload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setNewUniform((current) => ({ ...current, photo: String(reader.result || "") }));
    reader.readAsDataURL(file);
  };

  const sampleUniforms = dummyUniforms.filter((uniform) =>
    `${uniform.item} ${uniform.level}`.toLowerCase().includes(sampleSearch.toLowerCase()),
  );

  const addUniform = () => {
    if (!newUniform.item.trim()) return;
    setUniforms((current) => [
      ...current,
      {
        id: Date.now(),
        level: newUniform.level,
        schoolYear: newUniform.schoolYear,
        item: newUniform.item,
        sizes: newUniform.sizes || "Standard",
        price: Number(newUniform.price) || 0,
        stock: Number(newUniform.stock) || 0,
        photo: newUniform.photo,
      },
    ]);
    setNewUniform(blankUniform);
    setAddOpen(false);
    showSuccessToast("Uniform added", "The uniform catalog was updated.");
  };

  const deleteUniform = (id: number) => {
    setUniforms((current) => current.filter((uniform) => uniform.id !== id));
    showSuccessToast("Uniform removed", "The uniform item was removed.");
  };

  const exportUniforms = () => {
    const header = ["schoolYear", "level", "item", "sizes", "price", "stock"];
    const rows = uniforms.map((uniform) => [uniform.schoolYear, uniform.level, uniform.item, uniform.sizes, uniform.price, uniform.stock]);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "uniforms.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importUniforms = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const rows = String(reader.result || "").split(/\r?\n/).slice(1).filter(Boolean);
      const imported = rows.map((row, index) => {
        const [schoolYear, level, item, sizes, price, stock] = row.split(",").map((cell) => cell.replace(/^"|"$/g, "").replace(/""/g, '"'));
        return {
          id: Date.now() + index,
          schoolYear: schoolYear || "SY 2026-2027",
          level: level || "Grade School",
          item: item || "Imported Uniform",
          sizes: sizes || "Standard",
          price: Number(price) || 0,
          stock: Number(stock) || 0,
          photo: "",
        };
      });
      setUniforms(imported);
      showSuccessToast("Uniforms imported", `${imported.length} uniform rows loaded.`);
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Shirt}
        title="Uniforms"
        subtitle="Control uniform photos, prices, stocks, and level availability."
        actions={
          <>
            <input ref={importRef} type="file" accept=".csv" className="hidden" onChange={importUniforms} />
            <Button variant="outline" onClick={() => importRef.current?.click()}>
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" onClick={exportUniforms}>
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Package className="h-4 w-4" />
                  Add Uniform
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Uniform</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="rounded-lg border bg-slate-50 p-3">
                    <Label htmlFor="dummy-uniform-search">Search dummy uniform</Label>
                    <Input
                      id="dummy-uniform-search"
                      className="mt-2 bg-white"
                      placeholder="Try Daily Uniform, PE, Jacket, Vest..."
                      value={sampleSearch}
                      onChange={(event) => setSampleSearch(event.target.value)}
                    />
                    <div className="mt-3 flex max-h-28 flex-wrap gap-2 overflow-y-auto">
                      {sampleUniforms.map((uniform) => (
                        <button
                          key={`${uniform.level}-${uniform.item}`}
                          type="button"
                          onClick={() => setNewUniform({ ...newUniform, ...uniform })}
                          className="rounded-full border bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-700"
                        >
                          {uniform.item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
                    <div className="space-y-2">
                      <Label>Photo</Label>
                      <label className="flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-400 transition-colors hover:border-blue-300 hover:text-blue-600">
                        {newUniform.photo ? (
                          <img src={newUniform.photo} alt="Uniform preview" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-xs font-semibold">
                            <ImagePlus className="h-6 w-6" />
                            Upload
                          </div>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={(event) => handleNewPhotoUpload(event.target.files?.[0])} />
                      </label>
                    </div>
                    <div className="space-y-2">
                      <Label>Uniform Name</Label>
                      <Input value={newUniform.item} onChange={(event) => setNewUniform({ ...newUniform, item: event.target.value })} />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>School Year</Label>
                      <Select value={newUniform.schoolYear} onValueChange={(value) => setNewUniform({ ...newUniform, schoolYear: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SY 2026-2027">SY 2026-2027</SelectItem>
                          <SelectItem value="SY 2025-2026">SY 2025-2026</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Level</Label>
                      <Select value={newUniform.level} onValueChange={(value) => setNewUniform({ ...newUniform, level: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Grade School">Grade School</SelectItem>
                          <SelectItem value="Junior High">Junior High</SelectItem>
                          <SelectItem value="Senior High">Senior High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Sizes</Label>
                      <Input value={newUniform.sizes} onChange={(event) => setNewUniform({ ...newUniform, sizes: event.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Price</Label>
                      <Input type="number" value={newUniform.price} onChange={(event) => setNewUniform({ ...newUniform, price: event.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Stock</Label>
                      <Input type="number" value={newUniform.stock} onChange={(event) => setNewUniform({ ...newUniform, stock: event.target.value })} />
                    </div>
                  </div>
                  <Button onClick={addUniform}>Save Uniform</Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="p-5"><p className="text-sm font-medium text-slate-500">Uniform Rows</p><p className="mt-2 text-3xl font-black text-slate-900">{filteredUniforms.length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm font-medium text-slate-500">Levels</p><p className="mt-2 text-3xl font-black text-slate-900">{levelGroups.length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm font-medium text-slate-500">Available Stock</p><p className="mt-2 text-3xl font-black text-slate-900">{totalStock}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm font-medium text-slate-500">Low Stock</p><p className="mt-2 text-3xl font-black text-slate-900">{lowStock}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle>Uniform Catalog by Level</CardTitle>
            <div className="grid gap-2 sm:grid-cols-[180px_180px_1fr] lg:w-[620px]">
              <Select value={schoolYear} onValueChange={setSchoolYear}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All School Years</SelectItem>
                  <SelectItem value="SY 2026-2027">SY 2026-2027</SelectItem>
                  <SelectItem value="SY 2025-2026">SY 2025-2026</SelectItem>
                </SelectContent>
              </Select>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {Array.from(new Set(uniforms.map((uniform) => uniform.level))).sort().map((levelName) => (
                    <SelectItem key={levelName} value={levelName}>{levelName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input className="pl-9" placeholder="Search uniform item..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {levelGroups.map((levelName) => {
            const groupItems = filteredUniforms.filter((uniform) => uniform.level === levelName);
            return (
              <div key={levelName} className="overflow-hidden rounded-lg border">
                <div className="flex flex-col gap-2 border-b bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{levelName}</h3>
                    <p className="text-sm text-slate-500">Uniform catalog controls</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="info">{groupItems.length} items</Badge>
                    <Badge variant={groupItems.some((item) => item.stock <= 12) ? "warning" : "success"}>
                      {groupItems.some((item) => item.stock <= 12) ? "Needs restock" : "Stock ready"}
                    </Badge>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Photo</TableHead>
                      <TableHead>Uniform</TableHead>
                      <TableHead>Sizes</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <label className="flex h-14 w-14 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-400 transition-colors hover:border-blue-300 hover:text-blue-600">
                            {item.photo ? <img src={item.photo} alt={item.item} className="h-full w-full object-cover" /> : <ImagePlus className="h-5 w-5" />}
                            <input type="file" accept="image/*" className="hidden" onChange={(event) => handlePhotoUpload(item.id, event.target.files?.[0])} />
                          </label>
                        </TableCell>
                        <TableCell><Input value={item.item} onChange={(event) => updateUniform(item.id, { item: event.target.value })} /></TableCell>
                        <TableCell><Input value={item.sizes} onChange={(event) => updateUniform(item.id, { sizes: event.target.value })} /></TableCell>
                        <TableCell><Input type="number" value={item.stock} onChange={(event) => updateUniform(item.id, { stock: Number(event.target.value) || 0 })} /></TableCell>
                        <TableCell><Input type="number" value={item.price} onChange={(event) => updateUniform(item.id, { price: Number(event.target.value) || 0 })} /></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => deleteUniform(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
