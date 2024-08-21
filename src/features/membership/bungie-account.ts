import { getDestinyMembershipsRequest } from '../../lib/bungie_api/requests';
import { DestinyMembership } from '../../types/d2l-types';

export async function getDestinyMembershipId(): Promise<DestinyMembership> {
  const membership: DestinyMembership = {
    membershipId: '',
    membershipType: 0,
    bungieGlobalDisplayName: '',
  };

  const response = await getDestinyMembershipsRequest();

  if (response.data.Response) {
    membership.membershipId = response.data.Response.primaryMembershipId;

    for (const m of response.data.Response.destinyMemberships) {
      if (membership.membershipId === m.membershipId) {
        membership.membershipType = m.membershipType;
        membership.bungieGlobalDisplayName = m.bungieGlobalDisplayName;
        break;
      }
    }
  } else {
    console.log('Could not get response');
  }

  return membership;
}
