import axios from '../utils/axiosConfig';
import { getUserIdFromToken } from '../utils/authUtils';

const FOLDER_API = '/folder';

export const getFolders = async () => {
  const userId = getUserIdFromToken();
  if (!userId) throw new Error('UserId:' + userId + ' no encontrado');

  const response = await axios.get(`${FOLDER_API}/user/${userId}`);
  return response.data.data;
};

export const getFavoriteFolderByUser = async () => {
  const userId = getUserIdFromToken();
  try {
    const response = await axios.get(`${FOLDER_API}/user/${userId}/favorite`);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener carpeta favorita:", error);
    throw error;
  }
};

export const createFolder = async (folderName: string) => {
  const userId = getUserIdFromToken();
  if (!userId) throw new Error('Usuario no autenticado');

  const newFolder = {
    name: folderName,
    description: 'Carpeta generada automáticamente',
    userId: userId,
  };

  const response = await axios.post(FOLDER_API, newFolder);
  return response.data.data;
};

export const deleteFolder = async (folderId: number) => {
  const response = await axios.delete(`${FOLDER_API}/${folderId}`);
  return response.data.data;
};

