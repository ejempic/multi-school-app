import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Search, Plus, Mail, Phone, Edit2, Trash2, Send, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { showSuccessToast, showInfoToast, showErrorToast } from "../utils/toastNotification";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Student {
  id: number;
  studentId: string;
  name: string;
  grade: string;
}

interface ParentAccess {
  hasAccount: boolean;
  isLocked: boolean;
  username?: string;
}

interface Parent {
  id: number;
  name: string;
  email: string;
  phone: string;
  relationship: string;
  studentIds: number[];
  access: ParentAccess;
}

interface ParentCardProps {
  parent: Parent;
  students: Student[];
  onUpdateAccess: (parentId: number, newAccess: ParentAccess) => void;
  onSendInvite: (parentId: number, username: string, loginMethod: string) => void;
  onAddStudentToParent: (parentId: number, studentId: number) => void;
  onRemoveStudentFromParent: (parentId: number, studentId: number) => void;
  onDeleteParent: (id: number) => void;
}

function ParentCardComponent({
  parent,
  students,
  onUpdateAccess,
  onSendInvite,
  onAddStudentToParent,
  onRemoveStudentFromParent,
  onDeleteParent,
}: ParentCardProps) {
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ username: "", loginMethod: "email" });

  const handleSendInviteLocal = () => {
    if (inviteForm.username.trim()) {
      onSendInvite(parent.id, inviteForm.username, inviteForm.loginMethod);
      showSuccessToast(`✓ Invite sent to ${parent.name}`, `Username: ${inviteForm.username}`);
      setInviteForm({ username: "", loginMethod: "email" });
      setAccountDialogOpen(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{parent.name}</CardTitle>
                {parent.access.hasAccount && (
                  <Badge variant={parent.access.isLocked ? "secondary" : "default"}>
                    {parent.access.isLocked ? "🔒 Locked" : "✓ Active"}
                  </Badge>
                )}
                {!parent.access.hasAccount && (
                  <Badge variant="outline">
                    Pending Invite
                  </Badge>
                )}
              </div>
              {parent.studentIds.map(studentId => {
                const student = students.find(s => s.id === studentId);
                return student ? (
                  <p key={studentId} className="text-sm text-gray-600">{student.name}'s {parent.relationship.toLowerCase()}</p>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{parent.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{parent.phone}</span>
          </div>
        </div>

        {parent.studentIds.length > 0 && (
          <div className="pt-3 border-t">
            <h4 className="text-sm font-semibold mb-2">Connected Students ({parent.studentIds.length})</h4>
            <div className="space-y-1">
              {parent.studentIds.map(studentId => {
                const student = students.find(s => s.id === studentId);
                return student ? (
                  <div key={studentId} className="text-xs bg-gray-50 p-2 rounded flex items-center justify-between">
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-gray-500">{student.grade}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 text-red-500 hover:text-red-700"
                      onClick={() => {
                        onRemoveStudentFromParent(parent.id, studentId);
                        showSuccessToast(`✓ Student unlinked`, `${student.name} has been removed from ${parent.name}`);
                      }}
                    >
                      ×
                    </Button>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = `mailto:${parent.email}`}
          >
            <Mail className="h-4 w-4 mr-1" />
            Email
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = `sms:${parent.phone}`}
          >
            <Send className="h-4 w-4 mr-1" />
            SMS
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Link Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Link Student to Parent</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="student-select">Select Student</Label>
                  <Select
                    onValueChange={(studentId) => {
                      const student = students.find(s => s.id === parseInt(studentId));
                      onAddStudentToParent(parent.id, parseInt(studentId));
                      if (student) {
                        showSuccessToast(`✓ Student linked`, `${student.name} is now linked to ${parent.name}`);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students
                        .filter(s => !parent.studentIds.includes(s.id))
                        .map(student => (
                          <SelectItem key={student.id} value={student.id.toString()}>
                            {student.name} - {student.grade}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={accountDialogOpen} onOpenChange={setAccountDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Lock className="h-4 w-4 mr-1" />
                Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Account Management</DialogTitle>
                <DialogDescription>Manage {parent.name}'s account</DialogDescription>
              </DialogHeader>
              
              {parent.access.hasAccount ? (
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-700">✓ Account Active</p>
                    <p className="text-xs text-green-600 mt-1">Username: <span className="font-mono">{parent.access.username}</span></p>
                  </div>
                  
                  <Button
                    variant={parent.access.isLocked ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => {
                      onUpdateAccess(parent.id, { ...parent.access, isLocked: !parent.access.isLocked });
                      if (parent.access.isLocked) {
                        showSuccessToast(`✓ Account unlocked`, `${parent.name}'s account is now active`);
                      } else {
                        showInfoToast(`🔒 Account locked`, `${parent.name}'s account is now locked`);
                      }
                    }}
                  >
                    {parent.access.isLocked ? "🔒 Unlock Account" : "🔐 Lock Account"}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      showSuccessToast(`✓ Password reset email sent`, `Reset link sent to ${parent.email}`);
                    }}
                  >
                    🔑 Reset Password
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm font-medium text-yellow-700">⚠ No Account Yet</p>
                    <p className="text-xs text-yellow-600 mt-1">Send an invite to create account</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                      <Input
                        id="username"
                        placeholder="Enter username"
                        value={inviteForm.username}
                        onChange={(e) => setInviteForm({ ...inviteForm, username: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Login Method</Label>
                      <Select value={inviteForm.loginMethod} onValueChange={(val) => setInviteForm({ ...inviteForm, loginMethod: val })}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">📧 Email: {parent.email}</SelectItem>
                          <SelectItem value="phone">📱 Phone: {parent.phone}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={handleSendInviteLocal}
                      disabled={!inviteForm.username.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Invite
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="col-span-1">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Parent</DialogTitle>
              </DialogHeader>
              <p>Are you sure you want to delete {parent.name}? This cannot be undone.</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline">Cancel</Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    onDeleteParent(parent.id);
                    showErrorToast(`✓ ${parent.name} deleted`, "Parent account has been removed");
                  }}
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

import { PageHeader } from "./ui/page-header";

export function ParentControls() {
  const [searchQuery, setSearchQuery] = useState("");
  const [parents, setParents] = useState<Parent[]>([
    { id: 1, name: "Sarah Watson", email: "sarah.watson@email.com", phone: "(555) 111-1111", relationship: "Mother", studentIds: [1], access: { hasAccount: true, isLocked: false, username: "sarah.watson" } },
    { id: 2, name: "James Johnson", email: "james.johnson@email.com", phone: "(555) 222-2222", relationship: "Father", studentIds: [2, 8], access: { hasAccount: true, isLocked: false, username: "james.johnson" } },
    { id: 3, name: "Maria Johnson", email: "maria.johnson@email.com", phone: "(555) 333-3333", relationship: "Mother", studentIds: [2], access: { hasAccount: true, isLocked: true, username: "maria.johnson" } },
    { id: 4, name: "Robert Brown", email: "robert.brown@email.com", phone: "(555) 444-4444", relationship: "Father", studentIds: [3], access: { hasAccount: false, isLocked: false } },
    { id: 5, name: "Linda Wilson", email: "linda.wilson@email.com", phone: "(555) 555-5555", relationship: "Mother", studentIds: [5], access: { hasAccount: true, isLocked: false, username: "linda.wilson" } },
    { id: 6, name: "Michael Martinez", email: "michael.martinez@email.com", phone: "(555) 666-6666", relationship: "Father", studentIds: [6], access: { hasAccount: false, isLocked: false } },
    { id: 7, name: "Carmen Martinez", email: "carmen.martinez@email.com", phone: "(555) 777-7777", relationship: "Mother", studentIds: [6], access: { hasAccount: true, isLocked: false, username: "carmen.martinez" } },
    { id: 8, name: "David Garcia", email: "david.garcia@email.com", phone: "(555) 888-8888", relationship: "Father", studentIds: [7], access: { hasAccount: false, isLocked: false } },
  ]);

  const [students] = useState<Student[]>([
    { id: 1, studentId: "STU-2024-001", name: "Emma Watson", grade: "Grade 12" },
    { id: 2, studentId: "STU-2024-002", name: "Liam Johnson", grade: "Grade 11" },
    { id: 3, studentId: "STU-2024-003", name: "Olivia Brown", grade: "Grade 10" },
    { id: 4, studentId: "STU-2024-004", name: "Noah Davis", grade: "Grade 12" },
    { id: 5, studentId: "STU-2024-005", name: "Ava Wilson", grade: "Grade 11" },
    { id: 6, studentId: "STU-2024-006", name: "Ethan Martinez", grade: "Grade 10" },
    { id: 7, studentId: "STU-2024-007", name: "Sophia Garcia", grade: "Grade 12" },
    { id: 8, studentId: "STU-2024-008", name: "Mason Lee", grade: "Grade 11" },
  ]);

  const [newParent, setNewParent] = useState({ name: "", email: "", phone: "", relationship: "", studentIds: [] as number[], isActive: true });

  const filteredParents = parents.filter(parent =>
    parent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    parent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    parent.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddParent = () => {
    if (newParent.name.trim() && newParent.email.trim() && newParent.phone.trim() && newParent.relationship.trim()) {
      const parent: Parent = {
        id: Math.max(...parents.map(p => p.id), 0) + 1,
        name: newParent.name.trim(),
        email: newParent.email.trim(),
        phone: newParent.phone.trim(),
        relationship: newParent.relationship.trim(),
        studentIds: newParent.studentIds,
        access: { hasAccount: false, isLocked: false }
      };
      setParents([...parents, parent]);
      showSuccessToast(`✓ Parent added successfully`, `${newParent.name} has been added to the system`);
      setNewParent({ name: "", email: "", phone: "", relationship: "", studentIds: [], isActive: true });
    }
  };

  const handleDeleteParent = (id: number) => {
    setParents(parents.filter(p => p.id !== id));
  };

  const handleAddStudentToParent = (parentId: number, studentId: number) => {
    setParents(parents.map(p =>
      p.id === parentId && !p.studentIds.includes(studentId)
        ? { ...p, studentIds: [...p.studentIds, studentId] }
        : p
    ));
  };

  const handleRemoveStudentFromParent = (parentId: number, studentId: number) => {
    setParents(parents.map(p =>
      p.id === parentId
        ? { ...p, studentIds: p.studentIds.filter(sid => sid !== studentId) }
        : p
    ));
  };

  const handleUpdateAccess = (parentId: number, newAccess: ParentAccess) => {
    setParents(parents.map(p =>
      p.id === parentId
        ? { ...p, access: newAccess }
        : p
    ));
  };

  const handleSendInvite = (parentId: number, username: string, loginMethod: string) => {
    const parent = parents.find(p => p.id === parentId);
    if (parent) {
      setParents(parents.map(p =>
        p.id === parentId
          ? { ...p, access: { hasAccount: true, isLocked: false, username } }
          : p
      ));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parent Controls"
        subtitle="Manage parent accounts and link them to students"
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Parent
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Parent/Guardian</DialogTitle>
                <DialogDescription>Create a new parent account and link to students.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="parent-name">Full Name</Label>
                  <Input
                    id="parent-name"
                    placeholder="Enter parent name"
                    value={newParent.name}
                    onChange={(e) => setNewParent({ ...newParent, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="parent-email">Email</Label>
                  <Input
                    id="parent-email"
                    type="email"
                    placeholder="parent@email.com"
                    value={newParent.email}
                    onChange={(e) => setNewParent({ ...newParent, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="parent-phone">Phone</Label>
                  <Input
                    id="parent-phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={newParent.phone}
                    onChange={(e) => setNewParent({ ...newParent, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="parent-relationship">Relationship</Label>
                  <Select
                    value={newParent.relationship}
                    onValueChange={(value) => setNewParent({ ...newParent, relationship: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Father">Father</SelectItem>
                      <SelectItem value="Mother">Mother</SelectItem>
                      <SelectItem value="Guardian">Guardian</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleAddParent}>
                  Add Parent
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search parents by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredParents.length > 0 ? (
          filteredParents.map(parent => (
            <ParentCardComponent
              key={parent.id}
              parent={parent}
              students={students}
              onUpdateAccess={handleUpdateAccess}
              onSendInvite={handleSendInvite}
              onAddStudentToParent={handleAddStudentToParent}
              onRemoveStudentFromParent={handleRemoveStudentFromParent}
              onDeleteParent={handleDeleteParent}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">
              {searchQuery ? "No parents found matching your search." : "No parents added yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
