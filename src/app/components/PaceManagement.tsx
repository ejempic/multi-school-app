import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { showSuccessToast } from "../utils/toastNotification";
import { Download, Upload, Plus, Trash2, FileSpreadsheet, Edit2 } from "lucide-react";
import { PageHeader } from "./ui/page-header";

interface PaceWorkbook {
  subject: string;
  grade: string;
  paces: string; // Comma separated list of PACE numbers
}

export function PaceManagement() {
  const [workbooks, setWorkbooks] = useState<PaceWorkbook[]>([
    { subject: "Math", grade: "GRADE 1", paces: "1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012" },
    { subject: "Math", grade: "GRADE 2", paces: "1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020, 1021, 1022, 1023, 1024" },
    { subject: "Math", grade: "GRADE 3", paces: "1037, 1038, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048" },
    { subject: "Literature", grade: "GRADE 2", paces: "1019, 1020, 1021, 1022, 1023, 1024" },
  ]);

  const [newWorkbook, setNewWorkbook] = useState<PaceWorkbook>({
    subject: "",
    grade: "",
    paces: ""
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingPaces, setEditingPaces] = useState("");

  const handleAddWorkbook = () => {
    if (!newWorkbook.subject || !newWorkbook.grade || !newWorkbook.paces) return;
    setWorkbooks([...workbooks, { ...newWorkbook }]);
    setNewWorkbook({ subject: "", grade: "", paces: "" });
    showSuccessToast("Workbook Added", "New PACE workbook has been added to the system.");
  };

  const handleRemoveWorkbook = (index: number) => {
    const newWorkbooks = [...workbooks];
    newWorkbooks.splice(index, 1);
    setWorkbooks(newWorkbooks);
  };

  const handleUpdateWorkbook = (index: number, field: keyof PaceWorkbook, value: any) => {
    const newWorkbooks = [...workbooks];
    newWorkbooks[index] = { ...newWorkbooks[index], [field]: value };
    setWorkbooks(newWorkbooks);
  };

  const handleSavePaces = () => {
    if (editingIndex !== null) {
      handleUpdateWorkbook(editingIndex, "paces", editingPaces);
      setEditingIndex(null);
      showSuccessToast("PACE Numbers Updated", "The numbers for this workbook have been updated.");
    }
  };

  const exportToCSV = () => {
    const headers = ["Subject,Grade,PACE Numbers"];
    const rows = workbooks.map(s => `${s.subject},${s.grade},"${s.paces}"`);
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pace_workbooks.csv");
    document.body.appendChild(link);
    link.click();
    showSuccessToast("Export Successful", "PACE workbooks exported to CSV.");
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n").slice(1); // Skip header
      const newWorkbooks: PaceWorkbook[] = lines
        .filter(line => line.trim())
        .map(line => {
          // Handle quoted CSV fields for PACE numbers
          const parts = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
          if (!parts || parts.length < 3) return null;
          
          return {
            subject: parts[0].trim(),
            grade: parts[1].trim(),
            paces: parts[2].replace(/"/g, "").trim()
          };
        })
        .filter((s): s is PaceWorkbook => s !== null);
      
      setWorkbooks(newWorkbooks);
      showSuccessToast("Import Successful", `Imported ${newWorkbooks.length} PACE workbooks.`);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="PACE Management"
        subtitle="Configure the specific PACE numbers for each subject and grade."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImportCSV}
              />
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" /> Import CSV
              </Button>
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add New Workbook Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Add New Workbook</CardTitle>
            <CardDescription>Define specific PACE numbers for a subject.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject Name</label>
              <Input 
                placeholder="e.g. Math" 
                value={newWorkbook.subject}
                onChange={(e) => setNewWorkbook({...newWorkbook, subject: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Grade Level</label>
              <Input 
                placeholder="e.g. GRADE 1" 
                value={newWorkbook.grade}
                onChange={(e) => setNewWorkbook({...newWorkbook, grade: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">PACE Numbers (Comma Separated)</label>
              <textarea 
                className="w-full min-h-[100px] p-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 1037, 1038, 1039..." 
                value={newWorkbook.paces}
                onChange={(e) => setNewWorkbook({...newWorkbook, paces: e.target.value})}
              />
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleAddWorkbook}>
              <Plus className="h-4 w-4 mr-2" /> Add Workbook
            </Button>
          </CardContent>
        </Card>

        {/* Workbooks Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Configured Workbooks</CardTitle>
              <CardDescription>All defined PACE workbooks in the system.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Subject</TableHead>
                    <TableHead className="w-1/4">Grade</TableHead>
                    <TableHead>PACE Numbers</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workbooks.map((seq, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-sm">
                        {seq.subject}
                      </TableCell>
                      <TableCell className="text-sm">
                        {seq.grade}
                      </TableCell>
                      <TableCell>
                        <Input 
                          className="h-8 p-0 border-none bg-transparent shadow-none focus-visible:ring-0 text-xs text-blue-600 truncate max-w-[200px]"
                          value={seq.paces}
                          readOnly
                        />
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Dialog open={editingIndex === index} onOpenChange={(open) => {
                          if (open) {
                            setEditingIndex(index);
                            setEditingPaces(seq.paces);
                          } else {
                            setEditingIndex(null);
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle>Edit PACE Numbers</DialogTitle>
                              <DialogDescription>
                                {seq.subject} - {seq.grade}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <Label className="mb-2 block">PACE Numbers (Comma Separated)</Label>
                              <Textarea 
                                className="min-h-[200px] font-mono text-sm"
                                value={editingPaces}
                                onChange={(e) => setEditingPaces(e.target.value)}
                                placeholder="e.g. 1001, 1002, 1003..."
                              />
                              <p className="text-[10px] text-gray-500 mt-2 italic">
                                Separate each PACE number with a comma. Space after comma is optional.
                              </p>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setEditingIndex(null)}>Cancel</Button>
                              <Button onClick={handleSavePaces}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleRemoveWorkbook(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
