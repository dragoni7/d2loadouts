import { Navigate } from "react-router-dom"
import { isTokenExpired } from "./TokenService"
import { getTokens } from "./TokenStoreService"

export function authenticate(): void {
    window.location.replace(`https://www.bungie.net/en/OAuth/Authorize?client_id=${import.meta.env.VITE_CLIENT_ID}&response_type=code`)
}

export function isAuthenticated(): boolean {
    
    const tokens = getTokens()

    return !tokens ? false : !isTokenExpired(tokens.accessToken)
}

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {

    if (!isAuthenticated()) {
        return (
            <Navigate
            to={'/'}
            replace
          />
        )
    }

    return children
}

