import React from "react"
import { authenticate } from "../../lib/bungie_api/AuthService"

const BungieLogin: React.FC = () => {

    function onLogIn () {
        authenticate()
    }

    return ( <button onClick={onLogIn}>Authorize with Bungie.net</button> )
}

export default BungieLogin