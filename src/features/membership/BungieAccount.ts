import { _get } from "../../lib/bungie_api/BungieApiClient";
import { getMembershipId, getTokens } from "../../lib/bungie_api/TokensStore";

export function getCurrentMembershipData() {

    const membershipId = getMembershipId()
    const accessToken = getTokens()?.accessToken

    _get(`/Platform/User/GetMembershipsById/${membershipId}/1/`, {
        headers: {
            'Authorization': `Bearer ${accessToken}}`
        }
    })
    .then(response => {
        if (response.data.Response) {

            const primaryMembershipId = response.data.Response.primaryMembershipId
            const displayName = response.data.Response.bungieNetUser.displayName

            localStorage.setItem("primaryMembershipId", JSON.stringify(primaryMembershipId))

            return true
        }
        else {
            console.log("Could not get response")
            return false
        }
    })
}

