import ExcelJS from "exceljs";

interface DownloadExcelTemplateOptions {
  headers: string[];
  filename?: string;
  sheetName?: string;
}

export const downloadExcelTemplate = async ({
  headers,
  filename = "template.xlsx",
  sheetName = "Sheet1",
}: DownloadExcelTemplateOptions) => {
  try {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // Add "S.No." as the first header, followed by the provided headers
    const allHeaders = ["S.No.", ...headers];

    // Add headers to the first row
    worksheet.addRow(allHeaders);

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, size: 12 };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };

    // Set column widths based on header length
    allHeaders.forEach((header, index) => {
      const column = worksheet.getColumn(index + 1);
      column.width = Math.max(header.length + 5, 15); // Minimum width of 15
    });

    // Add borders to header row
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Generate Excel file as buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create a Blob from the buffer
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a download link and trigger download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    return false;
  }
};
