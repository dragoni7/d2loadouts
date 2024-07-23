import { Navigate } from "react-router-dom";
import { isTokenExpired } from "./TokenService";
import { getTokens } from "../../store/TokensStore";
import { API_CREDENTIALS } from "./Constants";

/**
 * Navigates to the Bungie OAuth url
 */
export function authenticate(): void {
  window.location.replace(
    `https://www.bungie.net/en/OAuth/Authorize?client_id=${API_CREDENTIALS.CLIENT_ID}&response_type=code`
  );
}

/**
 * Whether or not the user is authenticated.
 *
 * @returns if auth tokens are present in local store
 */
export function isAuthenticated(): boolean {
  const tokens = getTokens();

  if (!tokens) {
    return false;
  }

  return !isTokenExpired(tokens.accessToken);
}

/**
 * Restricts rendering of children if not authenticated
 */
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to={"/"} replace />;
  }

  return children;
};
