import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Reservation } from '../../models/Reservation';

interface ReceptionDetailsProps {
  reservation: Reservation;
}

const ReceptionDetails: React.FC<ReceptionDetailsProps> = ({ reservation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles de la Reserva</Text>
      <View style={styles.detailItem}>
        <Text style={styles.label}>ID de Turno:</Text>
        <Text>{reservation.id}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.label}>Fecha:</Text>
        <Text>{reservation.fecha}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.label}>Hora de Inicio:</Text>
        <Text>{reservation.horaInicioAgendamiento}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.label}>Hora de Fin:</Text>
        <Text>{reservation.horaFinAgendamiento}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.label}>Proveedor:</Text>
        <Text>{reservation.proveedor?.nombre}</Text>
      </View>
      <Text style={styles.subtitle}>Productos:</Text>
      <FlatList
        data={reservation.detalle}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.detailItem}>
            <Text>{item.product?.nombre}</Text>
            <Text>Cantidad: {item.cantidad}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
  },
});

export default ReceptionDetails;