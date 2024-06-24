import { Token, Tokens, getTokens, setTokens } from "./TokensStore"
import { _post } from "./BungieApiClient"
import { CLIENT_ID, CLIENT_SECRET } from "./utils"
import { AxiosResponse } from "axios"

export function canTokensRefresh() {
    const tokens = getTokens()

    if (!tokens) {
        return false
    }

    return tokens && !isTokenExpired(tokens.refreshToken)
}

export function expireTokens() {
    const tokens = getTokens()

    if (tokens) {
        tokens.accessToken.acquired = 0
        tokens.accessToken.expires = 0
        setTokens(tokens)
    }
}

export function isTokenExpired(token?: Token) {

    if (!token) {
        return true
    }

    const expiration = getTokenExpiration(token)

    return Date.now() > expiration
}

export function regenerateTokens(): boolean {
    
    if (canTokensRefresh()) {
        generateToken(true)
        return true
    }

    return false
}

export function generateToken(refresh: boolean, authCode=""): Tokens | null {
    const REFRESH_TOKEN = getTokens()?.refreshToken
    var returnToken = null

    let body = refresh === false ? 
    `grant_type=authorization_code&code=${authCode}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}` :
    `grant_type=refresh_token&refresh_token=${REFRESH_TOKEN}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`

    _post('/Platform/App/OAuth/Token/', body, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${window.btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
        }
    })
    .then(response => {

        returnToken = handleTokenResponse(response)

        setTokens(returnToken)
    })
    .catch(error => {
        throw new Error(error)
    })

    return returnToken
}

function getTokenExpiration(token?: Token): number {
    return (token && 'acquired' in token && 'expires' in token) ? token.acquired + token.expires * 1000 : 0
}

function handleTokenResponse(response: AxiosResponse): Tokens {
    if (response.data.access_token) {

        const aquired = Date.now()

        const accessToken: Token = {
            value: response.data.access_token,
            expires: response.data.expires_in,
            name: 'access',
            acquired: aquired
        }

        const refreshToken: Token = {
            value: response.data.refresh_token,
            expires: response.data.refresh_expires_in,
            name: 'refresh',
            acquired: aquired
        }

        const tokens: Tokens = {
            accessToken,
            refreshToken,
            membershipId: response.data.membership_id
        }

        return tokens
    }
    else {
        throw new Error(`Invalid response: ${JSON.stringify(response)}`)
    }
}