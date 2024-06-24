import { generateToken } from "../../lib/bungie_api/TokenService"
import { setTokens } from "../../lib/bungie_api/TokensStore"

function getAuthCodeFromURL(): string | null {
    return window.location.href.includes("code=") ? window.location.href.split('code=')[1] : null
}

export function handleAuthReturn(): boolean {

    const code = getAuthCodeFromURL()

    if (!code?.length) {
        console.log("Could not find authorization code")
        return false
    }

    try {
        const tokens = generateToken(false, code)

        if (tokens) {
            setTokens(tokens)

            return true
        }
        
    }
    catch (error) {
        console.log(error)
    }

    return false
}