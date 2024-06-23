import React from "react"
import { authenticate } from "../../lib/AuthService"

const BungieLogin: React.FC = () => {

    function onLogIn () {
        authenticate()
    }

    return ( <button onClick={onLogIn}>Log In</button> )
}

export default BungieLogin