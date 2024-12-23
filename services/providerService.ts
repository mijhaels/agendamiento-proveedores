import { AxiosResponse } from 'axios';
import api from './api';
import { Provider } from '../models/Provider';

export const getProviders = async (nameFilter: string = ''): Promise<AxiosResponse<Provider[]>> => {
  return await api.get<Provider[]>(`/providers?nombre_like=${nameFilter}`);
};

export const addProvider = async (provider: Provider): Promise<AxiosResponse<Provider>> => {
  return await api.post<Provider>('/providers', provider);
};

export const updateProvider = async (provider: Provider): Promise<AxiosResponse<Provider>> => {
  return await api.put<Provider>(`/providers/${provider.id}`, provider);
};

export const deleteProvider = async (id: number): Promise<AxiosResponse<void>> => {
  return await api.delete<void>(`/providers/${id}`);
};