"use client";

import { FileText } from "lucide-react";
import Loader from "@/ui/Loader";
import { useOnboardingForm } from "../hooks/useOnboardingForm";
import FormBuilder from "./FormBuilder";
import FormPreview from "./FormPreview";

const OnboardingFormView = () => {
  const form = useOnboardingForm();
  const { isAdmin, canEdit, orgId, isLoading, fetchedForm } = form;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Onboarding Form
            </h2>
            <p className="text-sm text-slate-500">
              {canEdit
                ? "Build the form new members fill out when they join your organization."
                : "View the onboarding form configured for an organization."}
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isAdmin && !orgId ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white py-16 text-slate-400">
            <FileText size={28} />
            <p className="text-sm">
              Select an organization to view its onboarding form.
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader />
          </div>
        ) : canEdit ? (
          <FormBuilder form={form} />
        ) : (
          <FormPreview form={fetchedForm} />
        )}
      </div>
    </div>
  );
};

export default OnboardingFormView;
