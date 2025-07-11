import axios from 'axios';

const API_URL = 'http://40.76.114.46:8000/auth';

// Login: obtiene token desde FastAPI
export const loginUser = async ({ email, password }: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    const { access_token } = response.data.data;
    localStorage.setItem('token', access_token); // Guarda el token

    // const payload = JSON.parse(atob(access_token.split('.')[1]));
    // const userId = payload.sub;
    // localStorage.setItem('userId', userId); // Guarda el userId también

    return { token: access_token };
  } catch (error) {
    console.error('Error en loginUser:', error);
    throw error;
  }
};

// Registro: crea un nuevo usuario
export const registerUser = async (user: { username: string; email: string; password: string }) => {
  try {
    const response = await axios.post(`${API_URL}/register`, user);
    console.log('Usuario registrado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en registerUser:', error);
    throw error;
  }
};
