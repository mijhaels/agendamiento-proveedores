import { AxiosResponse } from 'axios';
import api from './api';
import { Cage } from '../models/Cage';

export const getCages = async (nameFilter: string = ''): Promise<AxiosResponse<Cage[]>> => {
  return await api.get<Cage[]>(`/cages?nombre_like=${nameFilter}`);
};

export const addCage = async (cage: Cage): Promise<AxiosResponse<Cage>> => {
  return await api.post<Cage>('/cages', cage);
};

export const updateCage = async (cage: Cage): Promise<AxiosResponse<Cage>> => {
  return await api.put<Cage>(`/cages/${cage.id}`, cage);
};

export const deleteCage = async (id: number): Promise<AxiosResponse<void>> => {
  return await api.delete<void>(`/cages/${id}`);
};