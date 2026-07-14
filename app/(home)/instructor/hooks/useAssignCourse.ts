"use client";

import { useEffect, useMemo, useState } from "react";
import { useApiQuery } from "@/services/useApiQuery";
import { useApiMutation } from "@/services/useApiMutation";
import { successMsg } from "@/utils/notify";
import { ALLCOURSES, ASSIGNCOURSETRAINER } from "../api/instructor.api";
import type { Course, Instructor } from "../types/instructor.types";

export const useAssignCourse = (
  instructor: Instructor | null,
  onSuccess: () => void,
) => {
  const [courseIds, setCourseIds] = useState<(string | number)[]>([]);

  useEffect(() => {
    setCourseIds([]);
  }, [instructor]);

  const { data, isLoading: coursesLoading } = useApiQuery<any>({
    endpoint: ALLCOURSES(),
    method: "GET",
    queryKey: ["courses", "all"],
    enabled: !!instructor,
  });

  // "/course/" response shape wasn't confirmed, so we defensively support
  // either a bare array or a { data: [...] } wrapper.
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

  const { mutate, isPending } = useApiMutation({ queryKey: ["instructors"] });

  const submit = () => {
    if (!instructor || courseIds.length === 0) return;

    mutate(
      {
        method: "post",
        endpoint: ASSIGNCOURSETRAINER(),
        body: { courseIds, trainerId: instructor.userId },
      },
      {
        onSuccess: () => {
          successMsg("Courses assigned successfully.");
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
