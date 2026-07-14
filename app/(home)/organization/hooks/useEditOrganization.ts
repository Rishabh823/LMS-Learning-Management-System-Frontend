"use client";

import { useEffect, useState } from "react";
import { useApiMutation } from "@/services/useApiMutation";
import { successMsg } from "@/utils/notify";
import { UPDATEORG } from "../api/organization.api";
import type { Organization } from "../types/organization.types";

export interface EditOrganizationFormState {
  fullName: string;
  ownersName: string;
  address: string;
  emailId: string;
  state: string;
  city: string;
  zipcode: string;
  contact: string;
  country: string;
  aboutOrganization: string;
}

const toFormState = (
  org: Organization | null,
): EditOrganizationFormState => ({
  fullName: org?.fullName || "",
  ownersName: org?.ownersName || "",
  address: org?.address || "",
  emailId: org?.emailId || "",
  state: org?.state || "",
  city: org?.city || "",
  zipcode: org?.zipcode || "",
  contact: org?.contact || "",
  country: org?.country || "",
  aboutOrganization: org?.aboutOrganization || "",
});

export const useEditOrganization = (
  organization: Organization | null,
  onSuccess: () => void,
) => {
  const [form, setForm] = useState<EditOrganizationFormState>(
    toFormState(organization),
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof EditOrganizationFormState, string>>
  >({});

  useEffect(() => {
    setForm(toFormState(organization));
    setErrors({});
  }, [organization]);

  const update = (patch: Partial<EditOrganizationFormState>) =>
    setForm((f) => ({ ...f, ...patch }));

  const { mutate, isPending } = useApiMutation({ queryKey: ["organizations"] });

  const validate = () => {
    const next: typeof errors = {};
    if (!form.fullName.trim()) next.fullName = "Organization name is required";
    if (!form.ownersName.trim()) next.ownersName = "Owner's name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailId))
      next.emailId = "Enter a valid email address";
    if (!form.contact.trim() || form.contact.trim().length < 10)
      next.contact = "Enter a valid contact number";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!organization || !validate()) return;

    const postData = {
      emailId: form.emailId,
      emailIdAlternate: null,
      aboutOrganization: form.aboutOrganization,
      address: form.address,
      city: form.city,
      contact: form.contact,
      contactAlternate: null,
      country: form.country,
      zipcode: form.zipcode,
      fullName: form.fullName,
      ownersName: form.ownersName,
      state: form.state,
      organizationId: organization.organizationId,
    };

    mutate(
      { method: "put", endpoint: UPDATEORG(), body: postData },
      {
        onSuccess: () => {
          successMsg("Organization updated successfully.");
          onSuccess();
        },
      },
    );
  };

  return { form, update, errors, submit, isPending };
};
