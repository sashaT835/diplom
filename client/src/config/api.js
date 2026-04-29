const RAW_API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(
  /\/+$/,
  ""
);

export const API_BASE_URL = RAW_API_BASE_URL || "/api";

export const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

export const resolveAssetUrl = (assetPath) => {
  if (!assetPath) {
    return "";
  }

  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  if (BACKEND_BASE_URL) {
    return `${BACKEND_BASE_URL.replace(/\/+$/, "")}${assetPath}`;
  }

  if (API_BASE_URL.startsWith("http://") || API_BASE_URL.startsWith("https://")) {
    return `${API_BASE_URL.replace(/\/api$/, "")}${assetPath}`;
  }

  return assetPath;
};
