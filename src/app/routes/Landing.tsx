import { useNavigate } from 'react-router'

import { useEffect} from "react"
import BungieLogin from '../../features/auth/BungieLogin'
import { generateToken, regenerateTokens } from '../../lib/TokenService'


export const LandingRoute = () => {

    const navigate = useNavigate()

    function getAuthCodeFromURL(): string | null {
        return window.location.href.includes("code=") ? window.location.href.split('code=')[1] : null
    }

    useEffect( () => {

        if (regenerateTokens()) {
            navigate('/app')
        }
        else {

            const authCode = getAuthCodeFromURL()

            if (authCode !== null) {
                localStorage.setItem("authCode", "" + authCode)

                if (generateToken(false)) {
                    navigate('/app')
                }
            }
            else {
                localStorage.removeItem("authCode")
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
