import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Tenant, tenants } from "../data/tenants";

const ROOT_DOMAINS = ["eskuwela.ph", "eskuwela.dev"];
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

const normalizeHostname = (hostname: string) => hostname.replace(/^www\./, "");

const getSubdomainFromHostname = (hostname: string) => {
  const normalized = normalizeHostname(hostname);

  if (LOCAL_HOSTS.has(normalized)) {
    return "";
  }

  if (ROOT_DOMAINS.includes(normalized)) {
    return "";
  }

  const matchedRoot = ROOT_DOMAINS.find((root) => normalized.endsWith(`.${root}`));
  if (matchedRoot) {
    const remainder = normalized.slice(0, -1 * (`.${matchedRoot}`.length));
    return remainder.split(".").pop() || "";
  }

  if (normalized.includes("localhost")) {
    const parts = normalized.split(".");
    return parts.length > 1 ? parts[0] : "";
  }

  const parts = normalized.split(".");
  if (parts.length <= 2) {
    return "";
  }

  return parts[0] === "www" ? "" : parts[0];
};

interface TenantContextType {
  currentTenant: Tenant | null;
  setTenant: (tenantId: string) => void;
  updateTenant: (updates: Partial<Tenant>) => void;
  availableTenants: Tenant[];
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);

  const updateTenant = (updates: Partial<Tenant>) => {
      if (currentTenant) {
          const updatedTenant = { ...currentTenant, ...updates };
          setCurrentTenant(updatedTenant);
          
          // Update the static list as well so switching contexts keeps data for this session
          const index = tenants.findIndex(t => t.id === currentTenant.id);
          if (index !== -1) {
              tenants[index] = updatedTenant;
          }
      }
  };

  useEffect(() => {
    const hostname = normalizeHostname(window.location.hostname);
    const subdomain = getSubdomainFromHostname(hostname);

    // 2. Check for query param override (for dev/testing)
    const params = new URLSearchParams(window.location.search);
    const tenantParam = params.get("tenant");

    let tenant: Tenant | undefined;

    if (tenantParam) {
      tenant = tenants.find(t => t.id === tenantParam || t.subdomain === tenantParam);
    } else if (subdomain) {
      tenant = tenants.find(t => t.subdomain === subdomain);
    } else if (
      ROOT_DOMAINS.includes(hostname) ||
      LOCAL_HOSTS.has(hostname) ||
      ROOT_DOMAINS.some((root) => hostname === `www.${root}`)
    ) {
      tenant = null;
    }

    if (tenant) {
      setCurrentTenant(tenant);
      console.log(`Tenant set to: ${tenant.name} (${tenant.id})`);
    } else {
      console.warn("No tenant could be resolved from subdomain or params.");
    }

  }, []);

  const setTenant = (tenantId: string) => {
    const tenant = tenants.find((t) => t.id === tenantId);
    if (tenant) {
      setCurrentTenant(tenant);
      // Here you could also apply theme changes dynamically if needed
    }
  };

  return (
    <TenantContext.Provider value={{ currentTenant, setTenant, updateTenant, availableTenants: tenants }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
