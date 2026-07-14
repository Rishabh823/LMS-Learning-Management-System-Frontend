"use client";

import Link from "next/link";
import useSidebar from "@/utils/useSidebar";
import FormField from "@/ui/FormField";
import SingleSelect from "@/ui/SingleSelect";
import MultiSelect from "@/ui/MultiSelect";
import Button from "@/ui/Button";
import { useAssignTrainerToOrg } from "../hooks/useAssignTrainerToOrg";

const AssignInstructorView = () => {
  const { data: sidebarData } = useSidebar();
  const role = sidebarData?.data.role;

  const {
    organizationId,
    setOrganizationId,
    orgOptions,
    orgsLoading,
    trainerIds,
    setTrainerIds,
    trainerOptions,
    trainersLoading,
    submit,
    isPending,
  } = useAssignTrainerToOrg();

  if (role && role !== "ADMIN") {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-400">
        You don&apos;t have permission to access this page.
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Assign Instructors to Organization
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Select an organization and the instructors to assign to it.
          </p>
        </div>
        <Link href="/organization">
          <Button variant="secondary" className="shrink-0 rounded-md px-4 py-2">
            Organization List
          </Button>
        </Link>
      </div>

      <FormField label="Organization" required>
        <SingleSelect
          options={orgOptions}
          value={organizationId}
          onChange={setOrganizationId}
          placeholder="Select Organization"
          isLoading={orgsLoading}
        />
      </FormField>

      <FormField label="Instructors" required>
        <MultiSelect
          options={trainerOptions}
          value={trainerIds}
          onChange={setTrainerIds}
          placeholder="Select instructors to assign"
          isLoading={trainersLoading}
        />
      </FormField>

      <div className="flex justify-end border-t border-slate-100 pt-4">
        <Button
          variant="primary"
          onClick={submit}
          disabled={isPending || !organizationId || trainerIds.length === 0}
          className="rounded-md px-6 py-2.5"
        >
          {isPending ? "Assigning..." : "Assign Instructors"}
        </Button>
      </div>
    </div>
  );
};

export default AssignInstructorView;
