import { _get } from "../../lib/bungie_api/BungieApiClient";
import { getMembershipId, getTokens } from "../../lib/bungie_api/TokensStore";

export async function getCurrentMembershipData(): Promise<string> {
  const membershipId = getMembershipId();
  const accessToken = getTokens()?.accessToken.value;

  const response = await _get(
    `/Platform/User/GetMembershipsById/${membershipId}/1/`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (response.data.Response) {
    const primaryMembershipId = response.data.Response.primaryMembershipId;

    return primaryMembershipId;
  } else {
    console.log("Could not get response");
  }

  return "";
}
