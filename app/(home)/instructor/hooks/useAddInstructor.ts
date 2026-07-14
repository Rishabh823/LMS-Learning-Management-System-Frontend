"use client";

import { useState } from "react";
import { useApiMutation } from "@/services/useApiMutation";
import { successMsg } from "@/utils/notify";
import { SIGNUPTRAINER } from "../api/instructor.api";

export interface AddInstructorFormState {
  name: string;
  emailId: string;
  contactNo: string;
  gender: string;
  password: string;
  confirmPassword: string;
  degreeName: string;
  passingYear: string;
  totalExprience: string;
  percentage: string;
}

const INITIAL_STATE: AddInstructorFormState = {
  name: "",
  emailId: "",
  contactNo: "",
  gender: "",
  password: "",
  confirmPassword: "",
  degreeName: "",
  passingYear: "",
  totalExprience: "",
  percentage: "",
};

export const useAddInstructor = (onSuccess: () => void) => {
  const [form, setForm] = useState<AddInstructorFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<
    Partial<Record<keyof AddInstructorFormState, string>>
  >({});

  const update = (patch: Partial<AddInstructorFormState>) =>
    setForm((f) => ({ ...f, ...patch }));

  const reset = () => {
    setForm(INITIAL_STATE);
    setErrors({});
  };

  const { mutate, isPending } = useApiMutation({ queryKey: ["instructors"] });

  const validate = () => {
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailId))
      next.emailId = "Enter a valid email address";
    if (!form.contactNo.trim() || form.contactNo.trim().length < 10)
      next.contactNo = "Enter a valid phone number";
    if (!form.gender) next.gender = "Gender is required";
    if (!form.password || form.password.length < 6)
      next.password = "Password must be at least 6 characters";
    if (form.confirmPassword !== form.password)
      next.confirmPassword = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!validate()) return;

    const usersProfile = {
      degreeName: form.degreeName,
      passingYear: form.passingYear,
      percentage: form.percentage,
      totalExprience: form.totalExprience,
    };
    const postData = {
      name: form.name,
      emailId: form.emailId,
      contactNo: form.contactNo,
      gender: form.gender,
      password: form.password,
      usersProfile,
    };

    mutate(
      { method: "post", endpoint: SIGNUPTRAINER(), body: postData },
      {
        onSuccess: () => {
          successMsg("Instructor created successfully.");
          reset();
          onSuccess();
        },
      },
    );
  };

  return { form, update, errors, submit, isPending, reset };
};
