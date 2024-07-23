import { Token, Tokens, getTokens, setTokens } from "../../store/TokensStore";
import { _post } from "./BungieApiClient";
import { AxiosResponse } from "axios";
import { getOAuthTokensRequest } from "./Requests";

export function canTokensRefresh() {
  const tokens = getTokens();

  if (!tokens) {
    return false;
  }

  return tokens && !isTokenExpired(tokens.refreshToken);
}

export function expireTokens() {
  const tokens = getTokens();

  if (tokens) {
    tokens.accessToken.acquired = 0;
    tokens.accessToken.expires = 0;
    setTokens(tokens);
  }
}

export function isTokenExpired(token?: Token) {
  if (!token) {
    return true;
  }

  const expiration = getTokenExpiration(token);

  return Date.now() > expiration;
}

export async function regenerateTokens(): Promise<boolean> {
  if (canTokensRefresh()) {
    await generateToken(true);
    return true;
  }

  return false;
}

export async function generateToken(
  refresh: boolean,
  authCode = ""
): Promise<Tokens | null> {
  var returnToken = null;

  const response = await getOAuthTokensRequest(refresh, authCode);

  if (response) {
    returnToken = handleTokenResponse(response);

    setTokens(returnToken);
  }

  return returnToken;
}

function getTokenExpiration(token?: Token): number {
  return token && "acquired" in token && "expires" in token
    ? token.acquired + token.expires * 1000
    : 0;
}

function handleTokenResponse(response: AxiosResponse): Tokens {
  if (response.data.access_token) {
    const aquired = Date.now();

    const accessToken: Token = {
      value: response.data.access_token,
      expires: response.data.expires_in,
      name: "access",
      acquired: aquired,
    };

    const refreshToken: Token = {
      value: response.data.refresh_token,
      expires: response.data.refresh_expires_in,
      name: "refresh",
      acquired: aquired,
    };

    const tokens: Tokens = {
      accessToken,
      refreshToken,
      membershipId: response.data.membership_id,
    };

    return tokens;
  } else {
    throw new Error(`Invalid response: ${JSON.stringify(response)}`);
  }
}
