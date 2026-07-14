"use client";

import { useEffect, useState } from "react";
import { useApiMutation } from "@/services/useApiMutation";
import { successMsg } from "@/utils/notify";
import { UPDATETRAINER } from "../api/instructor.api";
import type { Instructor } from "../types/instructor.types";

export interface EditInstructorFormState {
  name: string;
  emailId: string;
  contactNo: string;
  gender: string;
  degreeName: string;
  passingYear: string;
  totalExprience: string;
}

const toFormState = (
  instructor: Instructor | null,
): EditInstructorFormState => ({
  name: instructor?.name || "",
  emailId: instructor?.emailId || "",
  contactNo: instructor?.contactNo || "",
  gender: instructor?.gender || "",
  degreeName: instructor?.usersProfile?.degreeName || "",
  passingYear: instructor?.usersProfile?.passingYear || "",
  totalExprience:
    instructor?.usersProfile?.totalExprience != null
      ? String(instructor.usersProfile.totalExprience)
      : "",
});

export const useEditInstructor = (
  instructor: Instructor | null,
  onSuccess: () => void,
) => {
  const [form, setForm] = useState<EditInstructorFormState>(
    toFormState(instructor),
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof EditInstructorFormState, string>>
  >({});

  useEffect(() => {
    setForm(toFormState(instructor));
    setErrors({});
  }, [instructor]);

  const update = (patch: Partial<EditInstructorFormState>) =>
    setForm((f) => ({ ...f, ...patch }));

  const { mutate, isPending } = useApiMutation({ queryKey: ["instructors"] });

  const validate = () => {
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailId))
      next.emailId = "Enter a valid email address";
    if (!form.contactNo.trim() || form.contactNo.trim().length < 10)
      next.contactNo = "Enter a valid phone number";
    if (!form.gender) next.gender = "Gender is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!instructor || !validate()) return;

    const usersProfile = {
      degreeName: form.degreeName,
      passingYear: form.passingYear,
      totalExprience: parseInt(form.totalExprience, 10) || 0,
    };
    const data = {
      name: form.name,
      emailId: form.emailId,
      contactNo: form.contactNo,
      gender: form.gender,
      usersProfile,
    };

    mutate(
      { method: "put", endpoint: UPDATETRAINER(instructor.userId), body: data },
      {
        onSuccess: () => {
          successMsg("Instructor updated successfully.");
          onSuccess();
        },
      },
    );
  };

  return { form, update, errors, submit, isPending };
};
