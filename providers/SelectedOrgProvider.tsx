"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useSelect } from "@/utils/useSelect";
import useSidebar from "@/utils/useSidebar";
import { getOrgId } from "@/utils/cookieManager";

const ORG_LIST_ENDPOINT = "/org/public";

interface OrgOption {
  value: string | number;
  label: string;
}

interface SelectedOrgContextType {
  orgId: string;
  setOrgId: (id: string) => void;
  orgOptions: OrgOption[];
  orgListLoading: boolean;
  isAdmin: boolean;
}

const SelectedOrgContext = createContext<SelectedOrgContextType | undefined>(
  undefined,
);

export const useSelectedOrg = () => {
  const ctx = useContext(SelectedOrgContext);
  if (!ctx) {
    throw new Error("useSelectedOrg must be used within a SelectedOrgProvider");
  }
  return ctx;
};

export function SelectedOrgProvider({ children }: { children: ReactNode }) {
  const [orgId, setOrgId] = useState("");
  const { data } = useSidebar();
  const role = data?.data.role;
  const isAdmin = role === "ADMIN";

  // Only admins get to pick an organization, so only fetch the list for them.
  const { options: orgOptions, isLoading: orgListLoading } = useSelect(
    ORG_LIST_ENDPOINT,
    "GET",
    { labelKey: "fullName", valueKey: "organizationId", enabled: isAdmin },
  );

  // Everyone else: use the organization id captured at login time.
  useEffect(() => {
    if (role && !isAdmin) {
      const loginOrgId = getOrgId();
      if (loginOrgId) setOrgId(loginOrgId);
    }
  }, [role, isAdmin]);

  return (
    <SelectedOrgContext.Provider
      value={{
        orgId,
        setOrgId,
        orgOptions: isAdmin ? orgOptions : [],
        orgListLoading: isAdmin ? orgListLoading : false,
        isAdmin,
      }}
    >
      {children}
    </SelectedOrgContext.Provider>
  );
}
