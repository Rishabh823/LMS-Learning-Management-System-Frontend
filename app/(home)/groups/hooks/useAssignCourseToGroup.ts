"use client";

import { useEffect, useMemo, useState } from "react";
import { useApiQuery } from "@/services/useApiQuery";
import { useApiMutation } from "@/services/useApiMutation";
import { successMsg } from "@/utils/notify";
import { ALLCOURSES, ASSIGNCOURSETOGROUP } from "../api/group.api";
import type { Course, Group } from "../types/group.types";

export const useAssignCourseToGroup = (
  group: Group | null,
  onSuccess: () => void,
) => {
  const [courseIds, setCourseIds] = useState<(string | number)[]>([]);

  useEffect(() => {
    setCourseIds([]);
  }, [group]);

  const { data, isLoading: coursesLoading } = useApiQuery<any>({
    endpoint: ALLCOURSES(),
    method: "GET",
    queryKey: ["courses", "all"],
    enabled: !!group,
  });

  const courseOptions = useMemo(() => {
    const list: Course[] = Array.isArray(data) ? data : data?.data || [];
    return list.map((course) => ({
      value: course.courseId,
      label:
        course.courseName ||
        course.title ||
        course.name ||
        `Course #${course.courseId}`,
    }));
  }, [data]);

  const { mutate, isPending } = useApiMutation({ queryKey: ["groups"] });

  const submit = () => {
    if (!group || courseIds.length === 0) return;

    mutate(
      {
        method: "put",
        endpoint: ASSIGNCOURSETOGROUP(),
        body: { courseIds, groupId: group.groupId },
      },
      {
        onSuccess: () => {
          successMsg("Courses assigned to group successfully.");
          onSuccess();
        },
      },
    );
  };

  return {
    courseIds,
    setCourseIds,
    courseOptions,
    coursesLoading,
    submit,
    isPending,
  };
};
