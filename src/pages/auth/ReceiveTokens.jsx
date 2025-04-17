import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/auth'

export default function ReceiveTokens() {
    const [params] = useSearchParams()
    const { loginWithGoogle } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const accessToken = params.get('accessToken')
        const refreshToken = params.get('refreshToken')

        if (accessToken && refreshToken) {
            loginWithGoogle(accessToken, refreshToken)
                .then(() => navigate('/'))
                .catch(() => navigate('/login'))
        } else {
            navigate('/login')
        }
    }, [])

    return null
}
