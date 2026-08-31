export interface DocumentValidationResult {
  valid: boolean;
  error?: string | undefined;
  fileName?: string | undefined;
  fileSizeFormatted?: string | undefined;
  fileType?: string | undefined;
}

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function validateDocumentFile(file: File): DocumentValidationResult {
  if (!file) {
    return { valid: false, error: "No file selected." };
  }

  // Type check
  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: "Invalid file format. Only PDF, PNG, and JPEG documents are permitted.",
      fileName: file.name,
      fileSizeFormatted: formatBytes(file.size),
      fileType: file.type,
    };
  }

  // Size check
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File exceeds maximum 10MB limit (Selected: ${formatBytes(file.size)}).`,
      fileName: file.name,
      fileSizeFormatted: formatBytes(file.size),
      fileType: file.type,
    };
  }

  return {
    valid: true,
    fileName: file.name,
    fileSizeFormatted: formatBytes(file.size),
    fileType: file.type,
  };
}

