import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            api.get('/auth/me')
                .then((response) => {
                    setUser(response.data);
                })
                .catch((error) => {
                    console.error('Failed to fetch user', error);
                    localStorage.removeItem('token');
                });
        }
    }, []);

    const login = async (email, motDePasse) => {
        try {
            const response = await api.post('/auth/login', { email, motDePasse });
            const { token, ...user } = response.data;
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(user);
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Create and export the useAuth hook
export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;
