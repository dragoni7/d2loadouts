import { _get } from "../../lib/bungie_api/BungieApiClient";
import { getMembershipId, getTokens } from "../../store/TokensStore";
import { DestinyMembership } from "../../types";

export async function getDestinyMembershipId(): Promise<DestinyMembership> {
  const membershipId = getMembershipId();
  const accessToken = getTokens()?.accessToken.value;

  const membership: DestinyMembership = {
    membershipId: "",
    membershipType: 0,
  };

  const response = await _get(
    `/Platform/User/GetMembershipsById/${membershipId}/1/`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (response.data.Response) {
    membership.membershipId = response.data.Response.primaryMembershipId;

    response.data.Response.destinyMemberships.forEach((m: any) => {
      if (membership.membershipId === m.membershipId) {
        membership.membershipType = m.membershipType;
      }
    });
  } else {
    console.log("Could not get response");
  }

  return membership;
}
