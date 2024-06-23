export interface Token {

    value: string
    expires: number
    name: 'access' | 'refresh'
    acquired: number
}

export interface Tokens {
    accessToken: Token
    refreshToken?: Token
    membershipId: string
}

const key = 'Tokens'

export function getTokens(): Tokens | null {
    const tokenString = localStorage.getItem(key)
    return tokenString ? (JSON.parse(tokenString) as Tokens) : null
}

export function setTokens(tokens: Tokens) {
    localStorage.setItem(key, JSON.stringify(tokens))
}

export function removeTokens() {
    localStorage.removeItem(key)
}

export function getMembershipId(): string | undefined {
    const tokens = getTokens()

    if (tokens && tokens?.membershipId) {
        return tokens.membershipId
    }

    return undefined
}