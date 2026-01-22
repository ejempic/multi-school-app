import { useState } from "react";
import { useTenant } from "../contexts/TenantContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Check, CreditCard, Building, Settings as SettingsIcon, Shield, CreditCard as CardIcon, CheckIcon, Banknote, Smartphone, Wallet, Ban } from "lucide-react";
import { showSuccessToast } from "../utils/toastNotification";
import { PageHeader } from "./ui/page-header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const PRESET_THEMES = {
  minimalist: {
    id: "minimalist",
    name: "Minimalist",
    primary: "#1e3a8a", // blue-900
    secondary: "#1d4ed8", // blue-700
    accent: "#eab308", // yellow-500
    background: "#f9fafb" // gray-50
  },
  ocean: {
    id: "ocean",
    name: "Ocean",
    primary: "#0e7490", // cyan-700
    secondary: "#06b6d4", // cyan-500
    accent: "#facc15", // yellow-400
    background: "#ecfeff" // cyan-50
  },
  forest: {
    id: "forest",
    name: "Forest",
    primary: "#14532d", // green-900
    secondary: "#166534", // green-700
    accent: "#84cc16", // lime-500
    background: "#f0fdf4" // green-50
  },
  sunset: {
    id: "sunset",
    name: "Sunset",
    primary: "#7c2d12", // orange-900
    secondary: "#c2410c", // orange-700
    accent: "#fbbf24", // amber-400
    background: "#fff7ed" // orange-50
  },
  berry: {
    id: "berry",
    name: "Berry",
    primary: "#831843", // pink-900
    secondary: "#be185d", // pink-700
    accent: "#f472b6", // pink-400
    background: "#fdf2f8" // pink-50
  },
  lavender: {
    id: "lavender",
    name: "Lavender",
    primary: "#581c87", // purple-900
    secondary: "#7e22ce", // purple-700
    accent: "#d8b4fe", // purple-300
    background: "#faf5ff" // purple-50
  },
  midnight: {
    id: "midnight",
    name: "Midnight",
    primary: "#1e1b4b", // indigo-950
    secondary: "#4338ca", // indigo-700
    accent: "#c7d2fe", // indigo-200
    background: "#eef2ff" // indigo-50
  },
  slate: {
    id: "slate",
    name: "Slate",
    primary: "#0f172a", // slate-900
    secondary: "#334155", // slate-700
    accent: "#38bdf8", // sky-400
    background: "#f8fafc" // slate-50
  }
};

export function Settings() {
  const { currentTenant, updateTenant } = useTenant();
  const [loading, setLoading] = useState(false);
  
  // Dialog States
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPlanUpgrade, setSelectedPlanUpgrade] = useState<"Basic" | "Pro" | "Enterprise">(currentTenant?.plan || "Basic");
  
  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<"Credit Card" | "GCash" | "Cash" | "Bank Deposit" | "None">("Credit Card");
  const [tempPaymentMethod, setTempPaymentMethod] = useState<"Credit Card" | "GCash" | "Cash" | "Bank Deposit" | "None">("Credit Card");

  // Partial state for demonstration
  const [schoolName, setSchoolName] = useState(currentTenant?.name || "");
  const [schoolAddress, setSchoolAddress] = useState(currentTenant?.address || "");
  const [primaryColor, setPrimaryColor] = useState(currentTenant?.theme?.primary || PRESET_THEMES.minimalist.primary);
  const [secondaryColor, setSecondaryColor] = useState(currentTenant?.theme?.secondary || PRESET_THEMES.minimalist.secondary);
  const [accentColor, setAccentColor] = useState(currentTenant?.theme?.accent || PRESET_THEMES.minimalist.accent);
  const [backgroundColor, setBackgroundColor] = useState(currentTenant?.theme?.background || PRESET_THEMES.minimalist.background);
  
  // Academic Settings
  const [schoolYear, setSchoolYear] = useState(currentTenant?.currentSchoolYear || "SY 2025-2026");
  const [term, setTerm] = useState(currentTenant?.currentTerm || "2nd Semester");

  const getColorValue = (val?: string) => {
      if (!val) return "#000000";
      if (val.startsWith("#")) return val;
      if (val === "blue-900") return "#1e3a8a";
      if (val === "blue-700") return "#1d4ed8";
      if (val === "yellow-500") return "#eab308";
      return val;
  };

  const applyTheme = (theme: typeof PRESET_THEMES.minimalist) => {
    setPrimaryColor(theme.primary);
    setSecondaryColor(theme.secondary);
    setAccentColor(theme.accent);
    setBackgroundColor(theme.background);

    updateTenant({
        theme: {
            ...currentTenant?.theme,
            primary: theme.primary,
            secondary: theme.secondary,
            accent: theme.accent,
            background: theme.background
        }
    });
  };

  const handleColorChange = (type: 'primary' | 'secondary' | 'accent' | 'background', value: string) => {
      if (type === 'primary') setPrimaryColor(value);
      if (type === 'secondary') setSecondaryColor(value);
      if (type === 'accent') setAccentColor(value);
      if (type === 'background') setBackgroundColor(value);
      
      // Apply instantly
      updateTenant({
          theme: {
              ...currentTenant?.theme, 
              // merge existing
              primary: type === 'primary' ? value : (currentTenant?.theme.primary || ""),
              secondary: type === 'secondary' ? value : (currentTenant?.theme.secondary || ""),
              accent: type === 'accent' ? value : (currentTenant?.theme.accent || ""),
              background: type === 'background' ? value : (currentTenant?.theme.background || "")
          }
      });
  };

  const handleSave = () => {
    setLoading(true);
    
    // Update context
    updateTenant({
        name: schoolName,
        address: schoolAddress,
        currentSchoolYear: schoolYear,
        currentTerm: term,
        // complex object update for theme if needed
        theme: {
            ...currentTenant?.theme, 
            primary: primaryColor,
            secondary: secondaryColor,
            accent: accentColor,
            background: backgroundColor
        }
    });

    setTimeout(() => {
      setLoading(false);
      showSuccessToast("Settings saved successfully");
    }, 800);
  };

  if (!currentTenant) return <div>No tenant selected</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your school profile, subscription, and system preferences."
        actions={
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        }
      />

      <Tabs defaultValue="school-info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="school-info" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            School Information
          </TabsTrigger>
          <TabsTrigger value="plan" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Plan & Billing
          </TabsTrigger>
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Basic Settings
          </TabsTrigger>
        </TabsList>

        {/* School Information Tab */}
        <TabsContent value="school-info">
          <Card>
            <CardHeader>
              <CardTitle>School Profile</CardTitle>
              <CardDescription>
                Update your school's public information and branding.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input 
                    id="schoolName" 
                    value={schoolName} 
                    onChange={(e) => setSchoolName(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    value={schoolAddress} 
                    onChange={(e) => setSchoolAddress(e.target.value)} 
                    placeholder="123 School Street, City, Country"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subdomain">Subdomain</Label>
                  <Input 
                    id="subdomain" 
                    value={currentTenant.subdomain} 
                    disabled 
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-muted-foreground">Contact support to change your subdomain.</p>
                </div>
                <div className="space-y-2">
                  <Label>School Logo</Label>
                  <div className="flex items-center gap-4 border p-4 rounded-md bg-slate-50">
                    {currentTenant.logo && (
                      <img src={currentTenant.logo} alt="Logo" className="h-16 w-16 object-contain" />
                    )}
                    <div>
                      <Button variant="outline" size="sm">Upload New Logo</Button>
                      <p className="text-xs text-muted-foreground mt-1">Recommended size: 512x512px</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Contact Email</Label>
                  <Input placeholder="admin@school.com" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plan & Billing Tab */}
        <TabsContent value="plan">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Current Plan</CardTitle>
                        <CardDescription>You are currently subscribed to the <span className="font-semibold text-blue-600">{currentTenant.plan || "Basic"}</span> plan.</CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-lg px-3 py-1 bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-500" />
                        Included Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {currentTenant.features?.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>
                <Separator />
                <div>
                     <h3 className="font-semibold mb-2">Usage Limits</h3>
                     <div className="space-y-4">
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span>Students</span>
                                <span className="font-medium">450 / 1000</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[45%]"></div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span>Storage</span>
                                <span className="font-medium">12GB / 50GB</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 w-[24%]"></div>
                            </div>
                        </div>
                     </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t px-6 py-4">
                <p className="text-sm text-muted-foreground">Next billing date: <strong>February 1, 2026</strong></p>
                <Dialog open={isSubscriptionOpen} onOpenChange={setIsSubscriptionOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Manage Subscription</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Manage Subscription</DialogTitle>
                      <DialogDescription>
                        Upgrade or downgrade your school's plan.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-4">
                            {["Basic", "Pro", "Enterprise"].map((plan) => (
                                <div 
                                    key={plan}
                                    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                        selectedPlanUpgrade === plan 
                                            ? "border-blue-600 bg-blue-50" 
                                            : "border-transparent bg-slate-50 hover:bg-slate-100"
                                    }`}
                                    onClick={() => setSelectedPlanUpgrade(plan as any)}
                                >
                                    <div>
                                        <div className="font-semibold flex items-center gap-2">
                                            {plan}
                                            {currentTenant?.plan === plan && <Badge variant="secondary" className="text-xs">Current</Badge>}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {plan === "Basic" ? "Essential features for small schools" : 
                                             plan === "Pro" ? "Advanced tools for growing instutions" : 
                                             "Full suite for large organizations"}
                                        </div>
                                    </div>
                                    <div className="font-bold">
                                        {plan === "Basic" ? "$99/mo" : 
                                         plan === "Pro" ? "$199/mo" : 
                                         "$499/mo"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsSubscriptionOpen(false)}>Cancel</Button>
                      <Button onClick={() => {
                          updateTenant({ plan: selectedPlanUpgrade });
                          showSuccessToast(`Successfully updated subscription to ${selectedPlanUpgrade}`);
                          setIsSubscriptionOpen(false);
                      }}>Update Plan</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>Manage your payment details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="h-8 w-10 bg-slate-100 rounded flex items-center justify-center">
                            {paymentMethod === "Credit Card" && <CreditCard className="h-5 w-5 text-slate-600" />}
                            {paymentMethod === "GCash" && <Smartphone className="h-5 w-5 text-blue-600" />}
                            {paymentMethod === "Cash" && <Wallet className="h-5 w-5 text-green-600" />}
                            {paymentMethod === "Bank Deposit" && <Banknote className="h-5 w-5 text-slate-600" />}
                            {paymentMethod === "None" && <Ban className="h-5 w-5 text-red-600" />}
                        </div>
                        <div>
                            <p className="text-sm font-medium">{paymentMethod}</p>
                            <p className="text-xs text-muted-foreground">
                                {paymentMethod === "Credit Card" ? "Visa ending in 4242" : 
                                 paymentMethod === "GCash" ? "Linked to 0917***1234" :
                                 paymentMethod === "Bank Deposit" ? "BDO Account ending 1234" :
                                 paymentMethod === "Cash" ? "Pay at Office" :
                                 "No payment method selected"}
                            </p>
                        </div>
                    </div>
                    <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full">Update Payment Method</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Update Payment Method</DialogTitle>
                                <DialogDescription>Select your preferred payment method.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <RadioGroup value={tempPaymentMethod} onValueChange={(v: "Credit Card" | "GCash" | "Cash" | "Bank Deposit" | "None") => setTempPaymentMethod(v)}>
                                    <div className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-slate-50">
                                        <RadioGroupItem value="Credit Card" id="cc" />
                                        <Label htmlFor="cc" className="flex-1 cursor-pointer flex items-center gap-2">
                                            <CreditCard className="h-4 w-4" /> Credit or Debit Card
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-slate-50">
                                        <RadioGroupItem value="GCash" id="gcash" />
                                        <Label htmlFor="gcash" className="flex-1 cursor-pointer flex items-center gap-2">
                                            <Smartphone className="h-4 w-4 text-blue-600" /> GCash
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-slate-50">
                                        <RadioGroupItem value="Bank Deposit" id="bank" />
                                        <Label htmlFor="bank" className="flex-1 cursor-pointer flex items-center gap-2">
                                            <Banknote className="h-4 w-4" /> Bank Deposit
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-slate-50">
                                        <RadioGroupItem value="Cash" id="cash" />
                                        <Label htmlFor="cash" className="flex-1 cursor-pointer flex items-center gap-2">
                                            <Wallet className="h-4 w-4 text-green-600" /> Cash
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-slate-50">
                                        <RadioGroupItem value="None" id="none" />
                                        <Label htmlFor="none" className="flex-1 cursor-pointer flex items-center gap-2">
                                            <Ban className="h-4 w-4 text-red-600" /> None
                                        </Label>
                                    </div>
                                </RadioGroup>

                                {tempPaymentMethod === "Credit Card" && (
                                    <div className="space-y-4 pt-2 border-t">
                                        <div className="space-y-2">
                                            <Label>Card Number</Label>
                                            <Input placeholder="0000 0000 0000 0000" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input placeholder="MM/YY" />
                                            <Input placeholder="CVC" />
                                        </div>
                                    </div>
                                )}

                                {tempPaymentMethod === "GCash" && (
                                    <div className="space-y-2 pt-2 border-t">
                                        <Label>GCash Number</Label>
                                        <Input placeholder="09XX XXX XXXX" />
                                        <p className="text-xs text-muted-foreground">You will be redirected to GCash to authorize.</p>
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>Cancel</Button>
                                <Button onClick={() => {
                                    setPaymentMethod(tempPaymentMethod);
                                    showSuccessToast(`Payment method updated to ${tempPaymentMethod}`);
                                    setIsPaymentOpen(false);
                                }}>Save Changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Separator />
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">Billing History</h4>
                        <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Jan 01, 2026</span>
                                <span>$199.00</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Dec 01, 2025</span>
                                <span>$199.00</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Nov 01, 2025</span>
                                <span>$199.00</span>
                            </div>
                        </div>
                        <Button variant="link" className="w-full h-auto p-0 text-blue-600">View All Invoices</Button>
                    </div>
                </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Basic Settings Tab */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>Configure basic system behavior and appearance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Theme Presets</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.values(PRESET_THEMES).map((theme) => (
                    <div 
                      key={theme.id}
                      className="cursor-pointer border rounded-lg p-2 hover:bg-slate-50 transition-colors flex flex-col gap-2"
                      onClick={() => applyTheme(theme)}
                    >
                      <div className="flex gap-1 h-8 w-full rounded overflow-hidden border">
                        <div className="flex-1" style={{ backgroundColor: theme.primary }} />
                        <div className="flex-1" style={{ backgroundColor: theme.secondary }} />
                        <div className="flex-1" style={{ backgroundColor: theme.accent }} />
                        <div className="flex-1" style={{ backgroundColor: theme.background }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">{theme.name}</span>
                        {(primaryColor === theme.primary && secondaryColor === theme.secondary) && (
                            <CheckIcon className="h-3 w-3 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Custom Colors</Label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <Label htmlFor="primaryColor" className="text-xs text-muted-foreground">Primary</Label>
                        <div className="flex items-center gap-2 mt-1">
                            <Input 
                                id="primaryColor" 
                                type="color"
                                className="w-16 h-10 p-1 cursor-pointer"
                                value={getColorValue(primaryColor)}
                                onChange={e => handleColorChange('primary', e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="secondaryColor" className="text-xs text-muted-foreground">Secondary</Label>
                        <div className="flex items-center gap-2 mt-1">
                            <Input 
                                id="secondaryColor" 
                                type="color"
                                className="w-16 h-10 p-1 cursor-pointer"
                                value={getColorValue(secondaryColor)}
                                onChange={e => handleColorChange('secondary', e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="accentColor" className="text-xs text-muted-foreground">Accent</Label>
                        <div className="flex items-center gap-2 mt-1">
                            <Input 
                                id="accentColor" 
                                type="color"
                                className="w-16 h-10 p-1 cursor-pointer"
                                value={getColorValue(accentColor)}
                                onChange={e => handleColorChange('accent', e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="backgroundColor" className="text-xs text-muted-foreground">Background</Label>
                        <div className="flex items-center gap-2 mt-1">
                            <Input 
                                id="backgroundColor" 
                                type="color"
                                className="w-16 h-10 p-1 cursor-pointer"
                                value={getColorValue(backgroundColor)}
                                onChange={e => handleColorChange('background', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                  <h3 className="font-medium">Academic Year Defaults</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Current School Year</Label>
                        <select 
                            value={schoolYear} 
                            onChange={(e) => setSchoolYear(e.target.value)} 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="SY 2023-2024">SY 2023-2024</option>
                            <option value="SY 2024-2025">SY 2024-2025</option>
                            <option value="SY 2025-2026">SY 2025-2026</option>
                            <option value="SY 2026-2027">SY 2026-2027</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label>Current Term</Label>
                        <select 
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="1st Semester">1st Semester</option>
                            <option value="2nd Semester">2nd Semester</option>
                            <option value="Summer">Summer</option>
                        </select>
                    </div>
                  </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
