import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { getReservations, updateReservation } from '../../services/reservationService';
import { getReceptions, startReception, updateReception } from '../../services/receptionService';
import { Reservation } from '../../models/Reservation';
import { Reception } from '../../models/Reception';
import { getCages, updateCage } from '../../services/cageService';
import { Cage } from '../../models/Cage';
import Button from '../common/Button';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { formatDate } from '../../utils/helpers';
import ReceptionDetails from './ReceptionDetails';

const ReceptionList: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [receptions, setReceptions] = useState<Reception[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [cages, setCages] = useState<Cage[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filterDate, setFilterDate] = useState<Date>(new Date());
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadReceptions(formatDate(filterDate));
    loadReservations(formatDate(filterDate));
    loadCages();
  }, [filterDate]);
  
  const loadReceptions = async (date: string) => {
    try {
      const receptionsResponse = await getReceptions(date);
      const reservationsResponse = await getReservations(date);
      
      // Combinar la información de reservas y recepciones
      const updatedReservations = reservationsResponse.data.map(reservation => {
        const reception = receptionsResponse.data.find(r => r.id === reservation.id);
        if (reception) {
          return {
            ...reservation,
            horaInicioRecepcion: reception.horaInicioRecepcion,
            horaFinRecepcion: reception.horaFinRecepcion
          };
        }
        return reservation;
      });
  
      // Ordenar por hora de inicio de agendamiento
      const sortedReservations = updatedReservations.sort((a, b) => 
        a.horaInicioAgendamiento.localeCompare(b.horaInicioAgendamiento)
      );
  
      setReservations(sortedReservations);
      setReceptions(receptionsResponse.data);
    } catch (error) {
      console.error('Error loading receptions:', error);
    }
  };

  const loadReservations = async (date: string) => {
    try {
      const response = await getReservations(date);
      setReservations(response.data);
    } catch (error) {
      console.error('Error loading reservations:', error);
    }
  };

  const loadCages = async () => {
    try {
      const response = await getCages();
      setCages(response.data);
    } catch (error) {
      console.error('Error loading cages:', error);
    }
  };

  const handleStartReception = async (reservation: Reservation) => {
    const availableCage = cages.find((cage) => cage.enUso === 'N');
    if (!availableCage) {
      alert('No hay jaulas disponibles en este momento.');
      return;
    }

    const startTime = new Date().toTimeString().slice(0, 5);
    const newReception: Reception = {
      id: reservation.id!,
      fecha: formatDate(new Date()),
      horaInicioRecepcion: startTime,
      horaFinRecepcion: '',
    };

    const updatedReservation: Reservation = {
      ...reservation,
      idJaula: availableCage.id,
      horaInicioRecepcion: startTime
    };

    try {
      // Realizar todas las operaciones de actualización
      await Promise.all([
        startReception(newReception),
        updateCage({ ...availableCage, enUso: 'S' }),
        updateReservation(updatedReservation)
      ]);

      setSelectedReservation(updatedReservation);
      loadCages();
      loadReservations(formatDate(filterDate));
      alert('Recepción iniciada correctamente.');
    } catch (error) {
      console.error('Error starting reception:', error);
      alert('Error al iniciar la recepción. Por favor, intente nuevamente.');
    }
  };

  const handleFinishReception = async (reservation: Reservation) => {
    if (!reservation.idJaula) {
      alert('No se ha asignado una jaula a esta reserva.');
      return;
    }
  
    try {
      const cage = cages.find((c) => c.id === reservation.idJaula);
  
      if (!cage) {
        alert('No se encontró la jaula asociada a esta reserva.');
        return;
      }
  
      const updatedReception: Reception = {
        id: reservation.id!,
        fecha: reservation.fecha,
        horaInicioRecepcion: reservation.horaInicioRecepcion!,
        horaFinRecepcion: new Date().toTimeString().slice(0, 5),
      };
  
      await updateReception(updatedReception);
      await updateCage({ ...cage, enUso: 'N' });
      loadReceptions(formatDate(filterDate));
      loadCages();
    } catch (error) {
      console.error('Error finalizando recepción:', error);
    }
  };

  const onDateConfirm = (date: Date) => {
    setShowDatePicker(false);
    setFilterDate(date);
  };

  const onDateCancel = () => {
    setShowDatePicker(false);
  };

  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedReservation(null);
  };

  const renderItem = ({ item }: { item: Reservation }) => (
    <TouchableOpacity onPress={() => handleViewDetails(item)}>
      <View style={styles.row}>
        <Text style={styles.cell}>{item.id}</Text>
        <Text style={styles.cell}>{item.horaInicioAgendamiento}</Text>
        <Text style={styles.cell}>{item.proveedor?.nombre}</Text>
        <Text style={styles.cell}>{item.horaInicioRecepcion || '-'}</Text>
        <Text style={styles.cell}>{item.horaFinRecepcion || '-'}</Text>
        {!item.horaInicioRecepcion && (
          <Button 
            title="Iniciar" 
            onPress={() => handleStartReception(item)} 
            style={styles.button} 
          />
        )}
        {item.horaInicioRecepcion && !item.horaFinRecepcion && (
          <Button 
            title="Finalizar" 
            onPress={() => handleFinishReception(item)} 
            style={[styles.button, { backgroundColor: 'green' }]} 
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Button title="Seleccionar Fecha" onPress={() => setShowDatePicker(true)} />
      <DateTimePickerModal isVisible={showDatePicker} mode="date" onConfirm={onDateConfirm} onCancel={onDateCancel} />
      <Text style={styles.dateText}>Fecha seleccionada: {formatDate(filterDate)}</Text>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>ID</Text>
            <Text style={styles.headerCell}>Hora Inicio</Text>
            <Text style={styles.headerCell}>Proveedor</Text>
            <Text style={styles.headerCell}>Inicio</Text>
            <Text style={styles.headerCell}>Fin</Text>
            <Text style={styles.headerCell}>Acciones</Text>
          </View>
        }
      />
      {showDetails && selectedReservation && (
        <View style={styles.modalContainer}>
          <ReceptionDetails reservation={selectedReservation} />
          <Button title="Cerrar" onPress={handleCloseDetails} style={{ marginTop: 20, backgroundColor: 'red' }} />
        </View>
      )}
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
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#f0f0f0',
      padding: 8,
      borderBottomWidth: 2,
      borderBottomColor: '#aaa',
    },
    headerCell: {
      fontWeight: 'bold',
      flex: 1,
      textAlign: 'center',
    },
    cell: {
      flex: 1,
      textAlign: 'center',
    },
    button: {
      marginLeft: 10,
    },
    dateText: {
      fontSize: 16,
      marginVertical: 10,
    },
    modalContainer: {
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      elevation: 5,
    }
  });
  
export default ReceptionList;