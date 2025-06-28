import axios from '../utils/axiosConfig';

const API_URL = '/translation';

// Obtener traducciones por folderId
export const getRecordings = async (folderId: number) => {
  try {
    const response = await axios.get(`${API_URL}/folder/${folderId}`);
    return response.data;
  } catch (error) {
    console.error('Error en getRecordings:', error);
    throw error;
  }
};

// Crear una nueva traducción (grabación)
export const createRecording = async (text: string, folderId: number) => {
  try {
    const payload = {
      text,
      folder_id: folderId,
    };
    const response = await axios.post(API_URL, payload);
    return response.data.data;
  } catch (error) {
    console.error('Error en createRecording:', error);
    throw error;
  }
};

// Eliminar una traducción (grabación)
export const deleteRecording = async (recordingId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${recordingId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error en deleteRecording:', error);
    throw error;
  }
};


