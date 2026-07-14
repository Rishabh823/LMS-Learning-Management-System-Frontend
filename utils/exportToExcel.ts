import * as XLSX from "xlsx";

function flattenObject(
  obj: Record<string, any>,
  parentKey = "",
  result: Record<string, any> = {}
) {
  for (const key in obj) {
    const newKey = parentKey ? `${parentKey}_${key}` : key;
    const value = obj[key];

    if (
      typeof value === "string" &&
      value.trim().startsWith("{") &&
      value.trim().endsWith("}")
    ) {
      try {
        flattenObject(JSON.parse(value), newKey, result);
      } catch {
        result[newKey] = value;
      }
    } else if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      flattenObject(value, newKey, result);
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

export function exportJsonToExcel<T extends object>(
  data: T[],
  fileName = "export.xlsx",
  sheetName = "Sheet1"
) {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  const flattenedData = data.map((item) =>
    flattenObject(item as Record<string, any>)
  );

  const worksheet = XLSX.utils.json_to_sheet(flattenedData);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  XLSX.writeFile(workbook, fileName);
}
