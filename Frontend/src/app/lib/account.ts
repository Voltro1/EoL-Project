import type { Currency, MeasurementUnit } from "../contexts/PageContext";
import type { Language } from "../translations";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export type ApiCurrency = "USD" | "LBP" | "EUR";
export type ApiLanguage = "EN" | "AR" | "FR";
export type ApiUnit = "Watts" | "Kilowatts" | "kWh";

export interface ApiPreferences {
  currency: ApiCurrency;
  language: ApiLanguage;
  unit: ApiUnit;
  darkMode: boolean;
}

export interface UserAccount {
  id: number;
  userId: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  profilePicture: string | null;
  preferences: ApiPreferences;
}

export interface AppPreferences {
  currency: Currency;
  language: Language;
  measurementUnit: MeasurementUnit;
  darkMode: boolean;
}

export interface StoredAuthSession {
  id: number;
  userId: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  profilePicture: string | null;
  preferences: AppPreferences;
}

type SignupPayload = {
  name: string;
  phone: string;
  password: string;
  email?: string;
  address?: string;
};

type ProfilePayload = {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  profilePicture?: string;
};

const AUTH_SESSION_KEY = "edl-auth-session";
const LANGUAGE_MAP: Record<ApiLanguage, Language> = {
  EN: "English",
  AR: "Arabic",
  FR: "French",
};
const API_LANGUAGE_MAP: Record<Language, ApiLanguage> = {
  English: "EN",
  Arabic: "AR",
  French: "FR",
};

function normalizeResponseError(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    let message = "Request failed.";

    try {
      const body = await response.json();
      if (typeof body?.error === "string") {
        message = body.error;
      }
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function mapApiPreferencesToApp(preferences: ApiPreferences): AppPreferences {
  return {
    currency: preferences.currency,
    language: LANGUAGE_MAP[preferences.language],
    measurementUnit: preferences.unit,
    darkMode: preferences.darkMode,
  };
}

export function mapAppPreferencesToApi(preferences: AppPreferences): ApiPreferences {
  return {
    currency: preferences.currency,
    language: API_LANGUAGE_MAP[preferences.language],
    unit: preferences.measurementUnit,
    darkMode: preferences.darkMode,
  };
}

export function mapAccountToStoredSession(account: UserAccount): StoredAuthSession {
  return {
    id: account.id,
    userId: account.userId,
    name: account.name,
    phone: account.phone,
    email: account.email,
    address: account.address,
    profilePicture: account.profilePicture,
    preferences: mapApiPreferencesToApp(account.preferences),
  };
}

export async function signupAccount(payload: SignupPayload) {
  try {
    const body = await request<{ user: UserAccount }>("/api/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return body.user;
  } catch (error) {
    throw new Error(normalizeResponseError(error));
  }
}

export async function loginAccount(userId: string, password: string) {
  try {
    const body = await request<{ user: UserAccount }>("/api/login", {
      method: "POST",
      body: JSON.stringify({ userId, password }),
    });

    return body.user;
  } catch (error) {
    throw new Error(normalizeResponseError(error));
  }
}

export async function fetchAccount(userId: string) {
  try {
    const body = await request<{ user: UserAccount }>(`/api/accounts/${encodeURIComponent(userId)}`);
    return body.user;
  } catch (error) {
    throw new Error(normalizeResponseError(error));
  }
}

export async function saveAccountPreferences(userId: string, preferences: AppPreferences) {
  try {
    const body = await request<{ user: UserAccount }>(
      `/api/accounts/${encodeURIComponent(userId)}/preferences`,
      {
        method: "PUT",
        body: JSON.stringify(mapAppPreferencesToApi(preferences)),
      },
    );

    return body.user;
  } catch (error) {
    throw new Error(normalizeResponseError(error));
  }
}

export async function removeAccount(userId: string) {
  try {
    await request<void>(`/api/accounts/${encodeURIComponent(userId)}`, {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error(normalizeResponseError(error));
  }
}

export async function saveAccountProfile(userId: string, profile: ProfilePayload) {
  try {
    const body = await request<{ user: UserAccount }>(
      `/api/accounts/${encodeURIComponent(userId)}/profile`,
      {
        method: "PUT",
        body: JSON.stringify(profile),
      },
    );

    return body.user;
  } catch (error) {
    throw new Error(normalizeResponseError(error));
  }
}

export function getStoredAuthSession() {
  const sessionValue =
    sessionStorage.getItem(AUTH_SESSION_KEY) ?? localStorage.getItem(AUTH_SESSION_KEY);

  if (!sessionValue) {
    return null;
  }

  try {
    return JSON.parse(sessionValue) as StoredAuthSession;
  } catch {
    return null;
  }
}

export function persistAuthSession(session: StoredAuthSession, rememberMe: boolean) {
  const serialized = JSON.stringify(session);

  sessionStorage.setItem(AUTH_SESSION_KEY, serialized);
  sessionStorage.setItem("userId", session.userId);
  sessionStorage.setItem("userName", session.name);
  sessionStorage.setItem("isAuthenticated", "true");
  sessionStorage.setItem("rememberMe", rememberMe ? "true" : "false");

  if (rememberMe) {
    localStorage.setItem(AUTH_SESSION_KEY, serialized);
    localStorage.setItem("userId", session.userId);
    localStorage.setItem("userName", session.name);
    localStorage.setItem("rememberMe", "true");
  } else {
    localStorage.removeItem(AUTH_SESSION_KEY);
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("rememberMe");
  }
}

export function restoreRememberedSession() {
  const remembered = localStorage.getItem(AUTH_SESSION_KEY);
  if (!remembered || sessionStorage.getItem(AUTH_SESSION_KEY)) {
    return getStoredAuthSession();
  }

  sessionStorage.setItem(AUTH_SESSION_KEY, remembered);

  try {
    const parsed = JSON.parse(remembered) as StoredAuthSession;
    sessionStorage.setItem("userId", parsed.userId);
    sessionStorage.setItem("userName", parsed.name);
    sessionStorage.setItem("isAuthenticated", "true");
    sessionStorage.setItem("rememberMe", "true");
    return parsed;
  } catch {
    return null;
  }
}

export function updateStoredSession(session: StoredAuthSession, rememberOverride?: boolean) {
  const rememberMe =
    rememberOverride ?? sessionStorage.getItem("rememberMe") === "true";
  persistAuthSession(session, rememberMe);
}

export function clearAuthSession() {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  sessionStorage.removeItem("userId");
  sessionStorage.removeItem("userName");
  sessionStorage.removeItem("isAuthenticated");
  sessionStorage.removeItem("rememberMe");

  localStorage.removeItem(AUTH_SESSION_KEY);
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("rememberMe");
}
