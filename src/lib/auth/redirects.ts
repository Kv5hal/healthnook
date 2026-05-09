export function getSafeRedirectPath(path: FormDataEntryValue | string | null) {
  if (typeof path !== "string" || path.length === 0) {
    return "/dashboard";
  }

  if (!path.startsWith("/") || path.startsWith("//")) {
    return "/dashboard";
  }

  return path;
}

export function withMessage(path: string, key: "error" | "message", value: string) {
  const separator = path.includes("?") ? "&" : "?";

  return `${path}${separator}${key}=${encodeURIComponent(value)}`;
}
