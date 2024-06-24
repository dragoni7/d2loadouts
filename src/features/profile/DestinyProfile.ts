import { _get } from "../../lib/BungieApiClient"
import { getTokens } from "../../lib/TokenStoreService"

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