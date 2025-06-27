import axios from 'axios';

const API_URL = 'http://localhost:5000/users';

// Función para login
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.get(`${API_URL}?email=${email}&password=${password}`);
    return response.data[0];  // Devolver el primer usuario que coincida (asumido que no hay duplicados)
  } catch (error) {
    console.error('Error en loginUser:', error);
    throw error;
  }
};

// Función para registro de nuevo usuario
export const registerUser = async (user: { name: string; email: string; password: string }) => {
  try {
    const response = await axios.post(API_URL, user);
    return response.data;
  } catch (error) {
    console.error('Error en registerUser:', error);
    throw error;
  }
};
