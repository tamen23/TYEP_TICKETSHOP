import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

// Create the AuthContext
const AuthContext = createContext();

// Create a custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);  // Add loading state

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            api.get('/auth/me')
                .then((response) => {
                    console.log('Fetched user:', response.data);
                    setUser(response.data);
                })
                .catch((error) => {
                    console.error('Failed to fetch user', error);
                    localStorage.removeItem('token');
                })
                .finally(() => {
                    setLoading(false);  // Set loading to false after fetching
                });
        } else {
            setLoading(false);  // Set loading to false if no token
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
            throw error; // re-throw error so it can be handled by the caller
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;