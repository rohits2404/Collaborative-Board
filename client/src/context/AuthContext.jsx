import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/axios';
import socketService from '../hooks/socket';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Auto login if token exists
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setIsAuthenticated(true);
                socketService.connect(); // 🔌 auto-connect on reload
            } catch (err) {
                console.error('Auto-login failed:', err);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }

        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const res = await authAPI.login(credentials);
            const { token, user } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);
            setIsAuthenticated(true);
            socketService.connect(); // 🔌 connect after login

            return { success: true };
        } catch (err) {
            console.error('Login error:', err);
            return {
                success: false,
                error: err.response?.data?.error || 'Login failed',
            };
        }
    };

    const register = async (userData) => {
        try {
            const res = await authAPI.register(userData);
            const { token, user } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);
            setIsAuthenticated(true);
            socketService.connect(); // 🔌 connect after registration

            return { success: true };
        } catch (err) {
            console.error('Register error:', err);
            return {
                success: false,
                error: err.response?.data?.error || 'Registration failed',
            };
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (err) {
            console.warn('Logout API call failed (continuing)', err);
        }

        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setUser(null);
        setIsAuthenticated(false);
        socketService.disconnect(); // 🔌 disconnect on logout
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);