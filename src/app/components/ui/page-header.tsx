import { ReactNode, useState } from "react";
import { ChevronRight, LucideIcon, MoreHorizontal } from "lucide-react";
import { Button } from "./button";
import { useIsMobile } from "./use-mobile";
import { cn } from "./utils";

interface PageHeaderProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<string | { label: string }>;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ icon: Icon, title, subtitle, breadcrumbs, actions, className = "" }: PageHeaderProps) {
  const crumbs = breadcrumbs ?? ["Portal", title];
  const isMobile = useIsMobile();
  const [actionsOpen, setActionsOpen] = useState(false);
  const fallbackInitials = title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <header className={cn("flex min-w-0 flex-col gap-4 md:flex-row md:items-start md:justify-between", className)}>
      <div className="header-info min-w-0 space-y-2">
        <nav className="flex min-w-0 items-center gap-1 overflow-hidden text-xs font-semibold uppercase tracking-wide text-slate-400">
          {crumbs.map((crumb, index) => {
            const label = typeof crumb === "string" ? crumb : crumb.label;
            const isLast = index === crumbs.length - 1;

            return (
              <span key={`${label}-${index}`} className="flex min-w-0 items-center gap-1">
                <span className={cn("truncate", isLast && "text-slate-500")}>{label}</span>
                {!isLast && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
              </span>
            );
          })}
        </nav>

        <div className="flex min-w-0 items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-100/70 bg-blue-50/70 text-blue-600">
            {Icon ? <Icon size={22} /> : <span className="text-sm font-extrabold">{fallbackInitials}</span>}
          </div>
          <div className="min-w-0 space-y-1">
            <h1 className="truncate text-2xl font-extrabold tracking-normal text-slate-900 sm:text-3xl">{title}</h1>
            {subtitle && <p className="max-w-3xl text-sm font-medium leading-6 text-slate-500 sm:text-base">{subtitle}</p>}
          </div>
        </div>
      </div>

      {actions && (isMobile ? (
        <div className="header-actions relative self-end">
          <Button
            variant="outline"
            size="icon"
            aria-expanded={actionsOpen}
            aria-label="Page actions"
            onClick={() => setActionsOpen((open) => !open)}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>

          {actionsOpen && (
            <div className="absolute right-0 top-11 z-50 w-60 rounded-md border bg-white p-2 shadow-lg">
              <div className="flex flex-col gap-2 [&_[data-slot=button]]:h-10 [&_[data-slot=button]]:w-full [&_[data-slot=button]]:justify-start [&_[data-slot=button]]:rounded-lg [&_[data-slot=button]]:px-4 [&_[data-slot=button]]:text-sm [&_[data-slot=button]]:font-semibold [&_[data-slot=select-trigger]]:h-10 [&_[data-slot=select-trigger]]:rounded-lg">
                {actions}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="header-actions flex shrink-0 flex-wrap items-center justify-end gap-3 [&_[data-slot=button]]:h-10 [&_[data-slot=button]]:rounded-lg [&_[data-slot=button]]:px-4 [&_[data-slot=button]]:text-sm [&_[data-slot=button]]:font-semibold [&_[data-slot=select-trigger]]:h-10 [&_[data-slot=select-trigger]]:rounded-lg">
          {actions}
        </div>
      ))}
    </header>
  );
}
