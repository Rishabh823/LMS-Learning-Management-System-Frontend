"use client";

import { useMemo, useState } from "react";
import { useApiQuery } from "@/services/useApiQuery";
import { useApiMutation } from "@/services/useApiMutation";
import { successMsg } from "@/utils/notify";
import { ASSIGNCOURSETOORG, COURSE, ORG } from "../api/organization.api";
import type { Course, OrganizationsListResponse } from "../types/organization.types";

export const useAssignCourseToOrg = () => {
  const [organizationId, setOrganizationId] = useState<string | number>("");
  const [courseIds, setCourseIds] = useState<(string | number)[]>([]);

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

  const { data: courseData, isLoading: coursesLoading } = useApiQuery<any>({
    endpoint: COURSE(),
    method: "GET",
    queryKey: ["courses", "all"],
  });

  // "/course/" response shape wasn't confirmed, so we defensively support
  // either a bare array or a { data: [...] } wrapper.
  const courseOptions = useMemo(() => {
    const list: Course[] = Array.isArray(courseData)
      ? courseData
      : courseData?.data || [];
    return list.map((course) => ({
      value: course.courseId,
      label:
        course.courseName ||
        course.title ||
        course.name ||
        `Course #${course.courseId}`,
    }));
  }, [courseData]);

  const { mutate, isPending } = useApiMutation();

  const submit = () => {
    if (!organizationId || courseIds.length === 0) return;

    mutate(
      {
        method: "post",
        endpoint: ASSIGNCOURSETOORG(),
        body: { courseIds, organizationId },
      },
      {
        onSuccess: () => {
          successMsg("Courses assigned to organization successfully.");
          setCourseIds([]);
        },
      },
    );
  };

  return {
    organizationId,
    setOrganizationId,
    orgOptions,
    orgsLoading,
    courseIds,
    setCourseIds,
    courseOptions,
    coursesLoading,
    submit,
    isPending,
  };
};
