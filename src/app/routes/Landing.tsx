import { useNavigate } from 'react-router'

import { useEffect} from "react"
import BungieLogin from '../../features/auth/BungieLogin'
import { generateToken, regenerateTokens } from '../../lib/TokenService'
import { isAuthenticated } from '../../lib/AuthService'


export const LandingRoute = () => {

    const navigate = useNavigate()

    function getAuthCodeFromURL(): string | null {
        return window.location.href.includes("code=") ? window.location.href.split('code=')[1] : null
    }

    useEffect( () => {

        const handleAuth = async() => {

            var authenticated = false

            if (await isAuthenticated()) {
                authenticated = true
            }
            else if (regenerateTokens()) {
                authenticated = true
            }
            else {
    
                const authCode = getAuthCodeFromURL()
    
                if (authCode !== null) {
                    localStorage.setItem("authCode", "" + authCode)
    
                    if (await generateToken(false)) {
                        authenticated = true
                    }
                }
                else {
                    localStorage.removeItem("authCode")
                }
            }

            if (authenticated) {
                navigate('/app')
            }
        }

        handleAuth()

    }, [])

    return (
        <div>
            Welcome
            <br />
            Log in to use app
            <BungieLogin />
        </div>
    )
}
