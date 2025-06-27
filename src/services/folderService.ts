import axios from 'axios';

const FOLDER_API_URL = 'http://localhost:5000/folders';
const RECORDING_API_URL = 'http://localhost:5000/recordings';

// Función para obtener todas las carpetas de un usuario
export const getFolders = async (userId: string) => {
  try {
    const response = await axios.get(`${FOLDER_API_URL}?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error en getFolders:', error);
    throw error;
  }
};

// Función para crear una carpeta
export const createFolder = async (folderName: string, userId: string) => {
  try {
    const newFolder = {
      name: folderName,
      userId: userId,
    };

    const response = await axios.post(FOLDER_API_URL, newFolder);
    return response.data;  // El backend debe devolver { id, name, userId }
  } catch (error) {
    console.error('Error en createFolder:', error);
    throw error;
  }
};

// Función para eliminar una carpeta
export const deleteFolder = async (folderId: string) => {
  try {
    const response = await axios.delete(`${FOLDER_API_URL}/${folderId}`);
    return response.data;
  } catch (error) {
    console.error('Error en deleteFolder:', error);
    throw error;
  }
};

// Función para obtener las grabaciones de una carpeta específica
export const getRecordingsByFolder = async (folderId: string) => {
  try {
    const response = await axios.get(`${RECORDING_API_URL}?folderId=${folderId}`);
    return response.data;
  } catch (error) {
    console.error('Error en getRecordingsByFolder:', error);
    throw error;
  }
};

// Función para crear una grabación dentro de una carpeta específica
export const createRecording = async (recordingData: any, folderId: string) => {
  try {
    const newRecording = {
      ...recordingData,
      folderId: folderId,
    };
    const response = await axios.post(RECORDING_API_URL, newRecording);
    return response.data;
  } catch (error) {
    console.error('Error en createRecording:', error);
    throw error;
  }
};

// Función para actualizar una grabación
export const updateRecording = async (id: string, patch: Partial<{text:string; folderId:string}>) => {
  const res = await axios.patch(`${RECORDING_API_URL}/${id}`, patch);
  return res.data;
};

// Función para eliminar una grabación
export const deleteRecording = async (recordingId: string) => {
  try {
    const response = await axios.delete(`${RECORDING_API_URL}/${recordingId}`);
    return response.data;
  } catch (error) {
    console.error('Error en deleteRecording:', error);
    throw error;
  }
};
