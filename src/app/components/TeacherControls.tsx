import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Plus, Mail, Phone, Lock, Trash2, Search, User, ShieldCheck } from "lucide-react";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { showSuccessToast, showInfoToast, showErrorToast } from "../utils/toastNotification";
import { Card as ShadcnCard, CardContent as ShadcnCardContent, CardHeader as ShadcnCardHeader, CardTitle as ShadcnCardTitle } from "./ui/card";
import { useTenant } from "../contexts/TenantContext";

interface StaffMember {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  qualifications: string;
  photo: string;
  classIds: number[];
  advisoryClass?: string;
  access: {
    hasAccount: boolean;
    isLocked: boolean;
    username?: string;
  };
}

interface Class {
  id: number;
  name: string;
  grade: string;
}

interface StaffCardProps {
  member: StaffMember;
  classes: Class[];
  theme: { primary: string; secondary: string; accent?: string };
  onUpdateAccess: (id: number, access: StaffMember["access"]) => void;
  onSendInvite: (id: number, username: string, loginMethod: string) => void;
  onAddClassToTeacher: (id: number, classId: number) => void;
  onRemoveClassFromTeacher: (id: number, classId: number) => void;
  onSetAdvisoryClass: (id: number, classId: number) => void;
  onDeleteStaff: (id: number) => void;
}

function StaffCardComponent({
  member,
  classes,
  theme,
  onUpdateAccess,
  onSendInvite,
  onAddClassToTeacher,
  onRemoveClassFromTeacher,
  onSetAdvisoryClass,
  onDeleteStaff,
}: StaffCardProps) {
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ username: "", loginMethod: "email" });

  const handleSendInviteLocal = () => {
    if (inviteForm.username.trim()) {
      onSendInvite(member.id, inviteForm.username, inviteForm.loginMethod);
      showSuccessToast(`✓ Invite sent to ${member.name}`, `Username: ${inviteForm.username}`);
      setInviteForm({ username: "", loginMethod: "email" });
      setAccountDialogOpen(false);
    }
  };

  return (
    <ShadcnCard className="hover:shadow-lg transition-all duration-200 overflow-hidden border-blue-100 flex flex-col h-full bg-white group">
      <div className="h-1.5 bg-blue-600 w-full" />
      <ShadcnCardHeader className="pb-3 pt-5">
        <div className="flex gap-4">
          <Avatar className="h-16 w-16 border-2 border-blue-50 group-hover:scale-105 transition-transform">
            <AvatarImage src={member.photo} alt={member.name} className="object-cover" />
            <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-lg">
              {member.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 overflow-hidden">
            <div className="flex items-center gap-2 flex-wrap">
              <ShadcnCardTitle className="text-base text-blue-900 truncate max-w-[150px] font-bold">{member.name}</ShadcnCardTitle>
              {member.access.hasAccount ? (
                <Badge variant={member.access.isLocked ? "secondary" : "default"} className="text-[9px] py-0 px-1 font-medium bg-green-50 text-green-700 border-green-200 hover:bg-green-100 uppercase">
                  {member.access.isLocked ? "🔒 Locked" : "✓ Active"}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[9px] py-0 px-1 text-gray-400 border-gray-200 uppercase">
                  Pending
                </Badge>
              )}
            </div>
            <p className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit uppercase tracking-tight">
              {member.role}
            </p>
          </div>
        </div>
      </ShadcnCardHeader>

      <ShadcnCardContent className="space-y-4 pt-0 flex-1 flex flex-col">
        <div className="space-y-2 border-t pt-3 border-gray-50">
          <div className="flex items-center gap-2 text-[11px] text-gray-500 hover:text-blue-600 transition-colors">
            <Mail className="h-3.5 w-3.5 text-blue-300" />
            <span className="truncate">{member.email}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <Phone className="h-3.5 w-3.5 text-blue-300" />
            <span>{member.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <User className="h-3.5 w-3.5 text-blue-300" />
            <span className="truncate italic" title={member.qualifications}>{member.qualifications}</span>
          </div>
        </div>

        {member.role.toLowerCase().includes('teacher') && (
          <div className="space-y-2 bg-slate-50/50 p-3 rounded-lg border border-slate-100 mt-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Academic Duty</p>
              {member.advisoryClass && <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />}
            </div>
            
            {member.advisoryClass && (
              <div className="bg-white border border-amber-100 p-2 rounded-md shadow-sm">
                <p className="text-[9px] text-amber-600 font-bold uppercase leading-none mb-1">Advisory</p>
                <p className="text-[11px] text-amber-900 font-medium leading-tight">{member.advisoryClass}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5">
              {member.classIds.map(cid => {
                const cls = classes.find(c => c.id === cid);
                return cls ? (
                  <Badge key={cid} variant="secondary" className="text-[9px] font-normal py-0 px-1.5 h-4.5 bg-white border border-slate-200 text-slate-600">
                    {cls.name}
                    <button onClick={() => onRemoveClassFromTeacher(member.id, cid)} className="ml-1 text-slate-300 hover:text-red-500 font-bold">×</button>
                  </Badge>
                ) : null;
              })}
              {member.classIds.length === 0 && <span className="text-[10px] text-slate-400 italic">No classes assigned</span>}
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] w-full mt-1 border border-dashed border-slate-200 text-slate-500 hover:bg-white hover:text-blue-600 hover:border-blue-300 bg-transparent">
                  <Plus className="h-3 w-3 mr-1" /> Assign Class
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Academic Controls: {member.name}</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase font-bold">Available Classes</Label>
                    <Select onValueChange={(val: string) => onAddClassToTeacher(member.id, parseInt(val))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a class to link" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.filter(c => !member.classIds.includes(c.id)).map(c => (
                          <SelectItem key={c.id} value={c.id.toString()}>{c.name} ({c.grade})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase font-bold">Advisory Assignment</Label>
                    <Select onValueChange={(val: string) => onSetAdvisoryClass(member.id, parseInt(val))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Set advisory class (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.filter(c => member.classIds.includes(c.id)).map(c => (
                          <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        <div className="flex items-center gap-1.5 pt-3 border-t mt-auto border-gray-50">
          <Dialog open={accountDialogOpen} onOpenChange={setAccountDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-[11px] font-semibold flex-1 transition-all shadow-sm" style={{ borderColor: theme.secondary, color: theme.primary }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.primary} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <Lock className="h-3 w-3 mr-1.5" /> 
                Manage Access
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>{member.access.hasAccount ? "Security & Credentials" : "Initialize Access"}</DialogTitle>
                <DialogDescription className="text-xs">Configure system permissions for {member.name}</DialogDescription>
              </DialogHeader>
              {!member.access.hasAccount ? (
                <div className="space-y-4 py-4 px-1">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-gray-400">Default Username</Label>
                    <Input 
                      placeholder={`e.g. ${member.email.split('@')[1].split('.')[0]}.${member.name.toLowerCase().split(' ')[0]}`}
                      value={inviteForm.username}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInviteForm({...inviteForm, username: e.target.value})}
                      className="bg-gray-50 border-gray-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-gray-400">Communication Channel</Label>
                    <Select defaultValue="email">
                      <SelectTrigger className="bg-gray-50 border-gray-100"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Official Email</SelectItem>
                        <SelectItem value="sms">Mobile SMS Notification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full h-10 font-bold text-white shadow-md mx-auto block" style={{ backgroundColor: theme.primary, borderColor: theme.primary }} onClick={handleSendInviteLocal}>Generate System Access</Button>
                </div>
              ) : (
                <div className="space-y-5 py-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-blue-900 uppercase">Account Status</p>
                      <p className={`text-[10px] font-medium ${member.access.isLocked ? "text-amber-600" : "text-green-600"}`}>
                        {member.access.isLocked ? "ACCESS SUSPENDED" : "AUTHORIZED ACCESS"}
                      </p>
                    </div>
                    <Button 
                      variant={member.access.isLocked ? "default" : "outline"}
                      className={member.access.isLocked ? "border-none h-8 text-xs font-bold text-white" : "bg-red-50 hover:bg-red-100 h-8 text-xs font-bold"}
                      style={member.access.isLocked ? { backgroundColor: '#16a34a', borderColor: '#16a34a' } : { color: '#dc2626', borderColor: '#dc2626' }}
                      size="sm"
                      onClick={() => onUpdateAccess(member.id, { ...member.access, isLocked: !member.access.isLocked })}
                    >
                      {member.access.isLocked ? "Re-authorize" : "Suspend Access"}
                    </Button>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">System ID</p>
                      <p className="text-sm font-mono font-bold text-gray-700 tracking-tight">{member.access.username}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs h-7 font-bold" style={{ color: theme.primary }}>Reset PWD</Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 rounded-lg transition-colors border border-transparent"
            style={{ color: '#6b7280' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#dc2626';
              e.currentTarget.style.backgroundColor = '#fef2f2';
              e.currentTarget.style.borderColor = '#dc2626';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#6b7280';
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
            }}
            onClick={() => {
              if (confirm(`Notice: Remove ${member.name} from school staff database?`)) onDeleteStaff(member.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </ShadcnCardContent>
    </ShadcnCard>
  );
}

export function TeacherControls() {
  const { currentTenant } = useTenant();
  const tenantId = currentTenant?.id.toUpperCase() || "SCHOOL";
  const tenantDomain = currentTenant?.subdomain || "school";
  const theme = currentTenant?.theme || { primary: "#1e3a8a", secondary: "#1d4ed8", accent: "#eab308" };

  const [classes] = useState<Class[]>([
    { id: 1, name: "Grade 12 A - Advanced Mathematics", grade: "Grade 12" },
    { id: 2, name: "Grade 12 B - Mathematics", grade: "Grade 12" },
    { id: 3, name: "Grade 11 A - English Literature", grade: "Grade 11" },
    { id: 4, name: "Grade 11 B - English Literature", grade: "Grade 11" },
    { id: 5, name: "Grade 10 - Physics", grade: "Grade 10" },
    { id: 6, name: "Grade 10 - Chemistry", grade: "Grade 10" },
    { id: 7, name: "Grade 12 - World History", grade: "Grade 12" },
    { id: 8, name: "Grade 10 - Computer Science", grade: "Grade 10" },
  ]);

  const [staff, setStaff] = useState<StaffMember[]>([]);

  useEffect(() => {
     // Initialize mock data based on tenant
     setStaff([
        {
          id: 1,
          name: "Dr. Elena Santos",
          role: "School Principal",
          email: `principal@${tenantDomain}.edu.ph`,
          phone: "+63 917 123 4567",
          qualifications: "Ph.D in Education Mgmt",
          photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
          classIds: [],
          access: { hasAccount: true, isLocked: false, username: `${tenantDomain}.elena` }
        },
        {
          id: 2,
          name: "Mr. Marcus Johnson",
          role: "Senior Teacher (Math)",
          email: `johnson@${tenantDomain}.edu.ph`,
          phone: "+63 918 555 0101",
          qualifications: "M.Sc Mathematics, B.Ed",
          photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
          classIds: [1, 2],
          advisoryClass: "Grade 12 A - Advanced Mathematics",
          access: { hasAccount: true, isLocked: false, username: `${tenantDomain}.marcus` }
        },
        {
          id: 3,
          name: "Ms. Sarah Smith",
          role: "English Teacher",
          email: `smith@${tenantDomain}.edu.ph`,
          phone: "+63 919 555 0102",
          qualifications: "M.A English, B.Ed",
          photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
          classIds: [3, 4],
          advisoryClass: "Grade 11 A - English Literature",
          access: { hasAccount: true, isLocked: false, username: `${tenantDomain}.sarah` }
        },
        {
          id: 4,
          name: "Mrs. Clara Gomez",
          role: "School Secretary",
          email: `clara.g@${tenantDomain}.edu.ph`,
          phone: "+63 920 111 2233",
          qualifications: "B.A Office Admin",
          photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Clara",
          classIds: [],
          access: { hasAccount: true, isLocked: false, username: `${tenantDomain}.clara` }
        },
        {
          id: 5,
          name: "Mr. Roberto Dela Cruz",
          role: "Security Lead",
          email: `security@${tenantDomain}.edu.ph`,
          phone: "+63 921 444 5566",
          qualifications: "Certified Security Pro",
          photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto",
          classIds: [],
          access: { hasAccount: false, isLocked: false }
        },
        {
          id: 6,
          name: "Ms. Rita Reyes",
          role: "Science Teacher",
          email: `rita@${tenantDomain}.edu.ph`,
          phone: "+63 922 777 8899",
          qualifications: "B.Sc Biology, B.Ed",
          photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rita",
          classIds: [5, 6],
          access: { hasAccount: false, isLocked: false }
        }
      ]);
  }, [tenantDomain]);

  const [newMember, setNewMember] = useState({
    name: "",
    role: "Teacher",
    email: "",
    phone: "",
    qualifications: "",
  });

  const [searchQuery, setSearchQuery] = useState("");

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateAccess = (id: number, access: StaffMember["access"]) => {
    setStaff(staff.map(m => m.id === id ? { ...m, access } : m));
  };

  const handleSendInvite = (id: number, username: string, loginMethod: string) => {
    setStaff(staff.map(m => 
      m.id === id 
        ? { ...m, access: { hasAccount: true, isLocked: false, username } }
        : m
    ));
  };

  const handleDeleteStaff = (id: number) => {
    setStaff(staff.filter(m => m.id !== id));
    showErrorToast(`✓ Staff member removed`, "Record has been deleted from database");
  };

  const handleAddClassToTeacher = (id: number, classId: number) => {
    setStaff(staff.map(m =>
      m.id === id
        ? { ...m, classIds: [...m.classIds, classId] }
        : m
    ));
    showSuccessToast(`✓ Class assigned`, `Academic record updated`);
  };

  const handleRemoveClassFromTeacher = (id: number, classId: number) => {
    setStaff(staff.map(m =>
      m.id === id
        ? {
            ...m,
            classIds: m.classIds.filter(cId => cId !== classId),
            advisoryClass: m.advisoryClass === classes.find(c => c.id === classId)?.name ? undefined : m.advisoryClass
          }
        : m
    ));
    showInfoToast(`✓ Class unlinked`, `Academic record updated`);
  };

  const handleSetAdvisoryClass = (id: number, classId: number) => {
    const classItem = classes.find(c => c.id === classId);
    if (classItem) {
      setStaff(staff.map(m =>
        m.id === id ? { ...m, advisoryClass: classItem.name } : m
      ));
      showSuccessToast(`✓ Advisory class set`, `${classItem.name} is now the advisory class`);
    }
  };

  const handleAddStaff = () => {
    if (newMember.name && newMember.email && newMember.role) {
      const member: StaffMember = {
        id: Math.max(...staff.map(s => s.id), 0) + 1,
        name: newMember.name,
        role: newMember.role,
        email: newMember.email,
        phone: newMember.phone,
        qualifications: newMember.qualifications,
        photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newMember.name.replace(/\s+/g, '')}`,
        classIds: [],
        access: { hasAccount: false, isLocked: false }
      };
      setStaff([...staff, member]);
      showSuccessToast(`✓ Member added`, `${newMember.name} joined as ${newMember.role}`);
      setNewMember({ name: "", role: "Teacher", email: "", phone: "", qualifications: "" });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Staff Management</h1>
          <p className="text-gray-600">{tenantId} Academic & Non-Academic Personnel Directory</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className={`shadow-md h-11 px-6 font-bold text-white`} style={{ backgroundColor: theme.primary, borderColor: theme.primary }}>
              <Plus className="h-4 w-4 mr-2" />
              Onboard Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>New Staff Onboarding</DialogTitle>
              <DialogDescription>Add a new employee to the school database</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 col-span-2">
                  <Label className="text-xs font-bold uppercase text-gray-400">Full Legal Name</Label>
                  <Input
                    placeholder="e.g. Juan De La Cruz"
                    value={newMember.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMember({ ...newMember, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase text-gray-400">Primary Role</Label>
                  <Select value={newMember.role} onValueChange={(val: string) => setNewMember({...newMember, role: val})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Teacher">Subject Teacher</SelectItem>
                      <SelectItem value="Lead Teacher">Lead Teacher</SelectItem>
                      <SelectItem value="Principal">Principal/Admin</SelectItem>
                      <SelectItem value="Secretary">Secretary</SelectItem>
                      <SelectItem value="IT Admin">IT Admin</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase text-gray-400">Contact Number</Label>
                  <Input
                    placeholder="+63 900..."
                    value={newMember.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMember({ ...newMember, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-gray-400">Institutional Email</Label>
                <Input
                  type="email"
                  placeholder={`name@${tenantDomain}.edu.ph`}
                  value={newMember.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMember({ ...newMember, email: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-gray-400">Academic Background</Label>
                <Input
                  placeholder="e.g. M.A. Education, specialized in..."
                  value={newMember.qualifications}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMember({ ...newMember, qualifications: e.target.value })}
                />
              </div>
              <Button className="w-full h-11 font-bold shadow-lg text-white" style={{ backgroundColor: theme.primary, borderColor: theme.primary }} onClick={handleAddStaff}>
                Register Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ShadcnCard className="border-blue-50 shadow-sm overflow-hidden bg-white">
        <ShadcnCardContent className="p-0">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 h-4 w-4" />
            <Input
              placeholder="Search by name, role, department or credentials..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 border-none focus-visible:ring-0 text-sm placeholder:text-gray-300 bg-transparent"
            />
          </div>
        </ShadcnCardContent>
      </ShadcnCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.length > 0 ? (
          filteredStaff.map(member => (
            <StaffCardComponent
              key={member.id}
              member={member}
              classes={classes}
              theme={theme}
              onUpdateAccess={handleUpdateAccess}
              onSendInvite={handleSendInvite}
              onAddClassToTeacher={handleAddClassToTeacher}
              onRemoveClassFromTeacher={handleRemoveClassFromTeacher}
              onSetAdvisoryClass={handleSetAdvisoryClass}
              onDeleteStaff={handleDeleteStaff}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <User className="h-10 w-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              {searchQuery ? `No staff records matching "${searchQuery}"` : "The staff directory is currently empty."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
