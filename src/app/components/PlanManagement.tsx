import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Check, CreditCard } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "../config";
import { PageHeader } from "./ui/page-header";

export function PlanManagement() {
  const plans = SUBSCRIPTION_PLANS;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={CreditCard}
        title="Subscription Plans"
        subtitle="Overview of available feature packages."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className={`flex flex-col ${plan.name === 'Enterprise' ? 'border-purple-200 shadow-purple-100' : ''}`}>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-2 rounded-lg ${
                    plan.name === 'Basic' ? 'bg-slate-100 text-slate-600' :
                    plan.name === 'Pro' ? 'bg-blue-100 text-blue-600' :
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
