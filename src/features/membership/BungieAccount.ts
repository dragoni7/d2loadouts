import { getDestinyMembershipsRequest } from '../../lib/bungie_api/Requests';
import { DestinyMembership } from '../../types';

export async function getDestinyMembershipId(): Promise<DestinyMembership> {
  const membership: DestinyMembership = {
    membershipId: '',
    membershipType: 0,
  };

  const response = await getDestinyMembershipsRequest();

  if (response.data.Response) {
    membership.membershipId = response.data.Response.primaryMembershipId;

    for (const m of response.data.Response.destinyMemberships) {
      if (membership.membershipId === m.membershipId) {
        membership.membershipType = m.membershipType;
        break;
      }
    }
  } else {
    console.log('Could not get response');
  }

  return membership;
}
