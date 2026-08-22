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
import { BookOpen, Download, Package, Search, Trash2, Upload } from "lucide-react";
import { showSuccessToast } from "@/app/utils/toastNotification";

interface BookItem {
  id: number;
  gradeLevel: string;
  schoolYear: string;
  title: string;
  subject: string;
  price: number;
  stock: number;
  required: boolean;
}

const initialBooks: BookItem[] = [
  { id: 1, gradeLevel: "Grade 10", schoolYear: "SY 2026-2027", title: "English 10 Reader", subject: "English", price: 620, stock: 34, required: true },
  { id: 2, gradeLevel: "Grade 10", schoolYear: "SY 2026-2027", title: "MAPEH Activity Book", subject: "MAPEH", price: 560, stock: 18, required: true },
  { id: 3, gradeLevel: "Grade 10", schoolYear: "SY 2026-2027", title: "Science Lab Manual 10", subject: "Science", price: 740, stock: 22, required: true },
  { id: 4, gradeLevel: "Grade 11", schoolYear: "SY 2026-2027", title: "General Mathematics Workbook", subject: "Mathematics", price: 780, stock: 44, required: true },
  { id: 5, gradeLevel: "Grade 11", schoolYear: "SY 2026-2027", title: "Oral Communication Reader", subject: "English", price: 650, stock: 38, required: true },
  { id: 6, gradeLevel: "Grade 11", schoolYear: "SY 2026-2027", title: "Earth Science Activity Manual", subject: "Science", price: 810, stock: 10, required: true },
  { id: 7, gradeLevel: "Grade 12", schoolYear: "SY 2026-2027", title: "Physics Laboratory Manual", subject: "Science", price: 920, stock: 27, required: true },
  { id: 8, gradeLevel: "Grade 12", schoolYear: "SY 2026-2027", title: "Research Project Guide", subject: "Research", price: 840, stock: 31, required: true },
  { id: 9, gradeLevel: "Grade 12", schoolYear: "SY 2026-2027", title: "Business Finance Workbook", subject: "ABM", price: 760, stock: 8, required: false },
];

const blankBook = {
  gradeLevel: "Grade 10",
  schoolYear: "SY 2026-2027",
  title: "",
  subject: "",
  price: "0",
  stock: "0",
  required: "true",
};

export function Books() {
  const [books, setBooks] = useState<BookItem[]>(initialBooks);
  const [searchQuery, setSearchQuery] = useState("");
  const [schoolYear, setSchoolYear] = useState("all");
  const [gradeLevel, setGradeLevel] = useState("all");
  const [newBook, setNewBook] = useState(blankBook);
  const [addOpen, setAddOpen] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  const filteredBooks = books.filter((book) => {
    const matchesSearch = `${book.title} ${book.subject}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = schoolYear === "all" || book.schoolYear === schoolYear;
    const matchesGrade = gradeLevel === "all" || book.gradeLevel === gradeLevel;
    return matchesSearch && matchesYear && matchesGrade;
  });

  const gradeGroups = Array.from(new Set(filteredBooks.map((book) => book.gradeLevel))).sort();
  const totalStock = filteredBooks.reduce((sum, book) => sum + book.stock, 0);
  const totalValue = filteredBooks.reduce((sum, book) => sum + book.stock * book.price, 0);

  const updateBook = (id: number, updates: Partial<BookItem>) => {
    setBooks((current) => current.map((book) => (book.id === id ? { ...book, ...updates } : book)));
  };

  const addBook = () => {
    if (!newBook.title.trim()) return;
    setBooks((current) => [
      ...current,
      {
        id: Date.now(),
        gradeLevel: newBook.gradeLevel,
        schoolYear: newBook.schoolYear,
        title: newBook.title,
        subject: newBook.subject || "General",
        price: Number(newBook.price) || 0,
        stock: Number(newBook.stock) || 0,
        required: newBook.required === "true",
      },
    ]);
    setNewBook(blankBook);
    setAddOpen(false);
    showSuccessToast("Book added", "The required book catalog was updated.");
  };

  const deleteBook = (id: number) => {
    setBooks((current) => current.filter((book) => book.id !== id));
    showSuccessToast("Book removed", "The book was removed from the grade list.");
  };

  const exportBooks = () => {
    const header = ["schoolYear", "gradeLevel", "title", "subject", "price", "stock", "required"];
    const rows = books.map((book) => [
      book.schoolYear,
      book.gradeLevel,
      book.title,
      book.subject,
      book.price,
      book.stock,
      book.required ? "yes" : "no",
    ]);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "required-books.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importBooks = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const rows = String(reader.result || "").split(/\r?\n/).slice(1).filter(Boolean);
      const imported = rows.map((row, index) => {
        const [schoolYear, gradeLevel, title, subject, price, stock, required] = row.split(",").map((cell) => cell.replace(/^"|"$/g, "").replace(/""/g, '"'));
        return {
          id: Date.now() + index,
          schoolYear: schoolYear || "SY 2026-2027",
          gradeLevel: gradeLevel || "Grade 10",
          title: title || "Imported Book",
          subject: subject || "General",
          price: Number(price) || 0,
          stock: Number(stock) || 0,
          required: required?.toLowerCase() !== "no",
        };
      });
      setBooks(imported);
      showSuccessToast("Books imported", `${imported.length} book rows loaded.`);
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={BookOpen}
        title="Books"
        subtitle="Control required student books by school year and grade level."
        actions={
          <>
            <input ref={importRef} type="file" accept=".csv" className="hidden" onChange={importBooks} />
            <Button variant="outline" onClick={() => importRef.current?.click()}>
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" onClick={exportBooks}>
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Package className="h-4 w-4" />
                  Add Book
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Required Book</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>School Year</Label>
                      <Select value={newBook.schoolYear} onValueChange={(value) => setNewBook({ ...newBook, schoolYear: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SY 2026-2027">SY 2026-2027</SelectItem>
                          <SelectItem value="SY 2025-2026">SY 2025-2026</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Grade Level</Label>
                      <Select value={newBook.gradeLevel} onValueChange={(value) => setNewBook({ ...newBook, gradeLevel: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Grade 10">Grade 10</SelectItem>
                          <SelectItem value="Grade 11">Grade 11</SelectItem>
                          <SelectItem value="Grade 12">Grade 12</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Book Name</Label>
                    <Input value={newBook.title} onChange={(event) => setNewBook({ ...newBook, title: event.target.value })} />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input value={newBook.subject} onChange={(event) => setNewBook({ ...newBook, subject: event.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Price</Label>
                      <Input type="number" value={newBook.price} onChange={(event) => setNewBook({ ...newBook, price: event.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Stock</Label>
                      <Input type="number" value={newBook.stock} onChange={(event) => setNewBook({ ...newBook, stock: event.target.value })} />
                    </div>
                  </div>
                  <Button onClick={addBook}>Save Book</Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="p-5"><p className="text-sm font-medium text-slate-500">Book Rows</p><p className="mt-2 text-3xl font-black text-slate-900">{filteredBooks.length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm font-medium text-slate-500">Grade Levels</p><p className="mt-2 text-3xl font-black text-slate-900">{gradeGroups.length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm font-medium text-slate-500">Available Stock</p><p className="mt-2 text-3xl font-black text-slate-900">{totalStock}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm font-medium text-slate-500">Inventory Value</p><p className="mt-2 text-3xl font-black text-slate-900">PHP {totalValue.toLocaleString()}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle>Required Books by Grade Level</CardTitle>
            <div className="grid gap-2 sm:grid-cols-[180px_180px_1fr] lg:w-[620px]">
              <Select value={schoolYear} onValueChange={setSchoolYear}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All School Years</SelectItem>
                  <SelectItem value="SY 2026-2027">SY 2026-2027</SelectItem>
                  <SelectItem value="SY 2025-2026">SY 2025-2026</SelectItem>
                </SelectContent>
              </Select>
              <Select value={gradeLevel} onValueChange={setGradeLevel}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {Array.from(new Set(books.map((book) => book.gradeLevel))).sort().map((grade) => (
                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input className="pl-9" placeholder="Search title or subject..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {gradeGroups.map((grade) => {
            const groupBooks = filteredBooks.filter((book) => book.gradeLevel === grade);
            const packageAmount = groupBooks.reduce((sum, book) => sum + book.price, 0);
            const lowStock = groupBooks.filter((book) => book.stock <= 10).length;

            return (
              <div key={grade} className="overflow-hidden rounded-lg border">
                <div className="flex flex-col gap-2 border-b bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{grade}</h3>
                    <p className="text-sm text-slate-500">Required book list controls</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="info">{groupBooks.length} books</Badge>
                    <Badge variant={lowStock ? "warning" : "success"}>{lowStock ? `${lowStock} low stock` : "Stock ready"}</Badge>
                    <Badge variant="muted">Package PHP {packageAmount.toLocaleString()}</Badge>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book Name</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell><Input value={book.title} onChange={(event) => updateBook(book.id, { title: event.target.value })} /></TableCell>
                        <TableCell><Input value={book.subject} onChange={(event) => updateBook(book.id, { subject: event.target.value })} /></TableCell>
                        <TableCell>
                          <Select value={book.required ? "true" : "false"} onValueChange={(value) => updateBook(book.id, { required: value === "true" })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Required</SelectItem>
                              <SelectItem value="false">Optional</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell><Input type="number" value={book.stock} onChange={(event) => updateBook(book.id, { stock: Number(event.target.value) || 0 })} /></TableCell>
                        <TableCell><Input type="number" value={book.price} onChange={(event) => updateBook(book.id, { price: Number(event.target.value) || 0 })} /></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => deleteBook(book.id)}>
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
