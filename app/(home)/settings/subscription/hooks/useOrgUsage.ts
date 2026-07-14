"use client";

import { useApiQuery } from "@/services/useApiQuery";
import { useSelectedOrg } from "@/providers/SelectedOrgProvider";
import {
  orgCoursesCountEndpoint,
  orgGroupsCountEndpoint,
  orgStudentsCountEndpoint,
  orgTrainersCountEndpoint,
} from "@/app/(home)/dashboard/api/dashboard.api";
import type {
  OrgCoursesCountResponse,
  OrgGroupsCountResponse,
  OrgStudentsCountResponse,
  OrgTrainersCountResponse,
} from "@/app/(home)/dashboard/types/dashboard.types";

// Reuses the same org-scoped count endpoints the dashboard already calls, so
// the subscription page can show "X of Y used" bars instead of just limits.
export const useOrgUsage = () => {
  const { orgId } = useSelectedOrg();
  const enabled = !!orgId;

  const { data: studentsRes, isLoading: loadingStudents } =
    useApiQuery<OrgStudentsCountResponse>({
      endpoint: enabled ? orgStudentsCountEndpoint(orgId) : "",
      method: "GET",
      queryKey: ["dashboard-org-students", orgId],
      enabled,
    });

  const { data: trainersRes, isLoading: loadingTrainers } =
    useApiQuery<OrgTrainersCountResponse>({
      endpoint: enabled ? orgTrainersCountEndpoint(orgId) : "",
      method: "GET",
      queryKey: ["dashboard-org-trainers", orgId],
      enabled,
    });

  const { data: coursesRes, isLoading: loadingCourses } =
    useApiQuery<OrgCoursesCountResponse>({
      endpoint: enabled ? orgCoursesCountEndpoint(orgId) : "",
      method: "GET",
      queryKey: ["dashboard-org-courses", orgId],
      enabled,
    });

  const { data: groupsRes, isLoading: loadingGroups } =
    useApiQuery<OrgGroupsCountResponse>({
      endpoint: enabled ? orgGroupsCountEndpoint(orgId) : "",
      method: "GET",
      queryKey: ["dashboard-org-groups", orgId],
      enabled,
    });

  const students = studentsRes?.data;
  const trainers = trainersRes?.data;

  return {
    isLoading:
      enabled &&
      (loadingStudents || loadingTrainers || loadingCourses || loadingGroups),
    usedStudents: students
      ? students.activeStudents + students.inactiveStudents
      : null,
    usedTrainers: trainers
      ? trainers.activeTrainers + trainers.inactiveTrainers
      : null,
    usedCourses: coursesRes?.data?.totalCourses ?? null,
    usedGroups: groupsRes?.data?.length ?? null,
  };
};
