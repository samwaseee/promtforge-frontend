// Define the base URL once
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function to build headers automatically
const getHeaders = (requireAuth = false) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Only run this on the client side (browser) to avoid Next.js SSR errors
  if (requireAuth && typeof window !== "undefined") {
    const token = localStorage.getItem("promptforge_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

// The centralized API Client
export const apiClient = {
  /**
   * GET Request
   * @param endpoint e.g., "/api/prompts"
   * @param requireAuth Set to true if the route is protected
   */
  get: async (endpoint: string, requireAuth = false) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: getHeaders(requireAuth),
    });
    
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Error fetching ${endpoint}`);
    }
    return response.json();
  },

  /**
   * POST Request
   */
  post: async (endpoint: string, data: any, requireAuth = false) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(requireAuth),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Error posting to ${endpoint}`);
    }
    return response.json();
  },

  /**
   * PATCH Request (Great for approvals/updates)
   */
  patch: async (endpoint: string, data: any, requireAuth = false) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PATCH",
      headers: getHeaders(requireAuth),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Error updating ${endpoint}`);
    }
    return response.json();
  },

  /**
   * DELETE Request
   */
  delete: async (endpoint: string, requireAuth = false) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(requireAuth),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Error deleting ${endpoint}`);
    }
    return response.json();
  }
};