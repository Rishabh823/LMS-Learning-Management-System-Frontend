import { useEffect, useState } from "react";
import { getAuthToken, AUTH_TOKEN_CHANGED_EVENT } from "./cookieManager";

/**
 * Reactive read of the auth token cookie.
 *
 * `Cookies.get()` returns undefined during SSR (no `document`), and reading
 * it directly in a render body never re-fires once the real cookie is
 * available client-side for components that don't otherwise re-render
 * (e.g. providers mounted once in the root layout). This hook re-checks the
 * cookie in an effect (guaranteed client-only) and reacts to login/logout
 * via a custom event, so consumers update reliably on hard refresh too.
 */
export const useAuthToken = (): string | undefined => {
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    setToken(getAuthToken());

    const sync = () => setToken(getAuthToken());
    window.addEventListener(AUTH_TOKEN_CHANGED_EVENT, sync);
    return () => window.removeEventListener(AUTH_TOKEN_CHANGED_EVENT, sync);
  }, []);

  return token;
};
