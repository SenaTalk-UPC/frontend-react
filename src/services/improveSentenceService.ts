import axios from '../utils/axiosConfig';

const API_URL = '/api/sentence';

export const generateSentence = async (words: string) => {
  try {
    const payload = { words };
    const response = await axios.post(API_URL, payload);

    return response.data.sentence || response.data.data;
  } catch (error) {
    console.error('Error en generateSentence:', error);
    throw error;
  }
}