// src/pages/AuthCallback.jsx
import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { setToken } from '../contexts/auth'
import api from '../api/axios'

export default function AuthCallback() {
    const [qs] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        const accessToken = qs.get('accessToken')
        const refreshToken = qs.get('refreshToken')
        if (accessToken && refreshToken) {
            setToken(accessToken, refreshToken)
            api.get('/auth/info')
                .then(res => {
                    localStorage.setItem('userInfo', JSON.stringify(res.data.data))
                    navigate('/', { replace: true })
                })
                .catch(() => {
                    navigate('/login', { replace: true })
                })
        } else {
            navigate('/login', { replace: true })
        }
    }, [qs, navigate])

    return null
}
