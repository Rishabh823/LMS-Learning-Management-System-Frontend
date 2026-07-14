"use client";

import { useState } from "react";
import { Plus, Settings2 } from "lucide-react";
import useSidebar from "@/utils/useSidebar";
import Button from "@/ui/Button";
import Loader from "@/ui/Loader";
import DeleteConfirmDialog from "@/ui/DeleteConfirmDialog";
import { useSections } from "../hooks/useSections";
import SectionCard from "./SectionCard";
import AddSectionDialog from "./AddSectionDialog";
import EditSectionDialog from "./EditSectionDialog";
import AddPageDialog from "./AddPageDialog";
import EditPageDialog from "./EditPageDialog";
import type { Section, SectionPage } from "../types/developerSettings.types";

const SectionsView = () => {
  const { data: sidebarData, refetch } = useSidebar();
  const role = sidebarData?.data.role;

  const {
    sections,
    isLoading,
    toggleSectionStatus,
    isTogglingSectionStatus,
    deleteSection,
    isDeletingSection,
    moveSection,
    togglePageStatus,
    isTogglingPageStatus,
    deletePage,
    isDeletingPage,
    movePage,
  } = useSections(refetch);

  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [deletingSection, setDeletingSection] = useState<Section | null>(null);
  const [addPageForSection, setAddPageForSection] = useState<Section | null>(
    null,
  );
  const [editingPage, setEditingPage] = useState<SectionPage | null>(null);
  const [deletingPage, setDeletingPage] = useState<SectionPage | null>(null);

  if (role && role !== "ADMIN") {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-400">
        You don&apos;t have permission to access this page.
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex shrink-0 items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <Settings2 size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Sidebar Sections &amp; Pages
            </h2>
            <p className="text-sm text-slate-500">
              Manage the modules and pages shown across the app sidebar.
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={() => setAddSectionOpen(true)}
          className="flex items-center gap-1.5 rounded-md px-4 py-2.5"
        >
          <Plus size={16} /> Add Section
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader />
          </div>
        ) : sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white py-12 text-slate-400">
            <Settings2 size={28} />
            <p className="text-sm">No sections created yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sections.map((section, idx) => (
              <SectionCard
                key={section.id}
                section={section}
                isFirst={idx === 0}
                isLast={idx === sections.length - 1}
                onMoveUp={() => moveSection(section, "up")}
                onMoveDown={() => moveSection(section, "down")}
                onToggleStatus={() => toggleSectionStatus(section)}
                isTogglingStatus={isTogglingSectionStatus}
                onEdit={() => setEditingSection(section)}
                onDelete={() => setDeletingSection(section)}
                onAddPage={() => setAddPageForSection(section)}
                onEditPage={setEditingPage}
                onDeletePage={setDeletingPage}
                onTogglePageStatus={togglePageStatus}
                isTogglingPageStatus={isTogglingPageStatus}
                onMovePage={(page, direction) =>
                  movePage(section, page, direction)
                }
              />
            ))}
          </div>
        )}
      </div>

      <AddSectionDialog
        open={addSectionOpen}
        onClose={() => setAddSectionOpen(false)}
        refetchSidebar={refetch}
      />
      <EditSectionDialog
        section={editingSection}
        onClose={() => setEditingSection(null)}
        refetchSidebar={refetch}
      />
      <AddPageDialog
        sectionId={addPageForSection?.id ?? null}
        sectionName={addPageForSection?.name}
        onClose={() => setAddPageForSection(null)}
        refetchSidebar={refetch}
      />
      <EditPageDialog
        page={editingPage}
        onClose={() => setEditingPage(null)}
        refetchSidebar={refetch}
      />

      {deletingSection && (
        <DeleteConfirmDialog
          title="Delete Section"
          message="Are you sure you want to delete"
          itemName={deletingSection.name}
          isDeleting={isDeletingSection}
          onConfirm={() =>
            deleteSection(deletingSection, () => setDeletingSection(null))
          }
          onClose={() => setDeletingSection(null)}
        />
      )}

      {deletingPage && (
        <DeleteConfirmDialog
          title="Delete Page"
          message="Are you sure you want to delete"
          itemName={deletingPage.pageName}
          isDeleting={isDeletingPage}
          onConfirm={() =>
            deletePage(deletingPage, () => setDeletingPage(null))
          }
          onClose={() => setDeletingPage(null)}
        />
      )}
    </div>
  );
};

export default SectionsView;
