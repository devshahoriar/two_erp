"use client";

import {
  getOrgForSelect,
  setActiveOrg,
} from "@/app/admin/data/organization/action";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/Credenza";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSwr from "swr";
import { LoadingButton } from "./CustomButton";

type ACTIVORG = {
  orgId: string | undefined;
  orgName: string | undefined;
};

const SelectOrg = ({ activeOrg }: { activeOrg: ACTIVORG }) => {
  const [open, setOpen] = useState(false);
  const { refresh } = useRouter();
  const pathName = usePathname();
  const [selectedOrg, setSelectedOrg] = useState<{
    id: number;
    name: string;
  } | null>(
    activeOrg.orgId && activeOrg.orgName
      ? { id: parseInt(activeOrg.orgId), name: activeOrg.orgName }
      : null,
  );
  const { data, isLoading } = useSwr(
    open ? "getOrgForSelect" : null,
    getOrgForSelect,
  );

  const handleSelectOrg = (org: { id: number; name: string }) => {
    setSelectedOrg(org);
  };

  const handleSetOrg = async () => {
    if (!selectedOrg) return toast.error("Please select an organization");
    await setActiveOrg(selectedOrg.id.toString(), selectedOrg.name);
    setOpen(false);
    refresh();
  };

  useEffect(() => {
    if (pathName === "/admin/data/organization") {
      return;
    }
    if (!activeOrg?.orgId) {
      setOpen(true);
    }
  }, [activeOrg]);

  return (
    <Credenza open={open}>
      <CredenzaTrigger asChild>
        <button
          onClick={() => setOpen(true)}
          className="bg-accent-foreground/20 mx-4 rounded-xl px-3 py-1 text-sm font-semibold"
        >
          {activeOrg.orgName || (
            <span className="font-semibold text-red-600">
              Select Organization
            </span>
          )}
        </button>
      </CredenzaTrigger>
      <CredenzaContent onInteractOutside={(e) => e.preventDefault()}>
        <CredenzaHeader>
          <CredenzaTitle>Select Organization</CredenzaTitle>
          <CredenzaDescription>
            Choose an organization from the list below
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="animate-spin" />
            </div>
          ) : data && data.length > 0 ? (
            <div className="max-h-[50vh] space-y-2 overflow-y-auto p-1">
              {data.map((org) => (
                <div
                  key={org.id}
                  onClick={() => handleSelectOrg(org)}
                  className={`hover:bg-accent cursor-pointer rounded-lg border p-3 transition-all ${
                    selectedOrg?.id === org.id
                      ? "relative border-green-500 bg-green-50 pl-5 dark:bg-green-950/20"
                      : "border-border hover:border-input"
                  }`}
                >
                  {selectedOrg?.id === org.id && (
                    <div className="absolute top-0 bottom-0 left-0 w-1 rounded-l-lg bg-green-500"></div>
                  )}
                  <p className="font-medium">{org.name}</p>
                  <p className="text-muted-foreground text-xs">ID: {org.id}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground flex flex-col items-center space-y-2 py-8 text-center">
              No organizations found
              <Link className="underline" href="/admin/data/organization">
                Create Organization
              </Link>
            </div>
          )}
        </CredenzaBody>
        <CredenzaFooter>
          <LoadingButton onClick={handleSetOrg}>Set Organization</LoadingButton>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};

export default SelectOrg;
