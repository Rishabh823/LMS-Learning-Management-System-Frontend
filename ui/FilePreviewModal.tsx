import { useEffect, useState } from "react";
import * as Papa from "papaparse";
import apiClient from "@/services/apiClient";
import { Download, XCircle } from "lucide-react";

interface FilePreviewModalProps {
  file: File | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: () => void;
  title?: string;
  fetch?: boolean;
  endpoint?: string;
}

const FilePreviewModal = ({
  file,
  isOpen,
  onClose,
  onDownload,
  title,
  fetch = false,
  endpoint,
}: FilePreviewModalProps) => {
  const [fileBlob, setFileBlob] = useState<File | null>(file);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [fileBlobType, setFileType] = useState<
    "pdf" | "excel" | "csv" | "unknown"
  >("unknown");
  const [pdfUrl, setPdfUrl] = useState<string>("");

  /* -----------------------------
     FETCH FILE FROM API (if needed)
  ------------------------------ */

  useEffect(() => {
    const fetchFile = async () => {
      if (!endpoint || !fetch) return;

      try {
        const response: any = await apiClient.get(endpoint, {
          responseType: "blob",
        });

        const blob: Blob = response.data;

        const contentType =
          response?.headers?.["content-type"] || blob.type || "";

        let extension = "";

        if (contentType.includes("pdf")) extension = "pdf";
        else if (contentType.includes("spreadsheet")) extension = "xlsx";
        else if (contentType.includes("excel")) extension = "xls";
        else if (contentType.includes("csv")) extension = "csv";
        else extension = "file";

        const previewFile = new File([blob], `preview.${extension}`, {
          type: contentType,
        });

        setFileBlob(previewFile);
      } catch (error) {
        console.error("File preview fetch error:", error);
      }
    };

    fetchFile();
  }, [endpoint, fetch]);

  /* -----------------------------
     HANDLE DIRECT FILE PROP
  ------------------------------ */

  useEffect(() => {
    if (file) {
      setFileBlob(file);
    }
  }, [file]);

  /* -----------------------------
     FILE TYPE DETECTION
  ------------------------------ */

  useEffect(() => {
    if (!fileBlob) return;

    const extension = fileBlob.name.split(".").pop()?.toLowerCase();

    if (extension === "pdf") {
      setFileType("pdf");

      const url = URL.createObjectURL(fileBlob);
      setPdfUrl(url);
    } else if (extension === "xlsx" || extension === "xls") {
      setFileType("excel");
      parseExcel(fileBlob);
    } else if (extension === "csv") {
      setFileType("csv");
      parseCSV(fileBlob);
    } else {
      setFileType("unknown");
    }
  }, [fileBlob]);

  /* -----------------------------
     CLEANUP OBJECT URL
  ------------------------------ */

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  /* -----------------------------
     EXCEL PARSER
  ------------------------------ */

  const parseExcel = async (fileBlob: File) => {
    const ExcelJS = await import("exceljs");

    const reader = new FileReader();

    reader.onload = async (e) => {
      const buffer = e.target?.result as ArrayBuffer;

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);

      const worksheet = workbook.worksheets[0];

      const tableRows: any[] = [];
      let headerRow: string[] = [];

      worksheet.eachRow((row, rowNumber) => {
        const rowData = row.values as any[];

        const cleaned = rowData.slice(1).map((v) => String(v ?? ""));

        if (rowNumber === 1) {
          headerRow = cleaned;
        } else {
          tableRows.push(cleaned);
        }
      });

      setHeaders(headerRow);
      setRows(tableRows);
    };

    reader.readAsArrayBuffer(fileBlob);
  };

  /* -----------------------------
     CSV PARSER
  ------------------------------ */

  const parseCSV = (fileBlob: File) => {
    Papa.parse(fileBlob, {
      complete: (result) => {
        const data: any[][] = result.data as any[][];

        const headerRow = data[0];
        const tableRows = data.slice(1);

        setHeaders(headerRow);
        setRows(tableRows);
      },
    });
  };

  if (!isOpen || !fileBlob) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white w-[90%] max-w-5xl rounded-lg shadow-lg flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {title || fileBlob?.name || "File Preview"}
          </h2>

          <div className="flex items-center gap-3">
            {onDownload && <Download onClick={onDownload} className="cursor-pointer text-blue-500"/>}
            <XCircle
              onClick={onClose}
              className="cursor-pointer text-red-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {/* PDF Preview */}
          {fileBlobType === "pdf" && (
            <iframe
              src={pdfUrl}
              title="PDF Preview"
              className="w-full h-[70vh] border rounded"
            />
          )}

          {/* Excel / CSV Preview */}
          {(fileBlobType === "excel" || fileBlobType === "csv") && (
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  {headers.map((h, i) => (
                    <th
                      key={i}
                      className="px-4 py-2 border text-left text-sm font-semibold"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((row, rIndex) => (
                  <tr key={rIndex} className="hover:bg-gray-50">
                    {row.map((cell: any, cIndex: number) => (
                      <td key={cIndex} className="px-4 py-2 border text-sm">
                        {cell || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {fileBlobType === "unknown" && (
            <p className="text-gray-500">Preview not available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
