import axios from 'axios'

const AuthService = {

    authenticate: () => {
        window.location.replace(`https://www.bungie.net/en/OAuth/Authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code`)
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
        }
    },
    
    generateToken: (refresh = false) => {
        const CLIENT_ID = process.env.REACT_APP_CLIENT_ID
        const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET
        const TOKEN = localStorage.getItem("authCode")

        let body = refresh === false ? 
        `grant_type=authorization_code&code=${TOKEN}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}` :
        `grant_type=refresh_token&refresh_token=${localStorage.getItem("refresh_token")}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`

        axios.post('https://www.bungie.net/Platform/App/OAuth/Token/', body, {
            headers: {
                'X-API-Key': process.env.REACT_APP_API_KEY,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${window.btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
            }
        })
        .then(response => {
            if (response.data.access_token) {
                localStorage.setItem("access_token", response.data.access_token)
                localStorage.setItem("refresh_token", response.data.refresh_token)
                localStorage.setItem("refreshTokenExpiringAt", Date.now() + response.data.refresh_expires_in * 1000 - 10 * 1000)
                localStorage.setItem("lastRefresh", Date.now())
            }
            else {
                return new Error('Could not get access token')
            }
        })
    }
}

export default AuthService