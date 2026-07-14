"use client";

import { useApiQuery } from "@/services/useApiQuery";
import { useSelectedOrg } from "@/providers/SelectedOrgProvider";
import { useAuthToken } from "@/utils/useAuthToken";
import {
  TOTAL_ORGANIZATIONS_ENDPOINT,
  TOTAL_TRAINERS_ENDPOINT,
  TOTAL_USERS_ENDPOINT,
  orgGroupsCountEndpoint,
  orgStudentsCountEndpoint,
  orgTrainersCountEndpoint,
  orgCoursesCountEndpoint,
  orgExamsCountEndpoint,
  orgQuizzesCountEndpoint,
  orgLiveTrainingsCountEndpoint,
} from "../api/dashboard.api";
import type {
  TotalOrganizationsResponse,
  TotalTrainersResponse,
  TotalUsersResponse,
  OrgGroupsCountResponse,
  OrgStudentsCountResponse,
  OrgTrainersCountResponse,
  OrgCoursesCountResponse,
  OrgExamsCountResponse,
  OrgQuizzesCountResponse,
  OrgLiveTrainingsCountResponse,
} from "../types/dashboard.types";

export const useAdminDashboard = (role?: string) => {
  const { orgId, setOrgId, orgOptions, orgListLoading } = useSelectedOrg();
  const token = useAuthToken();
  const isAuthed = !!token;
  // These three cards only render for ADMIN (see AdminDashboard.tsx), so
  // there's no reason to fire them for STUDENT/TRAINER/ORGANIZATION logins.
  const isAdmin = role === "ADMIN";
  const adminEnabled = isAuthed && isAdmin;

  const { data: totalOrganizations, isLoading: loadingTotalOrgs } =
    useApiQuery<TotalOrganizationsResponse>({
      endpoint: TOTAL_ORGANIZATIONS_ENDPOINT,
      method: "GET",
      queryKey: ["dashboard-total-organizations"],
      enabled: adminEnabled,
    });

  const { data: totalTrainers, isLoading: loadingTotalTrainers } =
    useApiQuery<TotalTrainersResponse>({
      endpoint: TOTAL_TRAINERS_ENDPOINT,
      method: "GET",
      queryKey: ["dashboard-total-trainers"],
      enabled: adminEnabled,
    });

  const { data: totalUsers, isLoading: loadingTotalUsers } =
    useApiQuery<TotalUsersResponse>({
      endpoint: TOTAL_USERS_ENDPOINT,
      method: "GET",
      queryKey: ["dashboard-total-users"],
      enabled: adminEnabled,
    });

  const enabled = isAuthed && !!orgId;

  const { data: groupsRes, isLoading: loadingGroups } =
    useApiQuery<OrgGroupsCountResponse>({
      endpoint: enabled ? orgGroupsCountEndpoint(orgId) : "",
      method: "GET",
      queryKey: ["dashboard-org-groups", orgId],
      enabled,
    });

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

  const { data: examsRes, isLoading: loadingExams } =
    useApiQuery<OrgExamsCountResponse>({
      endpoint: enabled ? orgExamsCountEndpoint(orgId) : "",
      method: "GET",
      queryKey: ["dashboard-org-exams", orgId],
      enabled,
    });

  const { data: quizzesRes, isLoading: loadingQuizzes } =
    useApiQuery<OrgQuizzesCountResponse>({
      endpoint: enabled ? orgQuizzesCountEndpoint(orgId) : "",
      method: "GET",
      queryKey: ["dashboard-org-quizzes", orgId],
      enabled,
    });

  const { data: liveTrainingsRes, isLoading: loadingLiveTrainings } =
    useApiQuery<OrgLiveTrainingsCountResponse>({
      endpoint: enabled ? orgLiveTrainingsCountEndpoint(orgId) : "",
      method: "GET",
      queryKey: ["dashboard-org-live-trainings", orgId],
      enabled,
    });

  const courses = coursesRes?.data;
  const exams = examsRes?.data;
  const liveTrainings = liveTrainingsRes?.data;
  const groups = groupsRes?.data || [];

  const notStartedCourses = courses
    ? Math.max(
        courses.totalCourses -
          courses.ongoingCourses -
          courses.plannedCourses -
          courses.completedCourses,
        0,
      )
    : 0;

  return {
    orgOptions,
    orgListLoading,
    orgId,
    setOrgId,

    stats: {
      totalOrganizations: totalOrganizations?.data ?? 0,
      totalTrainers: totalTrainers?.data ?? 0,
      totalUsers: totalUsers?.data.totalUsers ?? 0,
      totalCourses: courses?.totalCourses ?? 0,
      totalExams: exams?.totalExams ?? 0,
      totalLiveTrainings: liveTrainings?.totalTrainings ?? 0,
    },

    courses,
    notStartedCourses,
    exams,
    liveTrainings,
    groups,
    students: studentsRes?.data,
    trainers: trainersRes?.data,
    quizzes: quizzesRes?.data,

    isLoading:
      loadingTotalOrgs ||
      loadingTotalTrainers ||
      loadingTotalUsers ||
      (enabled &&
        (loadingGroups ||
          loadingStudents ||
          loadingTrainers ||
          loadingCourses ||
          loadingExams ||
          loadingQuizzes ||
          loadingLiveTrainings)),
  };
};
