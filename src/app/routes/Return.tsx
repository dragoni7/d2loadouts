import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { handleAuthReturn } from "../../features/auth/AuthReturn"

/**
 * Bungie OAuth redirects here
 */
export const ReturnRoute = () => {

    const navigate = useNavigate()

    useEffect( () => {

        if (handleAuthReturn()) {
            // exit component if successful
            navigate('/')
        }

    }, [])

    return (
        <div>
            Authentication Error
        </div>
    )
}