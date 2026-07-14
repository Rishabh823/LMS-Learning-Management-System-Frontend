"use client";

import { useApiQuery } from "@/services/useApiQuery";
import { useApiMutation } from "@/services/useApiMutation";
import { successMsg } from "@/utils/notify";
import {
  ALLSECTIONS,
  DELETEPAGE,
  DELETESECTION,
  PAGESTATUS,
  SECTIONSTATUS,
  UPDATEPAGEORDER,
  UPDATESECTIONORDER,
} from "../api/developerSettings.api";
import type {
  Section,
  SectionPage,
  SectionsListResponse,
} from "../types/developerSettings.types";

const SECTIONS_QUERY_KEY = ["dev-sections"];

export const useSections = (refetchSidebar: () => void) => {
  const { data, isLoading } = useApiQuery<SectionsListResponse>({
    endpoint: ALLSECTIONS(),
    method: "GET",
    queryKey: SECTIONS_QUERY_KEY,
  });

  const sections = [...(data?.data || [])].sort(
    (a, b) => a.position - b.position,
  );

  // --- Section-level mutations ---

  const { mutate: sectionStatusMutate, isPending: isTogglingSectionStatus } =
    useApiMutation({ queryKey: SECTIONS_QUERY_KEY });

  const toggleSectionStatus = (section: Section) => {
    sectionStatusMutate(
      { method: "put", endpoint: SECTIONSTATUS(section.id) },
      {
        onSuccess: () => {
          successMsg(
            section.status
              ? "Section deactivated successfully."
              : "Section activated successfully.",
          );
          refetchSidebar();
        },
      },
    );
  };

  const { mutate: sectionDeleteMutate, isPending: isDeletingSection } =
    useApiMutation({ queryKey: SECTIONS_QUERY_KEY });

  const deleteSection = (section: Section, onDone?: () => void) => {
    sectionDeleteMutate(
      { method: "delete", endpoint: DELETESECTION(section.id) },
      {
        onSuccess: () => {
          successMsg("Section deleted successfully.");
          onDone?.();
          refetchSidebar();
        },
      },
    );
  };

  const { mutate: sectionOrderMutate, isPending: isReorderingSections } =
    useApiMutation({ queryKey: SECTIONS_QUERY_KEY });

  const moveSection = (section: Section, direction: "up" | "down") => {
    const idx = sections.findIndex((s) => s.id === section.id);
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const reordered = [...sections];
    [reordered[idx], reordered[targetIdx]] = [
      reordered[targetIdx],
      reordered[idx],
    ];
    const body = reordered.map((s, i) => ({ id: s.id, position: i + 1 }));

    sectionOrderMutate(
      { method: "put", endpoint: UPDATESECTIONORDER(), body },
      {
        onSuccess: () => {
          successMsg("Sections reordered successfully.");
          refetchSidebar();
        },
      },
    );
  };

  // --- Page-level mutations ---

  const { mutate: pageStatusMutate, isPending: isTogglingPageStatus } =
    useApiMutation({ queryKey: SECTIONS_QUERY_KEY });

  const togglePageStatus = (page: SectionPage) => {
    pageStatusMutate(
      { method: "put", endpoint: PAGESTATUS(page.id) },
      {
        onSuccess: () => {
          successMsg(
            page.status
              ? "Page deactivated successfully."
              : "Page activated successfully.",
          );
          refetchSidebar();
        },
      },
    );
  };

  const { mutate: pageDeleteMutate, isPending: isDeletingPage } =
    useApiMutation({ queryKey: SECTIONS_QUERY_KEY });

  const deletePage = (page: SectionPage, onDone?: () => void) => {
    pageDeleteMutate(
      { method: "delete", endpoint: DELETEPAGE(page.id) },
      {
        onSuccess: () => {
          successMsg("Page deleted successfully.");
          onDone?.();
          refetchSidebar();
        },
      },
    );
  };

  const { mutate: pageOrderMutate } = useApiMutation({
    queryKey: SECTIONS_QUERY_KEY,
  });

  const movePage = (
    section: Section,
    page: SectionPage,
    direction: "up" | "down",
  ) => {
    const pages = [...section.pages].sort((a, b) => a.position - b.position);
    const idx = pages.findIndex((p) => p.id === page.id);
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= pages.length) return;

    const reordered = [...pages];
    [reordered[idx], reordered[targetIdx]] = [
      reordered[targetIdx],
      reordered[idx],
    ];
    const body = reordered.map((p, i) => ({ id: p.id, position: i + 1 }));

    pageOrderMutate(
      { method: "put", endpoint: UPDATEPAGEORDER(section.id), body },
      {
        onSuccess: () => {
          refetchSidebar();
        },
      },
    );
  };

  return {
    sections,
    isLoading,
    toggleSectionStatus,
    isTogglingSectionStatus,
    deleteSection,
    isDeletingSection,
    moveSection,
    isReorderingSections,
    togglePageStatus,
    isTogglingPageStatus,
    deletePage,
    isDeletingPage,
    movePage,
  };
};
