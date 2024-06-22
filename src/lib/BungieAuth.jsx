import { _get, _post } from './BungieApiClient'

const BungieAuth = {

    authenticate: () => {
        window.location.replace(`https://www.bungie.net/en/OAuth/Authorize?client_id=${import.meta.env.VITE_CLIENT_ID}&response_type=code`)
    },

    isTokenExpired: () => {
        return localStorage.getItem("refreshTokenExpiringAt") < Date.now()
    },

    autoRegenerateTokens: () => {
        const timing = 1000 * 3600 * 0.5
        const refreshToken = localStorage.getItem("refreshToken")
        const refreshTokenExpiringAt = localStorage.getItem("refreshTokenExpiringAt")
        const lastRefresh = localStorage.getItem("lastRefresh")

        console.log("autoRegenerateTokens", {
            token: refreshToken,
            datenow: Date.now(),
            refreshTokenExpiringAt: refreshTokenExpiringAt,
            lastRefresh: lastRefresh,
            "Date.now() > (lastRefresh + timing)": Date.now() > lastRefresh + timing
        })

        if (refreshToken && Date.now() < refreshTokenExpiringAt && Date.now() > lastRefresh + timing) {
            return BungieAuth.generateToken(true)
        }

        return true
    },
    
    generateToken: (refresh = false) => {
        const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
        const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET
        const TOKEN = localStorage.getItem("authCode")

        let body = refresh === false ? 
        `grant_type=authorization_code&code=${TOKEN}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}` :
        `grant_type=refresh_token&refresh_token=${localStorage.getItem("refresh_token")}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`

        _post('/Platform/App/OAuth/Token/', body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${window.btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
            }
        })
        .then(response => {
            if (response.data.access_token) {
                localStorage.setItem("accessToken", response.data.access_token)
                localStorage.setItem("refreshToken", response.data.refresh_token)
                localStorage.setItem("refreshTokenExpiringAt", Date.now() + response.data.refresh_expires_in * 1000 - 10 * 1000)
                localStorage.setItem("lastRefresh", Date.now())
                return true
            }
            else {
                console.log("Could not get access token")
                return false
            }
        })
    },

    isAuthenticated: () => {
        return (localStorage.getItem("accessToken") !== null && BungieAuth.autoRegenerateTokens())
    },

    setAuthCode: () => {
        if (window.location.href.includes("code=")) {
            var code = window.location.href.split('code=')[1]

            if (!code) {
                localStorage.removeItem("authCode")
            }
            else {
                localStorage.setItem("authCode", "" + code)
            }

            return true
        }

        return false
    }
}

export default BungieAuth