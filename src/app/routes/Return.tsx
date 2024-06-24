import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { handleAuthReturn } from "../../features/auth/AuthReturn"

export const ReturnRoute = () => {

    const navigate = useNavigate()

    useEffect( () => {

        if (handleAuthReturn()) {
            navigate('/')
        }

    }, [])

    return (
        <div>
            Authentication Error
        </div>
    )
}