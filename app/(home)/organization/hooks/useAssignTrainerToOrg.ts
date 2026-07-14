"use client";

import { useMemo, useState } from "react";
import { useApiQuery } from "@/services/useApiQuery";
import { useApiMutation } from "@/services/useApiMutation";
import { successMsg } from "@/utils/notify";
import { ASSIGNTRAINERTOORG, ORG, TRAINER } from "../api/organization.api";
import type {
  OrganizationsListResponse,
  TrainersListResponse,
} from "../types/organization.types";

export const useAssignTrainerToOrg = () => {
  const [organizationId, setOrganizationId] = useState<string | number>("");
  const [trainerIds, setTrainerIds] = useState<(string | number)[]>([]);

  const { data: orgData, isLoading: orgsLoading } =
    useApiQuery<OrganizationsListResponse>({
      endpoint: ORG("active", 0, 100),
      method: "GET",
      queryKey: ["organizations", "active", "select"],
    });

  const orgOptions = useMemo(
    () =>
      (orgData?.data || []).map((org) => ({
        value: org.organizationId,
        label: org.fullName,
      })),
    [orgData],
  );

  const { data: trainerData, isLoading: trainersLoading } =
    useApiQuery<TrainersListResponse>({
      endpoint: TRAINER(0, 100),
      method: "GET",
      queryKey: ["trainers", "all", "select"],
    });

  const trainerOptions = useMemo(
    () =>
      (trainerData?.data || []).map((trainer) => ({
        value: trainer.userId,
        label: trainer.name,
      })),
    [trainerData],
  );

  const { mutate, isPending } = useApiMutation();

  const submit = () => {
    if (!organizationId || trainerIds.length === 0) return;

    mutate(
      {
        method: "post",
        endpoint: ASSIGNTRAINERTOORG(),
        body: { trainerIds, organizationId },
      },
      {
        onSuccess: () => {
          successMsg("Trainers assigned to organization successfully.");
          setTrainerIds([]);
        },
      },
    );
  };

  return {
    organizationId,
    setOrganizationId,
    orgOptions,
    orgsLoading,
    trainerIds,
    setTrainerIds,
    trainerOptions,
    trainersLoading,
    submit,
    isPending,
  };
};
