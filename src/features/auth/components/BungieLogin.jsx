import BungieAuth from "../../../lib/BungieAuth"
import React, { useEffect } from "react"

export default () => {

    function onLogIn() {
        BungieAuth.authenticate()
    }

    useEffect ( () => {
        if (BungieAuth.setAuthCode()) {
            BungieAuth.generateToken()
        }
    }, [])

    return BungieAuth.isAuthenticated() ? null : ( <button onClick={onLogIn}>Log In, Client id: {import.meta.env.VITE_CLIENT_ID}</button> )
}