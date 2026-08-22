import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Check, CreditCard } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/app/config";
import { PageHeader } from "@/app/components/ui/page-header";

export function PlanManagement() {
  const plans = SUBSCRIPTION_PLANS;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={CreditCard}
        title="Subscription Plans"
        subtitle="Overview of available feature packages."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <Card key={plan.name} className={`flex flex-col overflow-hidden ${plan.name === 'Narra' ? 'border-purple-200 shadow-purple-100' : ''}`}>
            <div className="border-b bg-slate-950/95 p-4">
              <div className="flex items-center justify-center rounded-xl border border-white/10 bg-black/90 p-4">
                <img
                  src={plan.image}
                  alt={`${plan.name} plan artwork`}
                  className="h-28 w-full max-w-[240px] object-contain"
                />
              </div>
            </div>
            <CardHeader className="space-y-3">
              <div className="flex items-start gap-2">
                <div className={`p-2 rounded-lg ${
                    plan.name === 'Sampaguita' ? 'bg-slate-100 text-slate-600' :
                    plan.name === 'Talisay' ? 'bg-blue-100 text-blue-600' :
                    plan.name === 'Yakal' ? 'bg-amber-100 text-amber-600' :
                    'bg-purple-100 text-purple-600'
                }`}>
                    <plan.icon className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className="ml-auto flex flex-col items-end gap-0.5 py-1">
                    <span className="font-bold text-base">{plan.price}</span>
                    <span className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">{plan.monthly} (10 mos)</span>
                    <span className="text-[10px] text-muted-foreground font-normal border-t border-slate-200 mt-0.5 pt-0.5">{plan.onboarding}</span>
                </Badge>
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-2">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
