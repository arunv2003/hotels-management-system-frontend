import axios from "axios";
import Cookies from "js-cookie";

const BACKENDURL =
  process.env.NEXT_PUBLIC_BACKENDURL || "http://localhost:9000";

export const apiClient = axios.create({
  baseURL: BACKENDURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const getStoredAccessToken = () => {
  let token = Cookies.get("accessToken");
  if (!token || token === "undefined" || token === "null") {
    try {
      if (typeof window !== "undefined") {
        const authStorage = localStorage.getItem("auth-storage");
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          token = parsed?.state?.accessToken;
        }
      }
    } catch (e) {}
  }
  return token && token !== "undefined" && token !== "null" ? token : null;
};

export const getStoredRefreshToken = () => {
  let token = Cookies.get("refreshToken");
  if (!token || token === "undefined" || token === "null") {
    try {
      if (typeof window !== "undefined") {
        const authStorage = localStorage.getItem("auth-storage");
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          token = parsed?.state?.refreshToken;
        }
      }
    } catch (e) {}
  }
  return token && token !== "undefined" && token !== "null" ? token : null;
};

const handleSessionExpired = () => {
  Cookies.remove("accessToken", { path: "/" });
  Cookies.remove("refreshToken", { path: "/" });

  try {
    if (typeof window !== "undefined") {
      const authStorage = localStorage.getItem("auth-storage");
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        if (parsed?.state) {
          parsed.state.user = null;
          parsed.state.accessToken = null;
          parsed.state.refreshToken = null;
          parsed.state.isAuthenticated = false;
          localStorage.setItem("auth-storage", JSON.stringify(parsed));
        }
      }
    }
  } catch (e) {
    console.error("Failed to clear auth storage:", e);
  }

  // Redirect to Landing Page
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    if (
      currentPath !== "/" &&
      currentPath !== "/login" &&
      currentPath !== "/register" &&
      !currentPath.startsWith("/privacy-policy") &&
      !currentPath.startsWith("/terms-and-conditions") &&
      !currentPath.startsWith("/term-condition") &&
      !currentPath.startsWith("/about-us") &&
      !currentPath.startsWith("/contact-us") &&
      !currentPath.startsWith("/customer-support")
    ) {
      window.location.href = "/";
    }
  }
};

// Request Interceptor: Attach Access Token
apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh token logic for auth login/register endpoints or refresh endpoint itself
    const isAuthEndpoint =
      originalRequest?.url?.includes("/api/auth/login") ||
      originalRequest?.url?.includes("/api/auth/superadmin/login") ||
      originalRequest?.url?.includes("/api/auth/refresh-token") ||
      originalRequest?.url?.includes("/api/auth/logout");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getStoredRefreshToken();

      if (!refreshToken) {
        isRefreshing = false;
        handleSessionExpired();
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await axios.post(
          `${BACKENDURL}/api/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        );

        const newAccessToken =
          refreshResponse.data?.data?.accessToken ||
          refreshResponse.data?.accessToken;
        const newRefreshToken =
          refreshResponse.data?.data?.refreshToken ||
          refreshResponse.data?.refreshToken;

        if (newAccessToken) {
          Cookies.set("accessToken", newAccessToken, { expires: 1, path: "/" });
          if (newRefreshToken) {
            Cookies.set("refreshToken", newRefreshToken, { expires: 10, path: "/" });
          }

          try {
            if (typeof window !== "undefined") {
              const authStorage = localStorage.getItem("auth-storage");
              if (authStorage) {
                const parsed = JSON.parse(authStorage);
                if (parsed?.state) {
                  parsed.state.accessToken = newAccessToken;
                  if (newRefreshToken) parsed.state.refreshToken = newRefreshToken;
                  localStorage.setItem("auth-storage", JSON.stringify(parsed));
                }
              }
            }
          } catch (e) {
            console.error("Failed to sync storage:", e);
          }

          apiClient.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);
          isRefreshing = false;

          return apiClient(originalRequest);
        } else {
          throw new Error("Invalid token refresh response");
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        isRefreshing = false;
        handleSessionExpired();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
