import { useState, useRef, ChangeEvent } from "react";
import Button from "./Button";
import { downloadExcelTemplate } from "@/utils/excelDownload";
import { errorMsg } from "@/utils/notify";

interface FileUploaderProps {
  onChange: (file: File | File[] | null) => void;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
  error?: string;
  disabled?: boolean;
  templateHeaders?: string[];
  templateFilename?: string;
  multiple?: boolean; // NEW
}

const MultiFileUploader = ({
  onChange,
  accept = ".xlsx,.xls",
  maxSize = 10,
  label = "Upload File",
  error,
  disabled = false,
  templateHeaders,
  templateFilename = "template.xlsx",
  multiple = false,
}: FileUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file type
    if (accept) {
      // accept="*" (or including "*") means allow any file type
      const acceptTrimmed = accept.trim();
      if (acceptTrimmed === "*" || acceptTrimmed.includes("*")) {
        return null;
      }
      const acceptedTypes = accept.split(",").map((type) => type.trim());
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (!acceptedTypes.includes(fileExtension)) {
        return `File type must be one of: ${accept}`;
      }
    }

    return null;
  };

  const validateFiles = (files: File[]) => {
    for (const file of files) {
      const error = validateFile(file);
      if (error) {
        errorMsg(`${file.name}: ${error}`);
        return false;
      }
    }
    return true;
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    if (!files.length) return;

    if (!validateFiles(files)) return;

    if (multiple) {
      setSelectedFiles(files);
      onChange(files);
    } else {
      setSelectedFiles([files[0]]);
      onChange(files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);

    if (!files.length) return;

    if (!validateFiles(files)) return;

    if (multiple) {
      setSelectedFiles(files);
      onChange(files);
    } else {
      setSelectedFiles([files[0]]);
      onChange(files[0]);
    }
  };

  const handleRemoveFile = (index?: number) => {
    if (multiple && index !== undefined) {
      const updated = [...selectedFiles];
      updated.splice(index, 1);
      setSelectedFiles(updated);
      onChange(updated);
    } else {
      setSelectedFiles([]);
      onChange(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Helper function to extract text from cell values
  const extractCellValue = (cellValue: any): string => {
    if (cellValue === null || cellValue === undefined) {
      return "";
    }

    // Handle rich text objects
    if (typeof cellValue === "object" && cellValue.richText) {
      return cellValue.richText.map((part: any) => part.text || "").join("");
    }

    // Handle formula results
    if (typeof cellValue === "object" && cellValue.result !== undefined) {
      return String(cellValue.result);
    }

    // Handle hyperlinks
    if (typeof cellValue === "object" && cellValue.text !== undefined) {
      return String(cellValue.text);
    }

    // Handle plain values
    return String(cellValue);
  };

  const handlePreview = async (file: File) => {
    // Read Excel file and parse it using exceljs
    const ExcelJS = await import("exceljs");
    const reader = new FileReader();

    reader.onload = async (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);

      const worksheet = workbook.worksheets[0];
      if (worksheet) {
        const rows: any[] = [];
        let headers: string[] = [];

        worksheet.eachRow((row, rowNumber) => {
          const rowData = row.values as any[];
          // Remove the first element (it's undefined in exceljs)
          const cleanedRow = rowData.slice(1).map(extractCellValue);

          if (rowNumber === 1) {
            headers = cleanedRow;
          } else {
            rows.push(cleanedRow);
          }
        });

        setPreviewHeaders(headers);
        setPreviewData(rows);
        setShowPreviewModal(true);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleDownloadTemplate = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    if (templateHeaders && templateHeaders.length > 0) {
      await downloadExcelTemplate({
        headers: templateHeaders,
        filename: templateFilename,
      });
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
        multiple={multiple}
      />

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-3 text-center cursor-pointer
          transition-all duration-200
          ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${error ? "border-red-500" : ""}
        `}
      >
        {selectedFiles.length > 0 ? (
          <div className="flex flex-col gap-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white border border-gray-300 rounded p-2"
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>

                  <div className="text-left">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <svg
              className="mx-auto w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-blue-500">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {accept} (max {maxSize}MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      {/* Download Template Button */}
      {templateHeaders && templateHeaders.length > 0 && (
        <div className="mt-3">
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download Template
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">File Preview</h3>
              <Button
                type="button"
                variant="cancel"
                onClick={() => setShowPreviewModal(false)}
              >
                Close
              </Button>
            </div>
            <div className="overflow-auto flex-1">
              <table className="min-w-full divide-y divide-gray-200 border">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    {previewHeaders.map((header, index) => (
                      <th
                        key={index}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.map((row: any, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50">
                      {previewHeaders.map((_, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-4 py-2 text-sm text-gray-900 border-r"
                        >
                          {row[colIndex] || "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiFileUploader;
