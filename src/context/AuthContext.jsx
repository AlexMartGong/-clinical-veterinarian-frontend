import {createContext, useState, useEffect} from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import {login as authServiceLogin} from '../api/authService';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    // Comprobar si el token ha expirado
                    if (decoded.exp * 1000 < Date.now()) {
                        localStorage.removeItem('token');
                        setIsAuthenticated(false);
                        setUser(null);
                    } else {
                        // Configurar el token en las cabeceras de axios
                        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                        setIsAuthenticated(true);
                        setUser(decoded);
                    }
                } catch (error) {
                    error.toString()
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (username, password) => {
        try {
            // Use the login function from authService
            const response = await authServiceLogin(username, password);
            const {token} = response;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const decoded = jwtDecode(token);
            setIsAuthenticated(true);
            setUser(decoded);
            return {success: true};
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error al iniciar sesión'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{isAuthenticated, user, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
};