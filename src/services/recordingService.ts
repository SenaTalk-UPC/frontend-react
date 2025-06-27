import axios from 'axios';

const API_URL = 'http://localhost:5000/recordings';

export const getRecordings = async (folderId: string) => {
  try {
    const response = await axios.get(`${API_URL}?folderId=${folderId}`);
    return response.data;
  } catch (error) {
    console.error('Error en getRecordings:', error);
    throw error;
  }
};

export const createRecording = async (text: string, folderId: string) => {
  try {
    const newRecording = {
      text,
      folderId,
    };
    const response = await axios.post(API_URL, newRecording);
    return response.data;
  } catch (error) {
    console.error('Error en createRecording:', error);
    throw error;
  }
};
export const deleteRecording = async (recordingId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${recordingId}`);
    return response.data;
  } catch (error) {
    console.error('Error en deleteRecording:', error);
    throw error;
  }
};
