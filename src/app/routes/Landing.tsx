import { useNavigate } from 'react-router'

import { useEffect} from "react"
import BungieLogin from '../../features/auth/BungieLogin'
import { regenerateTokens } from '../../lib/bungie_api/TokenService'
import { isAuthenticated } from '../../lib/bungie_api/AuthService'


export const LandingRoute = () => {

    const navigate = useNavigate()
    useEffect( () => {

        if (isAuthenticated()) {
            console.log("Already authenticated")
            navigate('/app')
        }
        else if (regenerateTokens()) {
            console.log("Token regenerated and authenticated")
            navigate('/app')
        }

        console.log("Not authenticated")

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
