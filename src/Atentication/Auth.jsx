import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/appUser/login` // Cambia a tu URL de backend


function Auth(username, password) {
    return axios
        .post(API_URL, { username, password })
        .then((response) => response.data) // Retorna el token o la respuesta
        .catch((error) => {
            throw new Error(error.response?.data || 'Error de autenticación');
        });
}

export default Auth