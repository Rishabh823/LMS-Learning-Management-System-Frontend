import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Section = {
  title: string;
  rows: [string, string][];
};

function buildSections(
  obj: Record<string, any>,
  parentTitle?: string,
  sections: Section[] = []
) {
  const rows: [string, string][] = [];

  for (const key in obj) {
    const value = obj[key];

    // If value is JSON string → try parsing
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        try {
          buildSections(JSON.parse(value), formatLabel(key), sections);
          continue;
        } catch {
          rows.push([formatLabel(key), value]);
          continue;
        }
      }
    }

    // If value is object → new section
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      buildSections(value, formatLabel(key), sections);
    } else {
      rows.push([formatLabel(key), String(value ?? "-")]);
    }
  }

  if (rows.length) {
    sections.push({
      title: parentTitle ?? "General",
      rows,
    });
  }

  return sections;
}

export function exportRowToPdf(
  rowData: Record<string, any>,
  options?: {
    title?: string;
    fileName?: string;
  }
) {
  const doc = new jsPDF();

  const title = options?.title ?? "Exported Data";
  const fileName = options?.fileName ?? "exported-data.pdf";

  doc.setFontSize(16);
  doc.text(title, 14, 18);

  const sections = buildSections(rowData);

  let startY = 28;

  sections.forEach((section) => {
    // Section heading
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text(section.title.toUpperCase(), 14, startY);

    autoTable(doc, {
      startY: startY + 4,
      head: [["Field", "Value"]],
      body: section.rows,
      styles: {
        fontSize: 10,
        cellPadding: 4,
        valign: "middle",
      },
      headStyles: {
        fillColor: [1, 61,196],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: "auto" },
      },
    });

    startY = (doc as any).lastAutoTable.finalY + 10;
  });

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(
    `Generated on: ${new Date().toLocaleString()}`,
    14,
    doc.internal.pageSize.height - 10
  );

  doc.save(fileName);
}

function formatLabel(label: string) {
  return label
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}
