import { AxiosResponse } from 'axios';
import api from './api';
import { Reception } from '../models/Reception';

export const getReceptions = async (date: string): Promise<AxiosResponse<Reception[]>> => {
  return await api.get<Reception[]>(`/receptions?fecha=${date}`);
};

export const startReception = async (reception: Reception): Promise<AxiosResponse<Reception>> => {
  return await api.post<Reception>('/receptions', reception);
};

export const updateReception = async (reception: Reception): Promise<AxiosResponse<Reception>> => {
  return await api.put<Reception>(`/receptions/${reception.id}`, reception);
};