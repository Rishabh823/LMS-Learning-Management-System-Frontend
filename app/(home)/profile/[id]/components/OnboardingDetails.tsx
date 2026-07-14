import { useState } from "react";
import { FileText, ClipboardList } from "lucide-react";
import type { OnboardingData } from "@/app/(home)/users/types/user.types";
import FieldFileDialog from "./FieldFileDialog";
import FieldFileUploadButton from "./FieldFileUploadButton";

const FILE_TYPES = ["FILE", "IMAGE"];

const OnboardingDetails = ({
  onboarding,
}: {
  onboarding: OnboardingData | null;
}) => {
  const [viewingField, setViewingField] = useState<{
    fieldId: number;
    label: string;
  } | null>(null);

  if (!onboarding || !onboarding.sections?.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white py-16 text-slate-400">
        <ClipboardList size={28} />
        <p className="text-sm">No onboarding details submitted yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="text-base font-bold text-slate-900">
          Onboarding Details
        </h3>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            onboarding.submitted
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {onboarding.submitted
            ? `Submitted${
                onboarding.submittedDate
                  ? ` on ${new Date(onboarding.submittedDate).toLocaleDateString()}`
                  : ""
              }`
            : "Not Submitted"}
        </span>
      </div> */}

      {onboarding.sections.map((section, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
        >
          <h4 className="mb-3 border-l-4 border-sky-500 pl-3 text-sm font-bold text-slate-900">
            {section.sectionTitle}
          </h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.fields.map((field, fieldIdx) => (
              <div key={fieldIdx}>
                <p className="text-xs text-slate-400">
                  {field.label}
                  {field.required && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </p>
                {FILE_TYPES.includes(field.type) ? (
                  <div className="mt-1 flex items-center gap-1.5">
                    {field.value && field.fieldId != null ? (
                      <button
                        type="button"
                        onClick={() =>
                          setViewingField({
                            fieldId: field.fieldId as number,
                            label: field.label,
                          })
                        }
                        className="inline-flex min-w-0 items-center gap-1.5 rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-sky-600 hover:bg-sky-50 cursor-pointer"
                      >
                        <FileText size={12} className="shrink-0" />
                        <span className="max-w-40 truncate">{field.value}</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600">
                        <FileText size={12} className="shrink-0" />
                        <span className="truncate">{field.value || "—"}</span>
                      </span>
                    )}
                    {field.fieldId != null && (
                      <FieldFileUploadButton
                        fieldId={field.fieldId}
                        accept={field.type === "IMAGE" ? "image/*" : undefined}
                      />
                    )}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-slate-800">
                    {field.value || "—"}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <FieldFileDialog
        fieldId={viewingField?.fieldId ?? null}
        title={viewingField?.label}
        onClose={() => setViewingField(null)}
      />
    </div>
  );
};

export default OnboardingDetails;
