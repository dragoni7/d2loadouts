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

        if (isAuthenticated()) {
            console.log("Already authenticated")
            navigate('/app')
        }
        else if (regenerateTokens()) {
            console.log("Token regenerated and authenticated")
            navigate('/app')
        }
        else {
            console.log("Not authenticated")
            const authCode = getAuthCodeFromURL()

            if (authCode !== null) {
                console.log("Auth code found, storing and attempting token generation")
                localStorage.setItem("authCode", "" + authCode)

                if (generateToken(false)) {
                    console.log("Fresh token generated")
                    navigate('/app')
                }
            }
        }

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
