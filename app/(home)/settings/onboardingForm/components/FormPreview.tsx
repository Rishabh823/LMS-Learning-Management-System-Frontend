import { FileText } from "lucide-react";
import type { OnboardingForm } from "../types/onboardingForm.types";

const FormPreview = ({ form }: { form: OnboardingForm | null }) => {
  if (!form) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white py-16 text-slate-400">
        <FileText size={28} />
        <p className="text-sm">
          This organization hasn&apos;t created an onboarding form yet.
        </p>
      </div>
    );
  }

  const sections = [...form.sections].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{form.title}</h3>
          {form.description && (
            <p className="mt-1 text-sm text-slate-500">{form.description}</p>
          )}
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            form.status === "PUBLISHED"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {form.status || "DRAFT"}
        </span>
      </div>

      {sections.map((section) => (
        <div
          key={section.id}
          className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
        >
          <h4 className="font-semibold text-slate-900">{section.title}</h4>
          {section.description && (
            <p className="mt-0.5 text-xs text-slate-400">
              {section.description}
            </p>
          )}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[...section.fields]
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((field) => (
                <div
                  key={field.id}
                  className="rounded-lg border border-slate-100 p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-700">
                      {field.label}
                      {field.required && (
                        <span className="ml-1 text-red-500">*</span>
                      )}
                    </p>
                    <span className="rounded-md bg-sky-50 px-1.5 py-0.5 text-[10px] font-medium text-sky-600">
                      {field.fieldType}
                    </span>
                  </div>
                  {field.options.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {field.options.map((opt) => (
                        <span
                          key={opt.id}
                          className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-500"
                        >
                          {opt.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FormPreview;
