"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { errorMsg } from "@/utils/notify";
import Bg from "./Bg";
import Button from "@/ui/Button";

const OnboardLayout = ({
  color,
  sidebarTitle,
  sidebarDesc,
  stepLabels,
  onFinalSubmit,
  validate,
  submitting,
  initialStep = 1,
  children,
}: {
  color: string;
  sidebarTitle: string;
  sidebarDesc: string;
  stepLabels: string[];
  onFinalSubmit: () => void;
  validate?: (step: number) => string | null | undefined;
  submitting?: boolean;
  initialStep?: number;
  children: (step: number) => ReactNode;
}) => {
  const [onboardStep, setOnboardStep] = useState(initialStep);
  const router = useRouter();
  const total = stepLabels.length;
  const isSuccess = onboardStep > total;
  const isLastForm = onboardStep === total;

  const handleNext = () => {
    if (validate) {
      const err = validate(onboardStep);
      if (err) {
        errorMsg(err);
        return;
      }
    }
    if (isLastForm) onFinalSubmit();
    else setOnboardStep((s) => s + 1);
  };

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-linear-to-br from-sky-100 via-white to-sky-50 md:flex-row">
      <Bg />
      {/* Sidebar */}
      <div
        className="relative z-10 flex w-full shrink-0 flex-col justify-between overflow-y-auto p-8 text-white md:h-full md:w-80"
        style={{ background: color }}
      >
        <div>
          <div className="flex items-center gap-2">
            <img
              src="/zenith%20guard%20transparent%20logo.png"
              alt=""
              className="h-8 w-8 object-contain"
            />
            <span className="font-bold">ZenithLMS</span>
          </div>
          <div className="mt-8 text-xl font-bold">{sidebarTitle}</div>
          <p className="mt-2 text-sm text-white/80">{sidebarDesc}</p>
          <div className="mt-8 flex flex-col gap-4">
            {stepLabels.map((s, i) => (
              <div
                key={i}
                className={
                  "flex items-center gap-3 text-sm " +
                  (i + 1 <= onboardStep ? "text-white" : "text-white/50")
                }
              >
                <div
                  className={
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold " +
                    (i + 1 <= onboardStep
                      ? "bg-white text-slate-900"
                      : "border border-white/40")
                  }
                >
                  {i + 1 < onboardStep ? <i className="bi bi-check" /> : i + 1}
                </div>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
        <button
          className="mt-8 flex items-center gap-2 text-sm text-white/80 hover:text-white"
          onClick={() => router.push("/")}
        >
          <i className="bi bi-arrow-left" /> Back to Home
        </button>
      </div>

      {/* Main */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col p-6 md:p-12">
        <div className="h-1.5 w-full shrink-0 overflow-hidden rounded-full bg-sky-100">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: (onboardStep / (total + 1)) * 100 + "%",
              background: color,
            }}
          />
        </div>
        <div className="mt-6 shrink-0">
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: color + "1a", color }}
          >
            Step {isSuccess ? total + 1 : onboardStep} of {total + 1}
          </span>
        </div>
        <div className="mt-6 min-h-0 flex-1 overflow-y-auto pr-1">
          {children(onboardStep)}
        </div>
        {!isSuccess && (
          <div className="mt-6 flex shrink-0 flex-wrap items-center gap-3">
            {onboardStep > 1 && (
              <Button
                variant="clear"
                className="flex items-center gap-2 px-5 py-2.5"
                onClick={() => setOnboardStep((s) => s - 1)}
              >
                <i className="bi bi-arrow-left" /> Back
              </Button>
            )}
            <Button
              variant="none"
              className="flex items-center gap-2 px-6 py-2.5 text-white shadow-sm transition-opacity hover:opacity-90"
              style={{ background: color }}
              onClick={handleNext}
              disabled={isLastForm && submitting}
            >
              {isLastForm ? (
                <>
                  <i className="bi bi-check-lg" />{" "}
                  {submitting ? "Submitting…" : "Submit"}
                </>
              ) : (
                <>
                  Continue <i className="bi bi-arrow-right" />
                </>
              )}
            </Button>
            {onboardStep === 1 && (
              <button
                type="button"
                className="ml-auto text-sm font-semibold text-sky-600 hover:underline"
                onClick={() => router.push("/auth/login")}
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardLayout;
