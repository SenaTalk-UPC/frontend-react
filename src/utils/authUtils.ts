import { jwtDecode } from 'jwt-decode';

type DecodedToken = {
  sub: string; // aquí `sub` será el `userId` tal como viene (string)
  exp: number;
};

export function getUserIdFromToken(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.sub; // devolvemos el userId tal cual
  } catch (error) {
    console.error('Error al decodificar token:', error);
    return null;
  }
}
