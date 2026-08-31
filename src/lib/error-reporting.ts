export interface AppErrorOptions {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary" | undefined;
  handled?: boolean | undefined;
  severity?: "error" | "warning" | "info" | undefined;
}

export function reportAppError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  console.error("[AcadIn Telemetry Error]:", error, {
    route: window.location.pathname,
    ...context,
  });
}

// Backward compatibility alias
export const reportLovableError = reportAppError;

