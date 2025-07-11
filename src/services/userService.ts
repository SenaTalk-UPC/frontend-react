import axios from "axios";

const API_URL = "http://40.76.114.46:8000/users";

/** Obtiene un usuario por id (json-server) */
export async function getUser(id: string) {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data;             // { id,name,email,password?... }
}

/** Actualiza SOLO los campos enviados (json-server acepta PATCH) */
export async function updateUser(
  id: string,
  payload: Partial<{ name: string; email: string; password: string }>
) {
  const { data } = await axios.patch(`${API_URL}/${id}`, payload);
  return data;
}
