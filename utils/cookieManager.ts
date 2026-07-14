import Cookies from "js-cookie";

/**
 * Cookie management utilities
 */

export const AUTH_TOKEN_CHANGED_EVENT = "auth-token-changed";

const notifyAuthTokenChanged = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_TOKEN_CHANGED_EVENT));
  }
};

const COOKIE_KEYS = {
  TOKEN: "token",
  ORGID: "organizationId",
  ROLE: "role",
  USERID: "userId",
} as const;

const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
};
/**
 * Clear all auth-related cookies
 */
export const clearAllAuthCookies = (): void => {
  Cookies.remove(COOKIE_KEYS.TOKEN);
  Cookies.remove(COOKIE_KEYS.ORGID);
  Cookies.remove(COOKIE_KEYS.ROLE);
  Cookies.remove(COOKIE_KEYS.USERID);
  notifyAuthTokenChanged();
};

/**
 * Check if user is authenticated (has token)
 */
export const isAuthenticated = (): boolean => {
  return !!Cookies.get(COOKIE_KEYS.TOKEN);
};

/**
 * Get auth token
 */
export const getAuthToken = (): string | undefined => {
  return Cookies.get(COOKIE_KEYS.TOKEN);
};

/**
 * Set auth token
 */
export const setAuthToken = (token: string): void => {
  Cookies.set(COOKIE_KEYS.TOKEN, token, COOKIE_OPTIONS);
  notifyAuthTokenChanged();
};

export const setOrgId = (id: string) => {
  return Cookies.set(COOKIE_KEYS.ORGID, id, COOKIE_OPTIONS);
};

export const setUserId = (id: string) => {
  return Cookies.set(COOKIE_KEYS.USERID, id, COOKIE_OPTIONS);
};

export const getUserId = (): string | undefined => {
  return Cookies.get(COOKIE_KEYS.USERID);
};

export const getOrgId = (): string | undefined => {
  return Cookies.get(COOKIE_KEYS.ORGID);
};

export const setRole = (role: string) => {
  return Cookies.set(COOKIE_KEYS.ROLE, role, COOKIE_OPTIONS);
};

export const getRole = (): string | undefined => {
  return Cookies.get(COOKIE_KEYS.ROLE);
};
