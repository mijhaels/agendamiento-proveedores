import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import Button from '../common/Button';
import Input from '../common/Input';
import { Reservation } from '../../models/Reservation';
import { getReservations, deleteReservation } from '../../services/reservationService';
import ReservationForm from './ReservationForm';
import { formatDate } from '../../utils/helpers';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const ReservationList: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filterDate, setFilterDate] = useState<Date>(new Date());
  const [showForm, setShowForm] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const loadReservations = async () => {
    try {
      const response = await getReservations(formatDate(filterDate));
      setReservations(response.data);
    } catch (error) {
      console.error('Error loading reservations:', error);
    }
  };
  
  useEffect(() => {
    loadReservations();
  }, [filterDate]);

  const handleAdd = () => {
    setSelectedReservation(null);
    setShowForm(true);
  };

  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteReservation(id);
      loadReservations();
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  const handleSave = () => {
    setShowForm(false);
    loadReservations();
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedReservation(null);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setFilterDate(date);
    hideDatePicker();
  };

  const renderItem = ({ item }: { item: Reservation }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.fecha}</Text>
      <Text style={styles.cell}>{item.horaInicioAgendamiento}</Text>
      <Text style={styles.cell}>{item.horaFinAgendamiento}</Text>
      <Text style={styles.cell}>{item.proveedor?.nombre}</Text>
      <Button title="Editar" onPress={() => handleEdit(item)} style={styles.button} />
      <Button title="Eliminar" onPress={() => handleDelete(item.id!)} style={[styles.button, { backgroundColor: 'red' }]} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Seleccionar Fecha" onPress={showDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <Input
        placeholder="Fecha"
        value={formatDate(filterDate)}
        editable={false}
        onChangeText={() => {}}
      />
      <Button title="Agregar Reserva" onPress={handleAdd} />

      {showForm && (
        <ReservationForm
          reservation={selectedReservation || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
  },
  button: {
    marginLeft: 10,
  },
});

export default ReservationList;