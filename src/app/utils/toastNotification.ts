import { toast } from "sonner";

const TOAST_STYLE = {
  fontSize: "14px",
  fontWeight: "600" as const,
};

const TOAST_DESCRIPTION_CLASS = "text-gray-700";

type ToastPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";

interface ToastOptions {
  position?: ToastPosition;
  duration?: number;
}

/**
 * Show a success toast notification
 * @param title - Main message
 * @param description - Optional detailed message
 * @param options - Optional toast options
 */
export const showSuccessToast = (
  title: string,
  description?: string,
  options?: ToastOptions
) => {
  toast.success(title, {
    description,
    style: TOAST_STYLE,
    descriptionClassName: TOAST_DESCRIPTION_CLASS,
    position: options?.position || "top-right",
    duration: options?.duration || 3000,
  });
};

/**
 * Show an error toast notification
 * @param title - Main message
 * @param description - Optional detailed message
 * @param options - Optional toast options
 */
export const showErrorToast = (
  title: string,
  description?: string,
  options?: ToastOptions
) => {
  toast.error(title, {
    description,
    style: TOAST_STYLE,
    descriptionClassName: TOAST_DESCRIPTION_CLASS,
    position: options?.position || "top-right",
    duration: options?.duration || 3000,
  });
};

/**
 * Show an info toast notification
 * @param title - Main message
 * @param description - Optional detailed message
 * @param options - Optional toast options
 */
export const showInfoToast = (
  title: string,
  description?: string,
  options?: ToastOptions
) => {
  toast.info(title, {
    description,
    style: TOAST_STYLE,
    descriptionClassName: TOAST_DESCRIPTION_CLASS,
    position: options?.position || "top-right",
    duration: options?.duration || 3000,
  });
};

/**
 * Show a warning toast notification
 * @param title - Main message
 * @param description - Optional detailed message
 * @param options - Optional toast options
 */
export const showWarningToast = (
  title: string,
  description?: string,
  options?: ToastOptions
) => {
  toast.warning(title, {
    description,
    style: TOAST_STYLE,
    descriptionClassName: TOAST_DESCRIPTION_CLASS,
    position: options?.position || "top-right",
    duration: options?.duration || 3000,
  });
};

/**
 * Show a loading toast notification
 * @param title - Main message
 * @param description - Optional detailed message
 * @param options - Optional toast options
 */
export const showLoadingToast = (
  title: string,
  description?: string,
  options?: ToastOptions
) => {
  return toast.loading(title, {
    description,
    style: TOAST_STYLE,
    descriptionClassName: TOAST_DESCRIPTION_CLASS,
    position: options?.position || "top-right",
    duration: options?.duration || 3000,
  });
};

/**
 * Show a custom toast notification
 * @param title - Main message
 * @param options - Toast options including type
 */
export const showCustomToast = (
  title: string,
  description?: string,
  type: "success" | "error" | "info" | "warning" | "loading" = "info",
  options?: ToastOptions
) => {
  switch (type) {
    case "success":
      return showSuccessToast(title, description, options);
    case "error":
      return showErrorToast(title, description, options);
    case "warning":
      return showWarningToast(title, description, options);
    case "loading":
      return showLoadingToast(title, description, options);
    default:
      return showInfoToast(title, description, options);
  }
};
