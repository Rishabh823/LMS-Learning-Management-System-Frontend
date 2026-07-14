"use client";

import { useEffect, useState } from "react";
import { useApiMutation } from "@/services/useApiMutation";
import { successMsg } from "@/utils/notify";
import { UPDATEGROUP } from "../api/group.api";
import type { Group } from "../types/group.types";

export interface EditGroupFormState {
  groupName: string;
  groupDescription: string;
}

const toFormState = (group: Group | null): EditGroupFormState => ({
  groupName: group?.groupName || "",
  groupDescription: group?.groupDescription || "",
});

export const useEditGroup = (group: Group | null, onSuccess: () => void) => {
  const [form, setForm] = useState<EditGroupFormState>(toFormState(group));
  const [errors, setErrors] = useState<
    Partial<Record<keyof EditGroupFormState, string>>
  >({});

  useEffect(() => {
    setForm(toFormState(group));
    setErrors({});
  }, [group]);

  const update = (patch: Partial<EditGroupFormState>) =>
    setForm((f) => ({ ...f, ...patch }));

  const { mutate, isPending } = useApiMutation({ queryKey: ["groups"] });

  const validate = () => {
    const next: typeof errors = {};
    if (!form.groupName.trim()) next.groupName = "Group name is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!group || !validate()) return;

    const postdata = {
      groupName: form.groupName,
      groupId: group.groupId,
      groupDescription: form.groupDescription,
      organizationId: group.organizationId,
    };

    mutate(
      { method: "put", endpoint: UPDATEGROUP(), body: postdata },
      {
        onSuccess: () => {
          successMsg("Group updated successfully.");
          onSuccess();
        },
      },
    );
  };

  return { form, update, errors, submit, isPending };
};
