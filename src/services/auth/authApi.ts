import axios from 'axios';
import { BASE_URL } from '../constants';

// === ТИПЫ ===
type LoginData = { email: string; password: string };
type RegisterData = { email: string; password: string; username: string };
type TokenResponse = { access: string; refresh: string };

// ВХОД → /user/token/ (даёт access + refresh)
export const loginUser = async (data: LoginData): Promise<TokenResponse> => {
  const response = await axios.post(`${BASE_URL}/user/token/`, data, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

// РЕГИСТРАЦИЯ → /user/signup/
export const registerUser = async (data: RegisterData) => {
  const response = await axios.post(`${BASE_URL}/user/signup/`, data, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data; // { message: "...", result: { _id, email, username } }
};

// ВЫХОД — просто чистим токены
export const logoutUser = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};
