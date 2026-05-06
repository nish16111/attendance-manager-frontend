import axios from "axios";

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export const AUTH_STORAGE_KEY = "attendance_manager_auth_session";
export const AUTH_EXPIRED_EVENT = "attendance-manager-auth-expired";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const unwrap = (response) => response.data;

const isBrowser = typeof window !== "undefined";

export const extractApiError = (error, fallbackMessage) => {
  const errorData = error?.response?.data;

  if (typeof errorData === "string" && errorData.trim()) {
    return errorData;
  }

  if (errorData?.message) {
    return errorData.message;
  }

  if (errorData?.error) {
    return errorData.error;
  }

  return fallbackMessage;
};

export const getStoredSession = () => {
  if (!isBrowser) {
    return null;
  }

  try {
    const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!rawSession) {
      return null;
    }

    const parsedSession = JSON.parse(rawSession);
    return parsedSession?.accessToken ? parsedSession : null;
  } catch {
    return null;
  }
};

export const persistSession = (session) => {
  if (!isBrowser || !session?.accessToken) {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const clearStoredSession = () => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

const buildAuthSession = (payload = {}) => {
  const accessToken =
    payload.accessToken ||
    payload.token ||
    payload.jwt ||
    payload.access_token ||
    "";

  return {
    accessToken,
    tokenType: payload.tokenType || payload.type || "Bearer",
    expiresIn:
      payload.expiresIn ||
      payload.expiresInMs ||
      payload.accessTokenExpirationMs ||
      null,
    user:
      payload.user ||
      {
        username: payload.username || payload.userName || "",
        email: payload.email || "",
        role: payload.role || "",
      },
  };
};

client.interceptors.request.use((config) => {
  const session = getStoredSession();

  if (session?.accessToken && !config.headers?.Authorization) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${session.accessToken}`,
    };
  }

  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || "";
    const isAuthRequest = requestUrl.includes("/api/auth/");

    if (status === 401 && !isAuthRequest) {
      clearStoredSession();

      if (isBrowser) {
        window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
      }
    }

    return Promise.reject(error);
  }
);

export const loginUser = async ({ login, password }) => {
  const response = await client.post("/api/auth/login", {
    identifier: login.trim(),
    password,
  });

  const session = buildAuthSession(unwrap(response));

  if (session.accessToken) {
    persistSession(session);
  }

  return session;
};

export const registerUser = async ({ username, email, password }) => {
  const response = await client.post("/api/auth/register", {
    username: username.trim(),
    email: email.trim(),
    password,
  });

  const session = buildAuthSession(unwrap(response));

  if (session.accessToken) {
    persistSession(session);
  }

  return session;
};

export const logoutUser = () => {
  clearStoredSession();
};

export const fetchAllUsers = async () => {
  const response = await client.get("/api/users");
  return unwrap(response);
};

export const fetchUserByGrNo = async (grNo) => {
  const response = await client.get(`/api/users/${encodeURIComponent(grNo)}`);
  return unwrap(response);
};

export const createUser = async (formData) => {
  const response = await client.post("/api/users", formData);
  return unwrap(response);
};

export const updateUser = async (grNo, formData) => {
  const response = await client.put(
    `/api/users/${encodeURIComponent(grNo)}`,
    formData
  );
  return unwrap(response);
};

export const importUsers = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await client.post("/api/users/import", formData);
  return unwrap(response);
};

export const deleteUser = async (grNo) => {
  const response = await client.delete(`/api/users/${encodeURIComponent(grNo)}`);
  return unwrap(response);
};
