import axios from 'axios';

const api = axios.create({
    baseURL: 'http://10.67.23.36:3334', // Use seu IP
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor para log de todas as requisições
api.interceptors.request.use(
    (config) => {
        console.log('🔗 REQUEST:', {
            url: config.url,
            method: config.method,
            data: config.data,
            baseURL: config.baseURL
        });
        return config;
    },
    (error) => {
        console.log('❌ REQUEST ERROR:', error);
        return Promise.reject(error);
    }
);

// Interceptor para log de todas as respostas
api.interceptors.response.use(
    (response) => {
        console.log('✅ RESPONSE:', {
            status: response.status,
            data: response.data,
            url: response.config.url
        });
        return response;
    },
    (error) => {
        console.log('❌ RESPONSE ERROR:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            url: error.config?.url
        });
        return Promise.reject(error);
    }
);

export default api;