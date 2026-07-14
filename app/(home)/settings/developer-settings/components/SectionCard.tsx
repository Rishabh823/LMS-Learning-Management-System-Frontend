"use client";

import {
  ChevronUp,
  ChevronDown,
  Pencil,
  Trash2,
  Plus,
  Layers,
} from "lucide-react";
import CustomizableAccordian from "@/ui/CustomizableAccordian";
import Switch from "@/ui/Switch";
import Button from "@/ui/Button";
import PageRow from "./PageRow";
import type { Section, SectionPage } from "../types/developerSettings.types";

const SectionCard = ({
  section,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onToggleStatus,
  isTogglingStatus,
  onEdit,
  onDelete,
  onAddPage,
  onEditPage,
  onDeletePage,
  onTogglePageStatus,
  isTogglingPageStatus,
  onMovePage,
}: {
  section: Section;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleStatus: () => void;
  isTogglingStatus: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onAddPage: () => void;
  onEditPage: (page: SectionPage) => void;
  onDeletePage: (page: SectionPage) => void;
  onTogglePageStatus: (page: SectionPage) => void;
  isTogglingPageStatus: boolean;
  onMovePage: (page: SectionPage, direction: "up" | "down") => void;
}) => {
  const pages = [...section.pages].sort((a, b) => a.position - b.position);

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex shrink-0 flex-col">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            disabled={isFirst}
            className="flex h-4 w-4 items-center justify-center text-slate-400 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronUp size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            disabled={isLast}
            className="flex h-4 w-4 items-center justify-center text-slate-400 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronDown size={14} />
          </button>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
          <Layers size={16} />
        </div>
        <div>
          <p className="font-semibold text-slate-900">{section.name}</p>
          <p className="text-xs text-slate-400">
            {pages.length} page{pages.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div
        className="flex shrink-0 items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <Switch
          checked={section.status}
          onChange={onToggleStatus}
          disabled={isTogglingStatus}
        />
        <button
          onClick={onEdit}
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-50 hover:text-sky-600 cursor-pointer"
          aria-label="Edit section"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={onDelete}
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
          aria-label="Delete section"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <CustomizableAccordian header={header}>
      <div className="flex flex-col gap-2">
        {pages.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-400">
            No pages in this section yet.
          </p>
        ) : (
          pages.map((page, idx) => (
            <PageRow
              key={page.id}
              page={page}
              isFirst={idx === 0}
              isLast={idx === pages.length - 1}
              onMoveUp={() => onMovePage(page, "up")}
              onMoveDown={() => onMovePage(page, "down")}
              onToggleStatus={() => onTogglePageStatus(page)}
              isTogglingStatus={isTogglingPageStatus}
              onEdit={() => onEditPage(page)}
              onDelete={() => onDeletePage(page)}
            />
          ))
        )}

        <Button
          variant="secondary"
          onClick={onAddPage}
          className="mt-1 flex w-fit items-center gap-1.5 rounded-md px-3 py-2"
        >
          <Plus size={14} /> Add Page
        </Button>
      </div>
    </CustomizableAccordian>
  );
};

export default SectionCard;
