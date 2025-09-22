import axios from '../utils/axiosConfig';

const TEXT_TRANSLATION_API = '/text-translation/text-translation';

export const translateText = async (text: string, targetLanguage: string) => {
  try {
    const payload = {
      text,
      target_language: targetLanguage,
    };
    const response = await axios.post(TEXT_TRANSLATION_API, payload);
    // Asumiendo que la respuesta tiene el texto traducido en response.data.translated_text o similar
    // Ajusta según la estructura real de la respuesta del backend
    return response.data.translated_text || response.data.data; 
  } catch (error) {
    console.error('Error en translateText:', error);
    throw error;
  }
};