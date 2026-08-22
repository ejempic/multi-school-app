import { useMemo, useState } from "react";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { CheckCircle2, CreditCard, Mail, Plus, Printer, Receipt, Search, Trash2 } from "lucide-react";
import { showSuccessToast } from "@/app/utils/toastNotification";

type PaymentCategory = "tuition" | "books" | "uniform" | "pe-uniform" | "car-pass" | "locker" | "custom";

interface BillingItem {
  id: string;
  student: string;
  level: string;
  category: PaymentCategory;
  label: string;
  description: string;
  amountDue: number;
  status: "Paid" | "Due" | "Partial" | "Overdue";
}

interface BookCatalogItem {
  id: string;
  gradeLevel: string;
  title: string;
  subject: string;
  price: number;
  stock: number;
}

interface TransactionLine {
  uid: string;
  itemKey: string;
  category: PaymentCategory;
  label: string;
  option: string;
  period: string;
  quantity: number;
  amount: number;
}

const categoryLabels: Record<PaymentCategory, string> = {
  tuition: "Tuition",
  books: "Books",
  uniform: "Uniform",
  "pe-uniform": "PE Uniform",
  "car-pass": "Car Pass Sticker",
  locker: "Locker",
  custom: "Custom",
};

const paymentConfig: Record<PaymentCategory, { options: string[]; showOption: boolean; showQuantity: boolean; lockQuantity: boolean }> = {
  tuition: { options: ["Monthly", "Quarterly"], showOption: true, showQuantity: false, lockQuantity: false },
  books: { options: ["Bulk"], showOption: false, showQuantity: false, lockQuantity: true },
  uniform: { options: ["Set", "Partial"], showOption: true, showQuantity: true, lockQuantity: false },
  "pe-uniform": { options: ["Set", "Partial"], showOption: true, showQuantity: true, lockQuantity: false },
  "car-pass": { options: ["One-time"], showOption: false, showQuantity: true, lockQuantity: false },
  locker: { options: ["Partial"], showOption: false, showQuantity: false, lockQuantity: true },
  custom: { options: ["Custom"], showOption: false, showQuantity: true, lockQuantity: false },
};

const monthlyPeriods = [
  "June 2026",
  "July 2026",
  "August 2026",
  "September 2026",
  "October 2026",
  "November 2026",
  "December 2026",
  "January 2027",
  "February 2027",
  "March 2027",
];

const quarterlyPeriods = ["1st Quarter", "2nd Quarter", "3rd Quarter", "4th Quarter"];
const partialUniformItems = [
  { name: "Polo", price: 520 },
  { name: "Pants", price: 620 },
  { name: "Skirt", price: 580 },
  { name: "Tie", price: 180 },
  { name: "Ribbon", price: 120 },
];

const fallbackAmounts: Partial<Record<PaymentCategory, number>> = {
  tuition: 3500,
  uniform: 1450,
  "pe-uniform": 950,
  "car-pass": 250,
  locker: 800,
};

const billingItems: BillingItem[] = [
  { id: "STU001", student: "Emma Watson", level: "Grade 12", category: "tuition", label: "Grade 12 tuition", description: "Current academic year tuition balance", amountDue: 0, status: "Paid" },
  { id: "STU002", student: "Liam Johnson", level: "Grade 11", category: "tuition", label: "Grade 11 tuition", description: "Monthly or quarterly tuition payment", amountDue: 3500, status: "Due" },
  { id: "STU002", student: "Liam Johnson", level: "Grade 11", category: "books", label: "Grade 11 required books", description: "Select individual books assigned to Grade 11", amountDue: 0, status: "Due" },
  { id: "STU004", student: "Noah Davis", level: "Grade 12", category: "books", label: "Grade 12 required books", description: "Select individual books assigned to Grade 12", amountDue: 0, status: "Overdue" },
  { id: "STU004", student: "Noah Davis", level: "Grade 12", category: "uniform", label: "Daily uniform set", description: "School uniform purchase", amountDue: 1450, status: "Due" },
  { id: "STU008", student: "Mason Lee", level: "Grade 10", category: "pe-uniform", label: "PE uniform set", description: "Physical education uniform purchase", amountDue: 950, status: "Partial" },
  { id: "STU006", student: "Sophia Garcia", level: "Grade 10", category: "car-pass", label: "Car pass sticker", description: "Campus vehicle gate sticker", amountDue: 250, status: "Due" },
  { id: "STU003", student: "Olivia Brown", level: "Grade 11", category: "locker", label: "Locker rental", description: "Annual locker fee", amountDue: 800, status: "Due" },
];

const bookCatalog: BookCatalogItem[] = [
  { id: "BK-1001", gradeLevel: "Grade 10", title: "Integrated Mathematics 10", subject: "Mathematics", price: 650, stock: 35 },
  { id: "BK-1002", gradeLevel: "Grade 10", title: "Science Explorer 10", subject: "Science", price: 720, stock: 28 },
  { id: "BK-1101", gradeLevel: "Grade 11", title: "General Mathematics", subject: "Mathematics", price: 690, stock: 42 },
  { id: "BK-1102", gradeLevel: "Grade 11", title: "Earth and Life Science", subject: "Science", price: 740, stock: 25 },
  { id: "BK-1103", gradeLevel: "Grade 11", title: "Reading and Writing Skills", subject: "English", price: 520, stock: 18 },
  { id: "BK-1201", gradeLevel: "Grade 12", title: "Statistics and Probability", subject: "Mathematics", price: 780, stock: 30 },
  { id: "BK-1202", gradeLevel: "Grade 12", title: "Physical Science", subject: "Science", price: 760, stock: 21 },
  { id: "BK-1203", gradeLevel: "Grade 12", title: "Practical Research 2", subject: "Research", price: 580, stock: 16 },
];

const itemKey = (item: BillingItem) => `${item.id}-${item.category}`;

const categoryBadge = (category: PaymentCategory) => {
  if (category === "tuition") return "info";
  if (category === "books") return "success";
  if (category === "uniform" || category === "pe-uniform") return "warning";
  if (category === "custom") return "info";
  return "muted";
};

const getPaymentOptions = (category: PaymentCategory) => paymentConfig[category].options;

const formatMoney = (amount: number) => `PHP ${amount.toLocaleString()}`;
const formatTransactionItem = (line: TransactionLine) => {
  if (line.option === "Monthly" || line.option === "Quarterly") {
    return `${line.label} - ${line.period}`;
  }
  if (paymentConfig[line.category].showQuantity) {
    return `${line.quantity}(pcs) - ${line.label}`;
  }
  return line.label;
};

export function CashierWorkspace() {
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("STU002");
  const [paymentCategory, setPaymentCategory] = useState<PaymentCategory>("tuition");
  const [paymentOption, setPaymentOption] = useState(getPaymentOptions("tuition")[0]);
  const [billingPeriod, setBillingPeriod] = useState(monthlyPeriods[0]);
  const [selectedCharge, setSelectedCharge] = useState("STU002-tuition");
  const [bookSearch, setBookSearch] = useState("");
  const [selectedBookId, setSelectedBookId] = useState("BK-1101");
  const [itemQuantity, setItemQuantity] = useState("1");
  const [selectedUniformItems, setSelectedUniformItems] = useState<string[]>(["Polo"]);
  const [customItemName, setCustomItemName] = useState("");
  const [customItemPrice, setCustomItemPrice] = useState("");
  const [transactionLines, setTransactionLines] = useState<TransactionLine[]>([]);
  const [method, setMethod] = useState("cash");
  const [referenceNo, setReferenceNo] = useState("");
  const [amountPaid, setAmountPaid] = useState("0");
  const [receiptNo, setReceiptNo] = useState("");
  const [receiptOpen, setReceiptOpen] = useState(false);

  const students = useMemo(() => {
    return Array.from(new Map(billingItems.map((item) => [item.id, { id: item.id, name: item.student, level: item.level }])).values());
  }, []);

  const selectedStudent = students.find((student) => student.id === selectedStudentId) ?? students[0];
  const studentCharges = billingItems.filter((item) => item.id === selectedStudentId);
  const filteredStudents = studentSearch.trim()
    ? students.filter((student) => `${student.id} ${student.name} ${student.level}`.toLowerCase().includes(studentSearch.toLowerCase()))
    : [];
  const availableCharges = studentCharges.filter((item) => item.category === paymentCategory);
  const filteredBooks = bookCatalog.filter((book) => {
    const matchesLevel = book.gradeLevel === selectedStudent.level;
    const matchesSearch = `${book.title} ${book.subject}`.toLowerCase().includes(bookSearch.toLowerCase());
    return matchesLevel && matchesSearch;
  });
  const selectedBook = bookCatalog.find((book) => book.id === selectedBookId && book.gradeLevel === selectedStudent.level) ?? filteredBooks[0];
  const selectedItem = availableCharges.find((item) => itemKey(item) === selectedCharge) ?? availableCharges[0];
  const selectedItemHasQuantity = paymentConfig[paymentCategory].showQuantity;
  const transactionTotal = transactionLines.reduce((sum, item) => sum + item.amount * item.quantity, 0);
  const paid = Number(amountPaid) || 0;
  const change = Math.max(paid - transactionTotal, 0);
  const balanceAfterPayment = Math.max(transactionTotal - paid, 0);
  const canAddCurrentItem = paymentCategory === "books"
    ? Boolean(selectedBook)
    : paymentCategory === "custom"
      ? Boolean(customItemName.trim()) && Boolean(Number(customItemPrice))
      : true;
  const currentItemLabel = selectedItem?.label || `${selectedStudent.level} ${categoryLabels[paymentCategory].toLowerCase()}`;
  const currentItemDescription = selectedItem?.description || `${categoryLabels[paymentCategory]} payment for ${selectedStudent.name}`;
  const currentItemAmount = paymentCategory === "books" && selectedBook ? selectedBook.price : selectedItem?.amountDue || fallbackAmounts[paymentCategory] || 0;

  const handleStudentChange = (studentId: string) => {
    const nextStudent = students.find((student) => student.id === studentId);
    const firstCharge = billingItems.find((item) => item.id === studentId) ?? billingItems[0];
    setSelectedStudentId(studentId);
    setStudentSearch(nextStudent?.name || "");
    setPaymentCategory(firstCharge.category);
    setPaymentOption(getPaymentOptions(firstCharge.category)[0]);
    setSelectedCharge(itemKey(firstCharge));
    setSelectedBookId(bookCatalog.find((book) => book.gradeLevel === firstCharge.level)?.id || "");
    setBookSearch("");
    setBillingPeriod(getPaymentOptions(firstCharge.category)[0] === "Quarterly" ? quarterlyPeriods[0] : monthlyPeriods[0]);
    setItemQuantity("1");
    setSelectedUniformItems(["Polo"]);
    setCustomItemName("");
    setCustomItemPrice("");
    setTransactionLines([]);
    setAmountPaid("0");
  };

  const handleCategoryChange = (value: string) => {
    const category = value as PaymentCategory;
    const firstCharge = billingItems.find((item) => item.id === selectedStudentId && item.category === category);
    setPaymentCategory(category);
    setPaymentOption(getPaymentOptions(category)[0]);
    setBillingPeriod(getPaymentOptions(category)[0] === "Quarterly" ? quarterlyPeriods[0] : monthlyPeriods[0]);
    setSelectedCharge(firstCharge ? itemKey(firstCharge) : "");
    if (category === "books") {
      const firstBook = bookCatalog.find((book) => book.gradeLevel === selectedStudent.level);
      setSelectedBookId(firstBook?.id || "");
      setBookSearch("");
    }
    setItemQuantity("1");
    setSelectedUniformItems(["Polo"]);
    setCustomItemName("");
    setCustomItemPrice("");
  };

  const handleOptionChange = (value: string) => {
    setPaymentOption(value);
    if (value === "Monthly") setBillingPeriod(monthlyPeriods[0]);
    if (value === "Quarterly") setBillingPeriod(quarterlyPeriods[0]);
    if (value === "Partial") setSelectedUniformItems(["Polo"]);
  };

  const toggleUniformItem = (item: string, checked: boolean) => {
    setSelectedUniformItems((current) => {
      if (checked) return Array.from(new Set([...current, item]));
      const next = current.filter((selected) => selected !== item);
      return next.length ? next : current;
    });
  };

  const addItem = () => {
    if (paymentCategory === "books" && !selectedBook) return;
    const period = paymentOption === "Monthly" || paymentOption === "Quarterly" ? billingPeriod : "";
    const isPartialUniform = (paymentCategory === "uniform" || paymentCategory === "pe-uniform") && paymentOption === "Partial";
    const quantity = paymentConfig[paymentCategory].lockQuantity ? 1 : selectedItemHasQuantity ? Math.max(Number(itemQuantity) || 1, 1) : 1;

    if (paymentCategory === "custom") {
      if (!customItemName.trim() || !Number(customItemPrice)) return;
      const nextLine: TransactionLine = {
        uid: `custom-${Date.now()}`,
        itemKey: "custom",
        category: "custom",
        label: customItemName.trim(),
        option: "Custom",
        period: "",
        quantity,
        amount: Number(customItemPrice) || 0,
      };
      const nextTotal = transactionTotal + nextLine.amount * nextLine.quantity;
      setTransactionLines((current) => [...current, nextLine]);
      setAmountPaid(String(nextTotal));
      setCustomItemName("");
      setCustomItemPrice("");
      return;
    }

    if (isPartialUniform) {
      const selectedPieces = partialUniformItems.filter((item) => selectedUniformItems.includes(item.name));
      if (!selectedPieces.length) return;
      const nextLines = selectedPieces.map((item) => ({
        uid: `${selectedStudentId}-${paymentCategory}-${item.name}-${Date.now()}`,
        itemKey: `${selectedStudentId}-${paymentCategory}-${item.name}`,
        category: paymentCategory,
        label: `${currentItemLabel} - ${item.name}`,
        option: paymentOption,
        period: "",
        quantity,
        amount: item.price,
      }));
      const nextTotal = transactionTotal + nextLines.reduce((sum, line) => sum + line.amount * line.quantity, 0);
      setTransactionLines((current) => [...current, ...nextLines]);
      setAmountPaid(String(nextTotal));
      return;
    }

    const label = paymentCategory === "books" && selectedBook
      ? selectedBook.title
      : currentItemLabel;
    const amount = currentItemAmount;
    const uid = paymentCategory === "books" && selectedBook ? `${selectedStudentId}-${selectedBook.id}` : selectedCharge || `${selectedStudentId}-${paymentCategory}`;
    const nextLine: TransactionLine = {
      uid: `${uid}-${Date.now()}`,
      itemKey: uid,
      category: paymentCategory === "books" ? "books" : selectedItem?.category || paymentCategory,
      label,
      option: paymentOption,
      period,
      quantity,
      amount,
    };
    const nextTotal = transactionTotal + nextLine.amount * nextLine.quantity;
    setTransactionLines((current) => [...current, nextLine]);
    setAmountPaid(String(nextTotal));
  };

  const updateLine = (uid: string, updates: Partial<TransactionLine>) => {
    setTransactionLines((current) => current.map((line) => (line.uid === uid ? { ...line, ...updates } : line)));
  };

  const removeLine = (uid: string) => {
    setTransactionLines((current) => current.filter((line) => line.uid !== uid));
  };

  const completePayment = () => {
    if (!transactionLines.length) return;
    const nextReceipt = `OR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    setReceiptNo(nextReceipt);
    setReceiptOpen(true);
    showSuccessToast("Payment completed", `${nextReceipt} generated for ${selectedStudent.name}.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Receipt}
        title="Cashier"
        subtitle="Build a student transaction, collect payment, and issue receipts."
      />

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="h-4 w-4" />
              Search Student
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="pl-9"
                placeholder="Search students by name, ID or grade..."
                value={studentSearch}
                onChange={(event) => setStudentSearch(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              {filteredStudents.map((student) => {
                const charges = billingItems.filter((item) => item.id === student.id);
                const balance = charges.reduce((sum, item) => sum + item.amountDue, 0);
                return (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => handleStudentChange(student.id)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors ${
                      selectedStudentId === student.id ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black text-slate-900">{student.name}</p>
                        <p className="text-xs font-semibold text-slate-500">{student.id} • {student.level}</p>
                      </div>
                      <Badge variant={selectedStudentId === student.id ? "info" : "muted"}>{formatMoney(balance)}</Badge>
                    </div>
                  </button>
                );
              })}
              {!studentSearch.trim() && (
                <p className="rounded-lg border border-dashed bg-slate-50 p-4 text-sm font-semibold text-slate-400">
                  Search to find a student.
                </p>
              )}
              {studentSearch.trim() && !filteredStudents.length && (
                <p className="rounded-lg border border-dashed bg-slate-50 p-4 text-sm font-semibold text-slate-400">
                  No students found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Plus className="h-4 w-4" />
              Add Item
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Payment For</Label>
              <Select value={paymentCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {paymentConfig[paymentCategory].showOption && (
                <div className="space-y-2">
                  <Label>Option</Label>
                  <Select value={paymentOption} onValueChange={handleOptionChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getPaymentOptions(paymentCategory).map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {(paymentOption === "Monthly" || paymentOption === "Quarterly") && (
                <div className="space-y-2">
                  <Label>{paymentOption === "Monthly" ? "Month" : "Quarter"}</Label>
                  <Select value={billingPeriod} onValueChange={setBillingPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(paymentOption === "Monthly" ? monthlyPeriods : quarterlyPeriods).map((period) => (
                        <SelectItem key={period} value={period}>{period}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {paymentCategory === "books" && (
              <div className="space-y-3 rounded-lg border bg-slate-50 p-3">
                <div className="space-y-2">
                  <Label>Search Book for {selectedStudent.level}</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      className="bg-white pl-9"
                      value={bookSearch}
                      onChange={(event) => setBookSearch(event.target.value)}
                      placeholder="Search book name or subject..."
                    />
                  </div>
                </div>
                <div className="max-h-44 space-y-2 overflow-y-auto">
                  {filteredBooks.map((book) => (
                    <button
                      key={book.id}
                      type="button"
                      onClick={() => setSelectedBookId(book.id)}
                      className={`w-full rounded-lg border p-3 text-left transition-colors ${
                        selectedBook?.id === book.id ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-black text-slate-900">{book.title}</p>
                          <p className="text-xs font-semibold text-slate-500">{book.subject} • {book.gradeLevel}</p>
                        </div>
                        <p className="text-sm font-black text-slate-900">{formatMoney(book.price)}</p>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-slate-500">{book.stock} in stock</p>
                    </button>
                  ))}
                  {!filteredBooks.length && (
                    <p className="rounded-lg border border-dashed bg-white p-3 text-sm font-semibold text-slate-400">
                      No books found for {selectedStudent.level}.
                    </p>
                  )}
                </div>
              </div>
            )}

            {(paymentCategory === "uniform" || paymentCategory === "pe-uniform") && paymentOption === "Partial" && (
              <div className="space-y-3 rounded-lg border bg-slate-50 p-3">
                <div>
                  <Label>Uniform Items</Label>
                  <p className="text-xs font-semibold text-slate-500">Select the pieces included in this partial payment.</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {partialUniformItems.map((item) => (
                    <label key={item.name} className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border bg-white p-3 text-sm font-semibold text-slate-700">
                      <span className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedUniformItems.includes(item.name)}
                        onCheckedChange={(checked) => toggleUniformItem(item.name, checked === true)}
                      />
                        {item.name}
                      </span>
                      <span className="text-xs font-black text-slate-500">{formatMoney(item.price)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {paymentCategory === "custom" && (
              <div className="space-y-3 rounded-lg border bg-slate-50 p-3">
                <div className="space-y-2">
                  <Label>Item Name</Label>
                  <Input
                    className="bg-white"
                    value={customItemName}
                    onChange={(event) => setCustomItemName(event.target.value)}
                    placeholder="Example: ID replacement, field trip fee..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Item Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">PHP</span>
                    <Input
                      className="bg-white pl-12"
                      type="number"
                      value={customItemPrice}
                      onChange={(event) => setCustomItemPrice(event.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedItemHasQuantity && (
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  value={itemQuantity}
                  onChange={(event) => setItemQuantity(event.target.value)}
                />
              </div>
            )}

            {paymentCategory !== "books" && paymentCategory !== "custom" && (
              <div className="rounded-lg border bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">{currentItemLabel}</p>
                    <p className="text-sm text-slate-600">{currentItemDescription}</p>
                  </div>
                  <Badge variant={selectedItem?.status === "Paid" ? "success" : selectedItem?.status === "Overdue" ? "destructive" : "warning"}>
                    {selectedItem?.status || "Due"}
                  </Badge>
                </div>
              </div>
            )}

            <Button
              className="w-full"
              onClick={addItem}
              disabled={!canAddCurrentItem}
            >
              <Plus className="h-4 w-4" />
              Add to Transaction
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
          <CardHeader>
            <CardTitle>Transaction List</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Remove</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionLines.map((line) => (
                  <TableRow key={line.uid} className="hover:bg-transparent">
                    <TableCell className="align-top">
                      <Badge variant={categoryBadge(line.category)}>{categoryLabels[line.category]}</Badge>
                    </TableCell>
                    <TableCell className="align-top">
                      <p className="font-semibold text-slate-900">{formatTransactionItem(line)}</p>
                    </TableCell>
                    <TableCell className="align-top font-semibold text-slate-900">{formatMoney(line.amount)}</TableCell>
                    <TableCell className="align-top font-black text-slate-900">{formatMoney(line.amount * line.quantity)}</TableCell>
                    <TableCell className="align-top text-right">
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => removeLine(line.uid)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!transactionLines.length && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="h-28 text-center text-sm font-semibold text-slate-400">
                      Add items to start a transaction.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="rounded-lg border bg-slate-50 p-4">
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="gcash">GCash</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Reference No.</Label>
                  <Input value={referenceNo} onChange={(event) => setReferenceNo(event.target.value)} placeholder="OR, GCash, bank ref..." />
                </div>
                <div className="space-y-2">
                  <Label>Amount Paid</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">PHP</span>
                    <Input className="pl-12" value={amountPaid} onChange={(event) => setAmountPaid(event.target.value)} />
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-white p-3">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Charges</p>
                  <p className="text-xl font-black text-slate-900">{formatMoney(transactionTotal)}</p>
                </div>
                <div className="rounded-lg bg-white p-3">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Amount Paid</p>
                  <p className="text-xl font-black text-slate-900">{formatMoney(paid)}</p>
                </div>
                <div className="rounded-lg bg-white p-3">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">{balanceAfterPayment > 0 ? "Balance" : "Change"}</p>
                  <p className="text-xl font-black text-slate-900">{formatMoney(balanceAfterPayment > 0 ? balanceAfterPayment : change)}</p>
                </div>
              </div>

              <Button className="mt-4 w-full" onClick={completePayment} disabled={!transactionLines.length}>
                <CreditCard className="h-4 w-4" />
                Complete Payment
              </Button>
            </div>
          </CardContent>
      </Card>

      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Payment Successful
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Receipt No.</p>
                  <p className="text-xl font-black text-slate-900">{receiptNo}</p>
                </div>
                <Badge variant="success">Paid</Badge>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Student</span>
                  <span className="font-bold text-slate-900">{selectedStudent.name}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Reference</span>
                  <span className="font-bold text-slate-900">{referenceNo || "N/A"}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Total Charges</span>
                  <span className="font-bold text-slate-900">{formatMoney(transactionTotal)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Amount Paid</span>
                  <span className="font-bold text-slate-900">{formatMoney(paid)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">{balanceAfterPayment > 0 ? "Remaining Balance" : "Change"}</span>
                  <span className="font-bold text-slate-900">{formatMoney(balanceAfterPayment > 0 ? balanceAfterPayment : change)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {transactionLines.map((line) => (
                <div key={line.uid} className="flex items-center justify-between gap-4 rounded-lg border p-3 text-sm">
                  <div>
                    <p className="font-bold text-slate-900">{formatTransactionItem(line)}</p>
                    <p className="text-slate-500">{line.option}</p>
                  </div>
                  <p className="font-black text-slate-900">{formatMoney(line.amount * line.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="h-4 w-4" />
                Print Receipt
              </Button>
              <Button variant="outline" onClick={() => showSuccessToast("Email queued", `Receipt ${receiptNo} is ready to email.`)}>
                <Mail className="h-4 w-4" />
                Email Receipt
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
