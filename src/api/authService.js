import axios from 'axios';

// Configurar la URL base para todas las peticiones
axios.defaults.baseURL = 'http://localhost:8080';

// Interceptor para añadir el token a todas las peticiones
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const login = async (username, password) => {
    try {
        // Esta ruta debe coincidir con la configuración del JwtAuthenticationFilter
        const response = await axios.post('/login', {username, password});
        return response.data;
    } catch (error) {
        throw error.toString();
    }
};