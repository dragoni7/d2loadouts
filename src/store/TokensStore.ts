export interface Token {
  value: string;
  expires: number;
  name: "access" | "refresh";
  acquired: number;
}

export interface Tokens {
  accessToken: Token;
  refreshToken?: Token;
  membershipId: string;
}

const key = "authTokens";

/**
 * Gets the locally stored auth tokens
 * @returns the tokens or null
 */
export function getTokens(): Tokens | null {
  const tokenString = localStorage.getItem(key);
  return tokenString ? (JSON.parse(tokenString) as Tokens) : null;
}

/**
 * Stores auth tokens in local storage.
 */
export function setTokens(tokens: Tokens) {
  localStorage.setItem(key, JSON.stringify(tokens));
}

/**
 * Removes the locally stored auth tokens
 */
export function removeTokens() {
  localStorage.removeItem(key);
}

/**
 * Gets the membersip id from the locally stored auth tokens
 * @returns membershipId
 */
export function getBungieMembershipId(): string | undefined {
  const tokens = getTokens();

  if (tokens && tokens?.membershipId) {
    return tokens.membershipId;
  }

  return undefined;
}
