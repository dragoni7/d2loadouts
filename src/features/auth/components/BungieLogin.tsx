import BungieAuth from "../../../lib/BungieAuth"
import React, { Component, ReactNode } from "react"


interface BungieLoginProps {
    children: (props: { isLoggedIn: boolean }) => ReactNode;
}

interface BungieLoginState {
    isLoggedIn: boolean;
}

class BungieLogin extends Component<BungieLoginProps, BungieLoginState> {
    constructor(props: BungieLoginProps) {
        super(props)

        this.state = {
            isLoggedIn: BungieAuth.isAuthenticated()
        }
    }

    componentDidMount() {
        if (BungieAuth.setAuthCode()) {
            BungieAuth.generateToken()
        }
    }

    onLogIn () {
        BungieAuth.authenticate()
    }

    onLogOut () {
        // TODO: log out 
    }

    render() {
        return <div>
                { this.props.children({ isLoggedIn: this.state.isLoggedIn }) }
                { this.state.isLoggedIn ? ( <button onClick={this.onLogOut}>Log Out</button> ) : ( <button onClick={this.onLogIn}>Log In</button> ) }
            </div>
    }
}

export default BungieLogin