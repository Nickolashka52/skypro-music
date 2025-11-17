import apiClient from '../apiClient'; // вместо axios
import { TrackType } from '@/sharedTypes/sharedTypes';

export const getTracks = async (): Promise<TrackType[]> => {
  const response = await apiClient.get('/catalog/track/all/');
  return response.data.data; // API возвращает data.data
};
