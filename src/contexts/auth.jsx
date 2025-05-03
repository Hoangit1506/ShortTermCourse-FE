import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const u = localStorage.getItem('userInfo')
        return u ? JSON.parse(u) : null
    })

    const login = async (email, password, role) => {
        const res = await api.post('/auth/login', { email, password, role })
        const { accessToken, refreshToken } = res.data.data
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        const info = await api.get('/auth/info')
        localStorage.setItem('userInfo', JSON.stringify(info.data.data))
        setUser(info.data.data)
    }

    const loginWithGoogle = async (accessToken, refreshToken) => {
        setToken(accessToken, refreshToken);
        const info = await api.get('/auth/info');
        localStorage.setItem('userInfo', JSON.stringify(info.data.data));
        setUser(info.data.data);
    };

    const logout = () => {
        localStorage.clear()
        setUser(null)
        window.location.href = '/login'
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loginWithGoogle }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}

export function getToken() {
    return localStorage.getItem('accessToken')
}
export function setToken(a, r) {
    localStorage.setItem('accessToken', a)
    localStorage.setItem('refreshToken', r)
}
export function clearToken() {
    localStorage.clear()
}
