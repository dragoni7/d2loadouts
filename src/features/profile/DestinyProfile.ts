import { _get } from "../../lib/bungie_api/BungieApiClient"
import { getTokens } from "../../lib/bungie_api/TokensStore"

export function getProfile(destinyMembershipId: string) {

    const accessToken = getTokens()?.accessToken

    _get(`/Platform/Destiny2/1/Profile/${destinyMembershipId}/?components=102,200`, {
        headers: {
            'Authorization': `Bearer ${accessToken}}`
        }
    })
    .then(response => {
        if (response.data.Response) {

            localStorage.setItem("profile", JSON.stringify(response.data.Response))

            return true
        }
        else {
            console.log("Could not get response")
            return false
        }
    })
}