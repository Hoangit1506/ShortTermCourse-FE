import axios from 'axios'
import { getToken, setToken, clearToken } from '../contexts/auth'

const api = axios.create({
    baseURL: 'http://localhost:8080/short-term-course'
})

api.interceptors.request.use(config => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(
    res => res,
    async err => {
        if (err.response?.status === 401) {
            try {
                const { data } = await api.post('/auth/refresh-token', {
                    refreshToken: localStorage.getItem('refreshToken')
                })
                setToken(data.data.accessToken, data.data.refreshToken)
                err.config.headers.Authorization = `Bearer ${data.data.accessToken}`
                return api.request(err.config)
            } catch {
                clearToken()
                window.location.href = '/login'
            }
        }
        return Promise.reject(err)
    }
)

export default api
