import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Tenant, tenants } from "../data/tenants";

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
    // 1. Check for subdomain
    const hostname = window.location.hostname;
    const parts = hostname.split(".");
    let subdomain = "";
    
    // Simplistic subdomain extraction:
    // If localhost, we might not have a subdomain unless configured like "sub.localhost"
    // Ideally: tenant.domain.com -> 'tenant'
    if (parts.length > 1 && !hostname.includes("localhost")) {
        subdomain = parts[0];
    } else if (hostname.includes("localhost") && parts.length > 1) {
       // Handle "sub.localhost"
       subdomain = parts[0];
    }

    // 2. Check for query param override (for dev/testing)
    const params = new URLSearchParams(window.location.search);
    const tenantParam = params.get("tenant");

    let tenant: Tenant | undefined;

    if (tenantParam) {
      tenant = tenants.find(t => t.id === tenantParam || t.subdomain === tenantParam);
    } else if (subdomain) {
      tenant = tenants.find(t => t.subdomain === subdomain);
    }

    // Fallback for dev: default to first tenant if on localhost with no subdomain/param
    // Removing the default behavior to allow for a landing page on the root domain
    /*
    if (!tenant && hostname.includes("localhost") && parts.length === 1) {
       tenant = tenants[0]; // defaults to gtwfsl
    }
    */

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
