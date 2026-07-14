"use client";

import { useRouter } from "next/navigation";
import OnboardLayout from "../../login/components/OnboardLayout";
import RevSec from "../../login/components/RevSec";
import RevItem from "../../login/components/RevItem";
import SuccessBox from "../../login/components/SuccessBox";
import DynamicField from "./DynamicField";
import { useUserOnboard } from "../hooks/useUserOnboard";
import FormField from "@/ui/FormField";
import Input from "@/ui/Input";
import PasswordInput from "@/ui/PasswordInput";
import SingleSelect from "@/ui/SingleSelect";

const COLOR = "#0284c7";

const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const UserOnboard = () => {
  const router = useRouter();
  const {
    formData,
    upd,
    formAnswers,
    updAnswer,
    updFile,
    orgOptions,
    orgListLoading,
    sections,
    formLoading,
    stepLabels,
    validate,
    handleSubmit,
    isPending,
  } = useUserOnboard();

  const renderStep = (onboardStep: number) => {
    if (onboardStep > stepLabels.length)
      return (
        <SuccessBox
          icon="check-circle-fill"
          color={COLOR}
          title="Onboarding Complete!"
          desc="Your account has been registered successfully. Please sign in to access the platform."
          onAction={() => router.push("/auth/login")}
        />
      );

    if (onboardStep === 1)
      return (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Create Your Account
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Fill in your account details to get started
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Full Name *">
              <Input
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => upd({ fullName: e.target.value })}
              />
            </FormField>
            <FormField label="Email Address *">
              <Input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => upd({ email: e.target.value })}
              />
            </FormField>
            <FormField label="Phone Number *">
              <Input
                type="tel"
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={(e) => upd({ phone: e.target.value })}
                maxLength={10}
              />
            </FormField>
            <FormField label="Gender *">
              <SingleSelect
                options={GENDER_OPTIONS}
                value={formData.gender}
                onChange={(val) => upd({ gender: String(val) })}
                placeholder="Select gender"
                searchable={false}
              />
            </FormField>
            <FormField label="Password *">
              <PasswordInput
                placeholder="Create password (min 6 chars)"
                value={formData.password}
                onChange={(e) => upd({ password: e.target.value })}
              />
            </FormField>
            <FormField label="Confirm Password *">
              <PasswordInput
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => upd({ confirmPassword: e.target.value })}
              />
            </FormField>
          </div>
        </div>
      );

    if (onboardStep === 2) {
      return (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Select Organization *
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Choose the organization you belong to
            </p>
          </div>
          <FormField label="Organization *">
            <SingleSelect
              options={orgOptions}
              value={formData.orgId}
              isLoading={orgListLoading}
              onChange={(val) => {
                const org = orgOptions.find(
                  (o: { value: string | number; label: string }) =>
                    o.value === val,
                );
                upd({ orgId: String(val), orgName: org?.label || "" });
              }}
              placeholder="Search and select your organization…"
            />
          </FormField>
          {formData.orgId && formLoading && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <i className="bi bi-arrow-repeat animate-spin" /> Loading
              organization form…
            </div>
          )}
        </div>
      );
    }

    const sectionIdx = onboardStep - 3;
    if (sectionIdx >= 0 && sectionIdx < sections.length) {
      const section = sections[sectionIdx];
      const fields = [...section.fields]
        .filter((f) => !f.hidden)
        .sort((a, b) => a.displayOrder - b.displayOrder);
      return (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {section.title}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{section.description}</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {fields.map((field) => (
              <DynamicField
                key={field.id}
                field={field}
                value={formAnswers[field.id] || ""}
                onChange={(val) => updAnswer(field.id, val)}
                onFileChange={(file) => updFile(field.id, file)}
              />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Review & Submit</h3>
          <p className="mt-1 text-sm text-slate-500">
            Please review your information before submitting
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <RevSec title="Account Information">
            <RevItem label="Full Name" value={formData.fullName} />
            <RevItem label="Email Address" value={formData.email} />
            <RevItem
              label="Phone Number"
              value={formData.phone ? "+91 " + formData.phone : undefined}
            />
            <RevItem label="Gender" value={formData.gender} />
            <RevItem label="Organization" value={formData.orgName} />
          </RevSec>
          {sections.map((section) => (
            <RevSec key={section.id} title={section.title}>
              {section.fields
                .filter((f) => !f.hidden)
                .map((field) => (
                  <RevItem
                    key={field.id}
                    label={field.label}
                    value={formAnswers[field.id]}
                  />
                ))}
            </RevSec>
          ))}
        </div>
      </div>
    );
  };

  return (
    <OnboardLayout
      color={COLOR}
      sidebarTitle="User Onboarding Flow"
      sidebarDesc="Register your account, select your organization, and complete the onboarding form."
      stepLabels={stepLabels}
      onFinalSubmit={handleSubmit}
      validate={validate}
      submitting={isPending}
    >
      {renderStep}
    </OnboardLayout>
  );
};

export default UserOnboard;
