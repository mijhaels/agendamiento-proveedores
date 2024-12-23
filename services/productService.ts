import { AxiosResponse } from 'axios';
import api from './api';
import { Product } from '../models/Product';

export const getProducts = async (nameFilter: string = ''): Promise<AxiosResponse<Product[]>> => {
  return await api.get<Product[]>(`/products?nombre_like=${nameFilter}`);
};

export const addProduct = async (product: Product): Promise<AxiosResponse<Product>> => {
  return await api.post<Product>('/products', product);
};

export const updateProduct = async (product: Product): Promise<AxiosResponse<Product>> => {
  return await api.put<Product>(`/products/${product.id}`, product);
};

export const deleteProduct = async (id: number): Promise<AxiosResponse<void>> => {
  return await api.delete<void>(`/products/${id}`);
};