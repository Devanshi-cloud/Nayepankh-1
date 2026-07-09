/**
 * Constructs a fully qualified API URL targeting the backend service.
 * Supports VITE_API_URL environment variable fallback and dynamic host detection.
 * 
 * @param {string} path - The sub-path of the API (e.g. '/api/auth/user')
 * @returns {string} Fully qualified URL
 */
export const buildApiUrl = (path) => {
  // 1. Use the environment variable if configured
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL}${path}`;
  }

  // 2. Dynamic environment detection for local development
  const { hostname } = window.location;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return `http://localhost:5000${path}`;
  }

  // 3. Fallback to the deployment backend URL if hosted separately, 
  // or use relative paths if hosted on the same domain.
  const vercelBackendUrl = "https://backend-eta-bice-43.vercel.app";
  return `${vercelBackendUrl}${path}`;
};
