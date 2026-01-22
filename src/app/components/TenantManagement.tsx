import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ExternalLink, Settings, Plus, Key, Check, Save } from "lucide-react";
import { tenants as initialTenants, Tenant } from "../data/tenants";
import { PageHeader } from "./ui/page-header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { AVAILABLE_FEATURES, PLAN_FEATURES } from "../config";

// Default theme for reset
const DEFAULT_THEME = {
  primary: "#1e3a8a", // blue-900
  secondary: "#1d4ed8", // blue-700
  accent: "#eab308", // yellow-500
  background: "#f9fafb" // gray-50
};

export function TenantManagement() {
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [editPlan, setEditPlan] = useState<string>("Basic");
  const [editFeatures, setEditFeatures] = useState<string[]>([]);
  const [editTheme, setEditTheme] = useState<Tenant['theme']>(DEFAULT_THEME);

  const handleEditClick = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setEditPlan(tenant.plan || "Basic");
    setEditFeatures(tenant.features || []);
    setEditTheme(tenant.theme || DEFAULT_THEME);
    setIsDialogOpen(true);
  };

  const handleResetTheme = () => {
    setEditTheme(DEFAULT_THEME);
  };

  const handleSave = () => {
    if (!selectedTenant) return;

    const updatedTenants = tenants.map(t => {
      if (t.id === selectedTenant.id) {
        return {
          ...t,
          plan: editPlan as any,
          features: editFeatures,
          theme: editTheme
        };
      }
      return t;
    });

    setTenants(updatedTenants);
    setIsDialogOpen(false);
  };

  const toggleFeature = (feature: string) => {
    if (editFeatures.includes(feature)) {
      setEditFeatures(editFeatures.filter(f => f !== feature));
    } else {
      setEditFeatures([...editFeatures, feature]);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tenant Management"
        subtitle="Manage school instances, subscription plans, and feature access."
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Tenant
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tenants.filter(t => t.id !== 'admin').map((tenant) => (
          <Card key={tenant.id} className="overflow-hidden border-slate-200">
            <div className="h-2 w-full" style={{ backgroundColor: tenant.theme.primary.replace('bg-', '') === 'blue-900' ? '#1e3a8a' : tenant.theme.primary.replace('bg-', '') === 'red-900' ? '#7f1d1d' : '#0f172a' }} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {tenant.subdomain}.localhost
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditClick(tenant)}>
                 <Settings className="h-4 w-4 text-slate-400 hover:text-slate-900" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4 mt-2">
                 <div className="h-12 w-12 rounded border p-1 flex items-center justify-center bg-white">
                    {tenant.logo ? (
                         <img src={tenant.logo} alt={tenant.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                         <div className="text-xs font-bold">{tenant.id.substring(0,2).toUpperCase()}</div>
                    )}
                 </div>
                 <div className="flex-1">
                    <h3 className="font-bold text-lg leading-tight line-clamp-2">{tenant.name}</h3>
                    <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                 </div>
              </div>
              
              <div className="space-y-3 py-2">
                  <div className="text-sm text-slate-600 flex justify-between items-center border-b pb-2">
                     <span>Theme Colors</span>
                     <div className="flex space-x-1">
                        <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: tenant.theme.primary }} />
                        <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: tenant.theme.secondary }} />
                        <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: tenant.theme.accent }} />
                        <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: tenant.theme.background }} />
                     </div>
                  </div>
                  <div className="text-sm text-slate-600 flex justify-between items-center">
                      <span>Status</span>
                      <span className="font-medium text-green-600">Operational</span>
                  </div>
                  <div className="text-sm text-slate-600 flex justify-between items-center">
                      <span>Plan</span>
                      <Badge variant="outline" className={`font-medium ${
                        tenant.plan === 'Enterprise' ? 'border-purple-200 bg-purple-50 text-purple-700' :
                        tenant.plan === 'Pro' ? 'border-blue-200 bg-blue-50 text-blue-700' :
                        'border-slate-200 bg-slate-50 text-slate-700'
                      }`}>{tenant.plan || 'Basic'}</Badge>
                  </div>
              </div>

              {tenant.features && tenant.features.length > 0 && (
                 <div className="bg-slate-50 p-3 rounded-md mb-4 text-xs space-y-1">
                    <p className="font-semibold text-slate-700 mb-2">Active Features ({tenant.features.length})</p>
                    <div className="grid grid-cols-1 gap-1">
                        {tenant.features.slice(0, 3).map((feature, i) => (
                        <div key={i} className="flex items-center text-slate-600">
                            <Check className="h-3 w-3 mr-2 text-green-600" />
                            {feature}
                        </div>
                        ))}
                        {tenant.features.length > 3 && (
                            <div className="text-slate-400 pl-5 italic">
                                + {tenant.features.length - 3} more...
                            </div>
                        )}
                    </div>
                 </div>
              )}

              <div className="mt-6 flex flex-col gap-2">
                <Button 
                    className="w-full bg-slate-900 hover:bg-slate-800"
                    onClick={() => window.open(`http://${tenant.subdomain}.localhost:5173/?autologin=true`, '_blank')}
                >
                    <Key className="mr-2 h-4 w-4" /> Login as Administrator
                </Button>
                <Button 
                    variant="outline" 
                    className="w-full border-slate-300 hover:bg-slate-50" 
                    onClick={() => window.open(`http://${tenant.subdomain}.localhost:5173`, '_blank')}
                >
                    <ExternalLink className="mr-2 h-4 w-4" /> Open Portal
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Tenant Configuration</DialogTitle>
            <DialogDescription>
              Configure plan and feature availability for <span className="font-semibold text-slate-900">{selectedTenant?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="plan">Subscription Plan</Label>
              <Select value={editPlan} onValueChange={(val) => {
                  setEditPlan(val);
                  setEditFeatures(PLAN_FEATURES[val] || []);
              }}>
                <SelectTrigger id="plan">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic - Core Admin</SelectItem>
                  <SelectItem value="Pro">Pro - Fiscal & Academic</SelectItem>
                  <SelectItem value="Enterprise">Enterprise - Full Suite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label>Feature Availability</Label>
              <div className="grid grid-cols-1 gap-3 border rounded-md p-4 max-h-[250px] overflow-y-auto">
                {AVAILABLE_FEATURES.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox 
                        id={`feature-${feature}`} 
                        checked={editFeatures.includes(feature)}
                        onCheckedChange={() => toggleFeature(feature)}
                    />
                    <label
                      htmlFor={`feature-${feature}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Theme Configuration</Label>
              <div className="border rounded-md p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Theme Colors</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleResetTheme}
                    className="text-xs"
                  >
                    Reset to Default
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-600">Primary</Label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full border" 
                        style={{ backgroundColor: editTheme.primary }} 
                      />
                      <span className="text-xs font-mono">{editTheme.primary}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-600">Secondary</Label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full border" 
                        style={{ backgroundColor: editTheme.secondary }} 
                      />
                      <span className="text-xs font-mono">{editTheme.secondary}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-600">Accent</Label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full border" 
                        style={{ backgroundColor: editTheme.accent }} 
                      />
                      <span className="text-xs font-mono">{editTheme.accent}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-600">Background</Label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full border" 
                        style={{ backgroundColor: editTheme.background }} 
                      />
                      <span className="text-xs font-mono">{editTheme.background}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
