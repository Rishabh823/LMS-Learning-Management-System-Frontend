"use client";

import { useState } from "react";
import { useApiMutation } from "@/services/useApiMutation";
import { useSelectedOrg } from "@/providers/SelectedOrgProvider";
import { successMsg } from "@/utils/notify";
import { CREATEGROUP } from "../api/group.api";

export interface AddGroupFormState {
  groupName: string;
  groupDescription: string;
}

const INITIAL_STATE: AddGroupFormState = { groupName: "", groupDescription: "" };

export const useAddGroup = (onSuccess: () => void) => {
  const { orgId } = useSelectedOrg();
  const [form, setForm] = useState<AddGroupFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<
    Partial<Record<keyof AddGroupFormState, string>>
  >({});

  const update = (patch: Partial<AddGroupFormState>) =>
    setForm((f) => ({ ...f, ...patch }));

  const reset = () => {
    setForm(INITIAL_STATE);
    setErrors({});
  };

  const { mutate, isPending } = useApiMutation({ queryKey: ["groups"] });

  const validate = () => {
    const next: typeof errors = {};
    if (!form.groupName.trim()) next.groupName = "Group name is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!validate()) return;

    const data = {
      groupName: form.groupName,
      groupDescription: form.groupDescription,
      organizationId: orgId,
    };

    mutate(
      { method: "post", endpoint: CREATEGROUP(), body: data },
      {
        onSuccess: () => {
          successMsg("Group created successfully.");
          reset();
          onSuccess();
        },
      },
    );
  };

  return { form, update, errors, submit, isPending, reset };
};
