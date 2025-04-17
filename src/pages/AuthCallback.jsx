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
            // 1. Lưu token
            setToken(accessToken, refreshToken)
            // 2. Lấy thông tin user
            api.get('/auth/info')
                .then(res => {
                    localStorage.setItem('userInfo', JSON.stringify(res.data.data))
                    // 3. Điều hướng về trang chính
                    navigate('/', { replace: true })
                })
                .catch(() => {
                    // nếu lỗi, quay về login
                    navigate('/login', { replace: true })
                })
        } else {
            // thiếu token, quay về login
            navigate('/login', { replace: true })
        }
    }, [qs, navigate])

    return null  // hoặc spinner nhỏ
}
