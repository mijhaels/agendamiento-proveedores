import { AxiosResponse } from 'axios';
import api from './api';
import { Reservation } from '../models/Reservation';

export const getReservations = async (date: string): Promise<AxiosResponse<Reservation[]>> => {
  return await api.get<Reservation[]>(`/reservations?fecha=${date}`);
};

export const addReservation = async (reservation: Reservation): Promise<AxiosResponse<Reservation>> => {
  return await api.post<Reservation>('/reservations', reservation);
};

export const updateReservation = async (reservation: Reservation): Promise<AxiosResponse<Reservation>> => {
  return await api.put<Reservation>(`/reservations/${reservation.id}`, reservation);
};

export const deleteReservation = async (id: number): Promise<AxiosResponse<void>> => {
  return await api.delete<void>(`/reservations/${id}`);
};