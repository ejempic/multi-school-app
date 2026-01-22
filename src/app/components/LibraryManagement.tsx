import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { cn } from "./ui/utils";
import { Plus, Search, BookOpen, Clock, AlertCircle, UserCheck, Bell, BookUp, Settings, Download, Upload, Trash2, Check, ChevronsUpDown } from "lucide-react";
import { showSuccessToast, showInfoToast } from "../utils/toastNotification";
import { PageHeader } from "./ui/page-header";

// Mock Student Database
const mockStudents = [
  { id: "STU001", name: "Emma Watson", grade: "12-A" },
  { id: "STU002", name: "Liam Johnson", grade: "11-B" },
  { id: "STU003", name: "Olivia Brown", grade: "10-A" },
  { id: "STU004", name: "Noah Davis", grade: "12-B" },
  { id: "STU005", name: "Ava Wilson", grade: "11-A" },
  { id: "STU006", name: "Ethan Martinez", grade: "10-C" },
];

interface Book {
  id: number;
  accessionNumber: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  status: "Available" | "Borrowed" | "Reserved" | "Lost";
  location: string;
}

interface Loan {
  id: number;
  bookId: number;
  bookTitle: string;
  studentName: string;
  borrowDate: string;
  dueDate: string;
  status: "Active" | "Overdue" | "Returned";
}

interface VisitorLog {
  id: number;
  studentName: string;
  studentId: string;
  timeIn: string;
  timeOut: string | null;
  purpose: string;
  date: string;
}

export function LibraryManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("visitors"); // Default to logs
  const [loanDuration, setLoanDuration] = useState(7); // Default loan period in days

  // Mock Data
  const [books, setBooks] = useState<Book[]>([
    { id: 1, accessionNumber: "LIB-001", title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "978-0446310789", category: "Fiction", status: "Available", location: "A-12" },
    { id: 2, accessionNumber: "LIB-002", title: "1984", author: "George Orwell", isbn: "978-0451524935", category: "Fiction", status: "Borrowed", location: "A-14" },
    { id: 3, accessionNumber: "LIB-003", title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "978-0743273565", category: "Fiction", status: "Available", location: "B-05" },
    { id: 4, accessionNumber: "LIB-004", title: "Introduction to Calculus", author: "James Stewart", isbn: "978-1305480513", category: "Textbook", status: "Borrowed", location: "C-22" },
    { id: 5, accessionNumber: "LIB-005", title: "World History", author: "William Duiker", isbn: "978-1133606581", category: "Textbook", status: "Available", location: "C-23" },
  ]);

  const [loans, setLoans] = useState<Loan[]>([
    { id: 1, bookId: 2, bookTitle: "1984", studentName: "Liam Johnson", borrowDate: "2024-03-20", dueDate: "2024-03-27", status: "Active" },
    { id: 2, bookId: 4, bookTitle: "Introduction to Calculus", studentName: "Noah Davis", borrowDate: "2024-03-15", dueDate: "2024-03-22", status: "Overdue" },
  ]);

  const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>([
    { id: 1, studentName: "Liam Johnson", studentId: "STU002", timeIn: "08:30 AM", timeOut: "09:15 AM", purpose: "Study", date: new Date().toISOString().split("T")[0] },
    { id: 2, studentName: "Ava Wilson", studentId: "STU005", timeIn: "10:00 AM", timeOut: null, purpose: "Research", date: new Date().toISOString().split("T")[0] },
  ]);

  // Visitor Log State
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [newLog, setNewLog] = useState({ studentName: "", purpose: "" }); // studentName will store ID for lookup

  // Loan State
  const [isLoanOpen, setIsLoanOpen] = useState(false);
  const [newLoan, setNewLoan] = useState({ studentName: "", bookId: "" });
  const [openBookSelect, setOpenBookSelect] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // New Book State
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    location: "",
    copies: 1
  });

  const handleLogVisitor = () => {
    const student = mockStudents.find(s => s.id === newLog.studentName);
    const log: VisitorLog = {
      id: visitorLogs.length + 1,
      studentName: student?.name || "Unknown",
      studentId: student?.id || "N/A",
      timeIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeOut: null,
      purpose: newLog.purpose,
      date: new Date().toISOString().split("T")[0]
    };
    setVisitorLogs([log, ...visitorLogs]);
    setIsLogOpen(false);
    setNewLog({ studentName: "", purpose: "" });
    showSuccessToast("Student library visit logged");
  };
  
  const handleAddBook = () => {
    // Basic implementation to add x copies
    const addedBooks: Book[] = [];
    for(let i=0; i<newBook.copies; i++) {
        addedBooks.push({
            id: books.length + 1 + i,
            accessionNumber: `LIB-${String(books.length + 1 + i).padStart(3, '0')}`,
            title: newBook.title,
            author: newBook.author,
            isbn: newBook.isbn,
            category: newBook.category,
            status: "Available",
            location: newBook.location
        });
    }
    setBooks([...books, ...addedBooks]);
    setIsAddBookOpen(false);
    setNewBook({ title: "", author: "", isbn: "", category: "", location: "", copies: 1 });
    showSuccessToast(`${newBook.copies} book(s) added to inventory`);
  };

  const handleExportBooks = () => {
      // Mock CSV Export
      const headers = ["ID", "Accession", "Title", "Author", "ISBN", "Status"];
      const rows = books.map(b => [b.id, b.accessionNumber, b.title, b.author, b.isbn, b.status]);
      const csvContent = "data:text/csv;charset=utf-8," + 
          [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "library_books.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showSuccessToast("Library inventory exported");
  };
  
  // Mock Import - just simulation
  const handleImportBooks = () => {
      showInfoToast("Use the file picker to upload .csv or .xlsx (Mock)");
  };

  const handleTimeOut = (id: number) => {
    setVisitorLogs(visitorLogs.map(log => 
      log.id === id ? { ...log, timeOut: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : log
    ));
  };

  const handleNotifyStudent = (studentName: string, bookTitle: string) => {
    showInfoToast(`Notification sent to ${studentName}: "${bookTitle}" is due for return.`);
  };

  const handleBorrowBook = () => {
    const selectedBook = books.find(b => b.id.toString() === newLoan.bookId);
    if (!selectedBook) return;
    
    // Update book status
    setBooks(books.map(b => b.id === selectedBook.id ? { ...b, status: "Borrowed" } as Book : b));

    const loan: Loan = {
        id: loans.length + 1,
        bookId: selectedBook.id,
        bookTitle: selectedBook.title,
        studentName: newLoan.studentName,
        borrowDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + loanDuration * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // dynamic duration
        status: "Active"
    };

    setLoans([loan, ...loans]);
    setIsLoanOpen(false);
    setNewLoan({ studentName: "", bookId: "" });
    showSuccessToast(`Book "${selectedBook.title}" borrowed to ${newLoan.studentName}`);
  };

  const handleReturnBook = (id: number, bookId: number) => {
    setLoans(loans.map(l => l.id === id ? { ...l, status: "Returned" } as Loan : l));
    // Make book available again
    setBooks(books.map(b => b.id === bookId ? { ...b, status: "Available" } as Book : b));
    showSuccessToast("Book returned successfully");
  };

  const handleRenewBook = (id: number) => {
    setLoans(loans.map(l => {
        if (l.id === id) {
            const currentDue = new Date(l.dueDate);
            const newDue = new Date(currentDue.setDate(currentDue.getDate() + loanDuration)); // Extend by setting days
            return {
                ...l,
                dueDate: newDue.toISOString().split('T')[0],
                status: "Active" // Reset overdue status if renewed
            };
        }
        return l;
    }));
    showSuccessToast(`Loan renewed for ${loanDuration} days`);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.isbn.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Library Log System"
        subtitle="Monitor student visits and book circulation"
        actions={
          <div className="flex gap-2">
            
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Settings className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Library Settings</DialogTitle>
                        <DialogDescription>Configure system defaults.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label>Default Loan Period (Days)</Label>
                        <Input 
                            type="number" 
                            min={1} 
                            value={loanDuration} 
                            onChange={(e) => setLoanDuration(parseInt(e.target.value) || 7)}
                            className="mt-2" 
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={() => { setIsSettingsOpen(false); showSuccessToast("Settings saved"); }}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isLogOpen} onOpenChange={setIsLogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                <UserCheck className="mr-2 h-4 w-4" />
                Log Visit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Log Student Visit</DialogTitle>
                <DialogDescription>Record a student entering the library.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label>Student</Label>
                    <Select value={newLog.studentName} onValueChange={(val) => setNewLog({...newLog, studentName: val})}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select student..." />
                        </SelectTrigger>
                        <SelectContent>
                            {mockStudents.map((s) => (
                                <SelectItem key={s.id} value={s.id}>{s.name} ({s.grade})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label>Purpose</Label>
                    <Select value={newLog.purpose} onValueChange={(val) => setNewLog({...newLog, purpose: val})}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select purpose..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Study">Study</SelectItem>
                            <SelectItem value="Research">Research</SelectItem>
                            <SelectItem value="Reading">Leisure Reading</SelectItem>
                            <SelectItem value="Borrowing">Borrowing/Returning</SelectItem>
                            <SelectItem value="Printing">Printing / Computer Use</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={handleLogVisitor} disabled={!newLog.studentName || !newLog.purpose}>Check In</Button>
                </div>
            </DialogContent>
            </Dialog>

            <Dialog open={isLoanOpen} onOpenChange={setIsLoanOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <BookUp className="mr-2 h-4 w-4" />
                        Borrow Book
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Borrow Book</DialogTitle>
                        <DialogDescription>Check out a book for a student.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Student Name</Label>
                            <Select value={newLoan.studentName} onValueChange={(val) => setNewLoan({...newLoan, studentName: val})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select student..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockStudents.map((s) => (
                                        <SelectItem key={s.id} value={s.name}>{s.name} ({s.grade})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Select Book</Label>
                            <Popover open={openBookSelect} onOpenChange={setOpenBookSelect}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openBookSelect}
                                        className="justify-between w-full"
                                    >
                                        {newLoan.bookId
                                            ? books.find((book) => book.id.toString() === newLoan.bookId)?.title
                                            : "Choose a book..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-[400px]">
                                    <Command>
                                        <CommandInput placeholder="Search book by title or accession..." />
                                        <CommandList>
                                            <CommandEmpty>No book found.</CommandEmpty>
                                            <CommandGroup>
                                                {books.filter(b => b.status === "Available").map((book) => (
                                                    <CommandItem
                                                        key={book.id}
                                                        value={`${book.title} ${book.accessionNumber}`}
                                                        onSelect={() => {
                                                            setNewLoan({...newLoan, bookId: book.id.toString()})
                                                            setOpenBookSelect(false)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                newLoan.bookId === book.id.toString() ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {book.title} - {book.accessionNumber}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Button onClick={handleBorrowBook} disabled={!newLoan.studentName || !newLoan.bookId}>Confirm Borrow</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currently Inside</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visitorLogs.filter(v => v.timeOut === null).length}</div>
            <p className="text-xs text-muted-foreground">Students in library</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loans.filter(l => l.status === "Active" || l.status === "Overdue").length}</div>
            <p className="text-xs text-muted-foreground">Books checked out</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loans.filter(l => l.status === "Overdue").length}</div>
            <p className="text-xs text-muted-foreground text-destructive">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{books.length}</div>
            <p className="text-xs text-muted-foreground">Titles in inventory</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="visitors" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="visitors">Visitor Log</TabsTrigger>
          <TabsTrigger value="circulation">Circulation</TabsTrigger>
          <TabsTrigger value="inventory">Book Inventory</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visitors" className="space-y-4">
           <Card>
            <CardHeader>
              <CardTitle>Daily Visitor Logs</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Time In</TableHead>
                    <TableHead>Time Out</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visitorLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                         <div className="font-medium">{log.studentName}</div>
                         <div className="text-xs text-muted-foreground">{log.studentId}</div>
                      </TableCell>
                      <TableCell>{log.purpose}</TableCell>
                      <TableCell>{log.timeIn}</TableCell>
                      <TableCell>{log.timeOut || <Badge variant="secondary">Active</Badge>}</TableCell>
                      <TableCell>
                        {!log.timeOut && (
                            <Button size="sm" variant="outline" onClick={() => handleTimeOut(log.id)}>Check Out</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="circulation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Circulation Desk</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book Title</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Borrowed</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans.filter(l => l.status !== "Returned").map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell className="font-medium">{loan.bookTitle}</TableCell>
                      <TableCell>{loan.studentName}</TableCell>
                      <TableCell>{loan.borrowDate}</TableCell>
                      <TableCell className={loan.status === "Overdue" ? "text-red-600 font-bold" : ""}>
                        {loan.dueDate}
                      </TableCell>
                      <TableCell>
                        <Badge variant={loan.status === "Overdue" ? "destructive" : "secondary"}>
                          {loan.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleReturnBook(loan.id, loan.bookId)}>Return</Button>
                            <Button size="sm" variant="outline" onClick={() => handleRenewBook(loan.id)}>Renew</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search inventory..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8" 
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExportBooks}>
                        <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                    <Button variant="outline" onClick={handleImportBooks}>
                        <Upload className="mr-2 h-4 w-4" /> Import
                    </Button>
                    <Dialog open={isAddBookOpen} onOpenChange={setIsAddBookOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Book
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Book(s)</DialogTitle>
                                <DialogDescription>Add a new title to the library inventory.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input value={newBook.title} onChange={(e) => setNewBook({...newBook, title: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Author</Label>
                                        <Input value={newBook.author} onChange={(e) => setNewBook({...newBook, author: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>ISBN</Label>
                                        <Input value={newBook.isbn} onChange={(e) => setNewBook({...newBook, isbn: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Input value={newBook.category} onChange={(e) => setNewBook({...newBook, category: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Location</Label>
                                        <Input value={newBook.location} onChange={(e) => setNewBook({...newBook, location: e.target.value})} placeholder="Shelf/Section" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Number of Copies</Label>
                                        <Input type="number" min={1} value={newBook.copies} onChange={(e) => setNewBook({...newBook, copies: parseInt(e.target.value)})} />
                                    </div>
                                </div>
                                <Button onClick={handleAddBook} disabled={!newBook.title}>Add to Inventory</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Accession #</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBooks.map((book) => (
                                <TableRow key={book.id}>
                                    <TableCell className="font-mono text-xs">{book.accessionNumber}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{book.title}</div>
                                        <div className="text-xs text-muted-foreground">{book.author} • {book.isbn}</div>
                                    </TableCell>
                                    <TableCell>{book.category}</TableCell>
                                    <TableCell>{book.location}</TableCell>
                                    <TableCell>
                                        <Badge variant={book.status === "Available" ? "outline" : "secondary"}>
                                            {book.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon">
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
