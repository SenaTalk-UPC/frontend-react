import axios from "../utils/axiosConfig"; // usa tu configuración con token

export const sendKeypoints = async (keypoints: number[][]) => {
  try {
    console.log("Enviando keypoints al backend:", keypoints);
    const response = await axios.post("/recognition", { keypoints });
    console.log("Respuesta del backend:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al enviar keypoints:", error);
    throw error;
  }
};
