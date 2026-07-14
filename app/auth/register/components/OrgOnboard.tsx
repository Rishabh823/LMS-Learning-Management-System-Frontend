"use client";

import { useRouter } from "next/navigation";
import OnboardLayout from "../../login/components/OnboardLayout";
import RevSec from "../../login/components/RevSec";
import RevItem from "../../login/components/RevItem";
import SuccessBox from "../../login/components/SuccessBox";
import FormField from "@/ui/FormField";
import Input from "@/ui/Input";
import TextArea from "@/ui/TextArea";
import PasswordInput from "@/ui/PasswordInput";
import SingleSelect from "@/ui/SingleSelect";
import Loader from "@/ui/Loader";
import PlanCard from "@/shared/subscription/PlanCard";
import { formatPlanPrice } from "@/shared/subscription/types";
import { useOrgOnboard } from "../hooks/useOrgOnboard";

const COLOR = "#4f46e5";

const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const fieldError = (msg?: string) =>
  msg ? ({ message: msg } as any) : undefined;

const OrgOnboard = () => {
  const router = useRouter();
  const {
    formData,
    upd,
    plans,
    plansLoading,
    selectedPlanId,
    setSelectedPlanId,
    selectedPlan,
    stepLabels,
    validate,
    handleSubmit,
    submitting,
    skipPlanStep,
    fieldErrors,
    onFieldBlur,
  } = useOrgOnboard();

  const renderStep = (onboardStep: number) => {
    if (onboardStep > stepLabels.length)
      return (
        <SuccessBox
          icon="building-check"
          color={COLOR}
          title="Organization Registered!"
          desc="Your organization has been set up successfully. You're being redirected to your dashboard."
          onAction={() => router.push("/dashboard")}
        />
      );

    if (onboardStep === 1)
      return (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Select a Plan
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Choose the subscription plan for your organization
            </p>
          </div>
          {plansLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.planId}
                  plan={plan}
                  selected={selectedPlanId === plan.planId}
                  onSelect={() => setSelectedPlanId(plan.planId)}
                />
              ))}
            </div>
          )}
        </div>
      );

    if (onboardStep === 2)
      return (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Organization Details
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Tell us about your organization
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              label="Organization Name *"
              error={fieldError(fieldErrors.organizationName)}
            >
              <Input
                type="text"
                placeholder="Enter organization name"
                value={formData.organizationName}
                onChange={(e) => upd({ organizationName: e.target.value })}
                onBlur={() => onFieldBlur("organizationName")}
              />
            </FormField>
            <FormField
              label="Legal Business Name *"
              error={fieldError(fieldErrors.legalBusinessName)}
            >
              <Input
                type="text"
                placeholder="Enter legal business name"
                value={formData.legalBusinessName}
                onChange={(e) => upd({ legalBusinessName: e.target.value })}
                onBlur={() => onFieldBlur("legalBusinessName")}
              />
            </FormField>
            <FormField
              label="Organization Type *"
              error={fieldError(fieldErrors.organizationType)}
            >
              <Input
                type="text"
                placeholder="e.g. Private Limited, LLP"
                value={formData.organizationType}
                onChange={(e) => upd({ organizationType: e.target.value })}
                onBlur={() => onFieldBlur("organizationType")}
              />
            </FormField>
            <FormField
              label="Industry *"
              error={fieldError(fieldErrors.industry)}
            >
              <Input
                type="text"
                placeholder="e.g. Information Technology"
                value={formData.industry}
                onChange={(e) => upd({ industry: e.target.value })}
                onBlur={() => onFieldBlur("industry")}
              />
            </FormField>
            <FormField
              label="Company Size *"
              error={fieldError(fieldErrors.companySize)}
            >
              <Input
                type="text"
                placeholder="e.g. 51-200 employees"
                value={formData.companySize}
                onChange={(e) => upd({ companySize: e.target.value })}
                onBlur={() => onFieldBlur("companySize")}
              />
            </FormField>
            <FormField
              label="Registration Number *"
              error={fieldError(fieldErrors.registrationNumber)}
            >
              <Input
                type="text"
                placeholder="Company registration number"
                value={formData.registrationNumber}
                onChange={(e) => upd({ registrationNumber: e.target.value })}
                onBlur={() => onFieldBlur("registrationNumber")}
              />
            </FormField>
            <FormField
              label="GST Number (Optional)"
              error={fieldError(fieldErrors.gstNumber)}
            >
              <Input
                type="text"
                placeholder="e.g. 22AAAAA0000A1Z5"
                value={formData.gstNumber}
                onChange={(e) => upd({ gstNumber: e.target.value })}
                onBlur={() => onFieldBlur("gstNumber")}
              />
            </FormField>
            <FormField
              label="PAN Number (Optional)"
              error={fieldError(fieldErrors.panNumber)}
            >
              <Input
                type="text"
                placeholder="e.g. ABCDE1234F"
                value={formData.panNumber}
                onChange={(e) => upd({ panNumber: e.target.value })}
                onBlur={() => onFieldBlur("panNumber")}
              />
            </FormField>
            <FormField
              label="Website (Optional)"
              error={fieldError(fieldErrors.website)}
            >
              <Input
                type="url"
                placeholder="e.g. https://example.com"
                value={formData.website}
                onChange={(e) => upd({ website: e.target.value })}
                onBlur={() => onFieldBlur("website")}
              />
            </FormField>
            <div className="sm:col-span-2">
              <FormField label="Description (Optional)">
                <TextArea
                  placeholder="Briefly describe your organization"
                  value={formData.description}
                  onChange={(e) => upd({ description: e.target.value })}
                  rows={3}
                />
              </FormField>
            </div>
          </div>
        </div>
      );

    if (onboardStep === 3)
      return (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Admin Details</h3>
            <p className="mt-1 text-sm text-slate-500">
              Tell us about the administrator
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              label="Full Name *"
              error={fieldError(fieldErrors.adminName)}
            >
              <Input
                type="text"
                placeholder="Enter full name"
                value={formData.adminName}
                onChange={(e) => upd({ adminName: e.target.value })}
                onBlur={() => onFieldBlur("adminName")}
              />
            </FormField>
            <FormField
              label="Email Address *"
              error={fieldError(fieldErrors.adminEmail)}
            >
              <Input
                type="email"
                placeholder="name@company.com"
                value={formData.adminEmail}
                onChange={(e) => upd({ adminEmail: e.target.value })}
                onBlur={() => onFieldBlur("adminEmail")}
              />
            </FormField>
            <FormField
              label="Phone Number *"
              error={fieldError(fieldErrors.adminPhone)}
            >
              <Input
                type="tel"
                placeholder="Enter mobile number"
                value={formData.adminPhone}
                onChange={(e) =>
                  upd({ adminPhone: e.target.value.replace(/\D/g, "") })
                }
                onBlur={() => onFieldBlur("adminPhone")}
                maxLength={10}
              />
            </FormField>
            <FormField
              label="Gender *"
              error={fieldError(fieldErrors.gender)}
            >
              <SingleSelect
                options={GENDER_OPTIONS}
                value={formData.gender}
                onChange={(val) => {
                  upd({ gender: String(val) });
                  onFieldBlur("gender");
                }}
                placeholder="Select gender"
                searchable={false}
              />
            </FormField>
            <FormField label="Designation (Optional)">
              <Input
                type="text"
                placeholder="e.g. HR Manager"
                value={formData.designation}
                onChange={(e) => upd({ designation: e.target.value })}
              />
            </FormField>
            <FormField label="Department (Optional)">
              <Input
                type="text"
                placeholder="e.g. Human Resources"
                value={formData.department}
                onChange={(e) => upd({ department: e.target.value })}
              />
            </FormField>
            <FormField
              label="Password *"
              error={fieldError(fieldErrors.password)}
            >
              <PasswordInput
                placeholder="Create password (min 6 chars)"
                value={formData.password}
                onChange={(e) => upd({ password: e.target.value })}
                onBlur={() => onFieldBlur("password")}
              />
            </FormField>
            <FormField
              label="Confirm Password *"
              error={fieldError(fieldErrors.confirmPassword)}
            >
              <PasswordInput
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => upd({ confirmPassword: e.target.value })}
                onBlur={() => onFieldBlur("confirmPassword")}
              />
            </FormField>
          </div>
        </div>
      );

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Review & Submit</h3>
          <p className="mt-1 text-sm text-slate-500">
            Review your details before submitting
            {selectedPlan && selectedPlan.price > 0
              ? " — you'll be redirected to complete payment."
              : "."}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <RevSec title="Selected Plan">
            <RevItem
              label="Plan"
              value={
                selectedPlan
                  ? `${selectedPlan.planName} — ${formatPlanPrice(
                      selectedPlan.price,
                      selectedPlan.currency,
                    )}${
                      selectedPlan.price > 0
                        ? "/" + selectedPlan.billingCycle.toLowerCase()
                        : ""
                    }`
                  : undefined
              }
            />
          </RevSec>
          <RevSec title="Organization Information">
            <RevItem
              label="Organization Name"
              value={formData.organizationName}
            />
            <RevItem
              label="Legal Business Name"
              value={formData.legalBusinessName}
            />
            <RevItem
              label="Organization Type"
              value={formData.organizationType}
            />
            <RevItem label="Industry" value={formData.industry} />
            <RevItem label="Company Size" value={formData.companySize} />
          </RevSec>
          <RevSec title="Admin Details">
            <RevItem label="Admin Name" value={formData.adminName} />
            <RevItem label="Email Address" value={formData.adminEmail} />
            <RevItem
              label="Phone Number"
              value={
                formData.adminPhone ? "+91 " + formData.adminPhone : undefined
              }
            />
            <RevItem label="Gender" value={formData.gender} />
          </RevSec>
        </div>
      </div>
    );
  };

  return (
    <OnboardLayout
      color={COLOR}
      sidebarTitle="Organization Self Onboarding Flow"
      sidebarDesc="Organization admin registers and completes organization onboarding process."
      stepLabels={stepLabels}
      onFinalSubmit={handleSubmit}
      validate={validate}
      submitting={submitting}
      initialStep={skipPlanStep ? 2 : 1}
    >
      {renderStep}
    </OnboardLayout>
  );
};

export default OrgOnboard;
