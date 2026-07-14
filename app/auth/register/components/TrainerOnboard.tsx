"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { successMsg } from "@/utils/notify";
import OnboardLayout from "../../login/components/OnboardLayout";
import RevSec from "../../login/components/RevSec";
import RevItem from "../../login/components/RevItem";
import SuccessBox from "../../login/components/SuccessBox";
import FormField from "@/ui/FormField";
import Input from "@/ui/Input";
import PasswordInput from "@/ui/PasswordInput";
import SingleSelect from "@/ui/SingleSelect";

const STEP_LABELS = [
  "Create Account",
  "Personal Details",
  "Professional Details",
  "Documents Upload",
  "Review & Submit",
];
const COLOR = "#2563eb";

const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const QUALIFICATION_OPTIONS = [
  "Bachelor's Degree",
  "Master's Degree",
  "Ph.D.",
  "Diploma",
  "Other",
].map((q) => ({ value: q, label: q }));

const DOCS = [
  {
    label: "Profile Picture",
    hint: "JPG, PNG (Max 2MB)",
    key: "profilePic",
    accept: "image/*",
    icon: "person-circle",
  },
  {
    label: "Resume / CV",
    hint: "PDF (Max 5MB)",
    key: "resume",
    accept: ".pdf,.doc",
    icon: "file-earmark-text",
  },
  {
    label: "ID Proof",
    hint: "PDF, JPG, PNG (Max 5MB)",
    key: "idProof",
    accept: ".pdf,image/*",
    icon: "card-text",
  },
  {
    label: "Certificates (Optional)",
    hint: "PDF, JPG, PNG (Max 5MB)",
    key: "certs",
    accept: ".pdf,image/*",
    icon: "award",
  },
] as const;

interface TrainerFormData {
  fullName: string;
  email: string;
  password: string;
  dob: string;
  gender: string;
  phone: string;
  address: string;
  experience: string;
  qualification: string;
  skills: string;
  linkedin: string;
  profilePic?: string;
  resume?: string;
  idProof?: string;
  certs?: string;
}

const TrainerOnboard = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<TrainerFormData>({
    fullName: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    phone: "",
    address: "",
    experience: "",
    qualification: "",
    skills: "",
    linkedin: "",
  });

  const upd = (patch: Partial<TrainerFormData>) =>
    setFormData((f) => ({ ...f, ...patch }));

  const validate = (step: number) => {
    if (step === 1) {
      if (!formData.fullName.trim()) return "Please enter your full name.";
      if (!formData.email.trim()) return "Please enter your email address.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        return "Please enter a valid email address.";
      if (!formData.password.trim()) return "Please create a password.";
      if (formData.password.length < 6)
        return "Password must be at least 6 characters.";
    }
    if (step === 2) {
      if (!formData.gender) return "Please select your gender.";
      if (!formData.phone.trim()) return "Please enter your phone number.";
      if (formData.phone.length < 10)
        return "Please enter a valid 10-digit phone number.";
    }
    if (step === 3) {
      if (!formData.experience.toString().trim())
        return "Please enter your years of experience.";
      if (!formData.qualification)
        return "Please select your highest qualification.";
      if (!formData.skills.trim()) return "Please enter your skills/expertise.";
    }
    return null;
  };

  const handleSubmit = () => {
    successMsg("Your trainer application has been submitted for review.");
    router.push("/auth/login");
  };

  const renderStep = (onboardStep: number) => {
    if (onboardStep > STEP_LABELS.length)
      return (
        <SuccessBox
          icon="check-circle-fill"
          color={COLOR}
          title="Registration Submitted!"
          desc="Your trainer application has been submitted for review. You'll receive an email once approved."
          onAction={() => router.push("/auth/login")}
        />
      );

    if (onboardStep === 1)
      return (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Create Trainer Account
            </h3>
            <p className="mt-1 text-sm text-slate-500">Sign up as a trainer</p>
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
            <FormField label="Password *">
              <PasswordInput
                placeholder="Create a password (min 6 chars)"
                value={formData.password}
                onChange={(e) => upd({ password: e.target.value })}
              />
            </FormField>
          </div>
        </div>
      );

    if (onboardStep === 2)
      return (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Personal Details
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Tell us about yourself
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Date of Birth">
              <Input
                type="date"
                value={formData.dob}
                onChange={(e) => upd({ dob: e.target.value })}
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
            <FormField label="Phone Number *">
              <Input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={formData.phone}
                onChange={(e) => upd({ phone: e.target.value })}
                maxLength={10}
              />
            </FormField>
            <FormField label="Address">
              <Input
                type="text"
                placeholder="Enter your address"
                value={formData.address}
                onChange={(e) => upd({ address: e.target.value })}
              />
            </FormField>
          </div>
        </div>
      );

    if (onboardStep === 3)
      return (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Professional Details
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Your professional information
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Experience (Years) *">
              <Input
                type="number"
                min="0"
                placeholder="Years of experience"
                value={formData.experience}
                onChange={(e) => upd({ experience: e.target.value })}
              />
            </FormField>
            <FormField label="Highest Qualification *">
              <SingleSelect
                options={QUALIFICATION_OPTIONS}
                value={formData.qualification}
                onChange={(val) => upd({ qualification: String(val) })}
                placeholder="Select qualification"
                searchable={false}
              />
            </FormField>
            <FormField label="Expertise / Skills *">
              <Input
                type="text"
                placeholder="e.g. Cybersecurity, Network Security"
                value={formData.skills}
                onChange={(e) => upd({ skills: e.target.value })}
              />
            </FormField>
            <FormField label="LinkedIn (Optional)">
              <Input
                type="url"
                placeholder="LinkedIn profile link"
                value={formData.linkedin}
                onChange={(e) => upd({ linkedin: e.target.value })}
              />
            </FormField>
          </div>
        </div>
      );

    if (onboardStep === 4)
      return (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Documents Upload
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Upload required documents
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {DOCS.map((doc) => (
              <FormField key={doc.key} label={doc.label}>
                <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-sky-200 bg-sky-50/40 px-4 py-6 text-center hover:border-sky-400">
                  <input
                    type="file"
                    accept={doc.accept}
                    className="hidden"
                    onChange={(e) =>
                      upd({ [doc.key]: e.target.files?.[0]?.name })
                    }
                  />
                  {formData[doc.key] ? (
                    <>
                      <i
                        className="bi bi-check-circle-fill text-lg"
                        style={{ color: "#0d9370" }}
                      />
                      <span className="text-sm text-slate-700">
                        {formData[doc.key]}
                      </span>
                    </>
                  ) : (
                    <>
                      <i
                        className={"bi bi-" + doc.icon + " text-xl text-slate-400"}
                      />
                      <span className="text-sm text-slate-600">
                        Click to upload
                      </span>
                      <small className="text-xs text-slate-400">
                        {doc.hint}
                      </small>
                    </>
                  )}
                </label>
              </FormField>
            ))}
          </div>
        </div>
      );

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Review & Submit
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Review your details before submitting
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <RevSec title="Personal Information">
            <RevItem label="Full Name" value={formData.fullName} />
            <RevItem label="Email Address" value={formData.email} />
            <RevItem
              label="Phone Number"
              value={formData.phone ? "+91 " + formData.phone : undefined}
            />
          </RevSec>
          <RevSec title="Professional Information">
            <RevItem
              label="Experience"
              value={
                formData.experience ? formData.experience + " Years" : undefined
              }
            />
            <RevItem label="Qualification" value={formData.qualification} />
            <RevItem label="Skills" value={formData.skills} />
          </RevSec>
        </div>
      </div>
    );
  };

  return (
    <OnboardLayout
      color={COLOR}
      sidebarTitle="Trainer Onboarding Flow"
      sidebarDesc="Trainer registers and completes the trainer specific onboarding form for verification."
      stepLabels={STEP_LABELS}
      onFinalSubmit={handleSubmit}
      validate={validate}
    >
      {renderStep}
    </OnboardLayout>
  );
};

export default TrainerOnboard;
