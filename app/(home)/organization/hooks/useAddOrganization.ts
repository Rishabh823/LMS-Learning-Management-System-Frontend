"use client";

import { useState } from "react";
import { useApiMutation } from "@/services/useApiMutation";
import { successMsg } from "@/utils/notify";
import { ADDORG } from "../api/organization.api";

export interface AddOrganizationFormState {
  fullName: string;
  ownersName: string;
  address: string;
  emailId: string;
  emailIdAlternate: string;
  state: string;
  city: string;
  zipcode: string;
  contact: string;
  country: string;
  contactAlternate: string;
  aboutOrganization: string;
  logo: File | null;
}

const INITIAL_STATE: AddOrganizationFormState = {
  fullName: "",
  ownersName: "",
  address: "",
  emailId: "",
  emailIdAlternate: "",
  state: "",
  city: "",
  zipcode: "",
  contact: "",
  country: "",
  contactAlternate: "",
  aboutOrganization: "",
  logo: null,
};

export const useAddOrganization = (onSuccess: () => void) => {
  const [form, setForm] = useState<AddOrganizationFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<
    Partial<Record<keyof AddOrganizationFormState, string>>
  >({});

  const update = (patch: Partial<AddOrganizationFormState>) =>
    setForm((f) => ({ ...f, ...patch }));

  const reset = () => {
    setForm(INITIAL_STATE);
    setErrors({});
  };

  const { mutate, isPending } = useApiMutation({ queryKey: ["organizations"] });

  const validate = () => {
    const next: typeof errors = {};
    if (!form.fullName.trim()) next.fullName = "Organization name is required";
    if (!form.ownersName.trim()) next.ownersName = "Owner's name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailId))
      next.emailId = "Enter a valid email address";
    if (!form.contact.trim() || form.contact.trim().length < 10)
      next.contact = "Enter a valid contact number";
    if (!form.address.trim()) next.address = "Address is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!validate()) return;

    const data = new FormData();
    data.append("fullName", form.fullName);
    data.append("ownersName", form.ownersName);
    data.append("address", form.address);
    data.append("emailId", form.emailId);
    data.append("emailIdAlternate", form.emailIdAlternate);
    data.append("state", form.state);
    data.append("city", form.city);
    data.append("zipcode", form.zipcode);
    data.append("contact", form.contact);
    data.append("country", form.country);
    data.append("contactAlternate", form.contactAlternate);
    data.append("aboutOrganization", form.aboutOrganization);
    if (form.logo) data.append("logo", form.logo);

    mutate(
      {
        method: "post",
        endpoint: ADDORG(),
        body: data,
        config: { headers: { "Content-Type": "multipart/form-data" } },
      },
      {
        onSuccess: () => {
          successMsg("Organization created successfully.");
          reset();
          onSuccess();
        },
      },
    );
  };

  return { form, update, errors, submit, isPending, reset };
};
