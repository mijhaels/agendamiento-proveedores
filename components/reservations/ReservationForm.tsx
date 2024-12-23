import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Input from '../common/Input';
import Button from '../common/Button';
import Picker from '../common/Picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { addReservation, updateReservation } from '../../services/reservationService';
import { getProviders } from '../../services/providerService';
import { getProducts } from '../../services/productService';
import { TIME_OPTIONS } from '../../constants';
import { formatDate } from '../../utils/helpers';
import { Provider } from '../../models/Provider';
import { Product } from '../../models/Product';
import { Reservation, ReservationDetail } from '../../models/Reservation';

interface ReservationFormProps {
  reservation?: Reservation;
  onSave: () => void;
  onCancel: () => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ reservation, onSave, onCancel }) => {
  const [fecha, setFecha] = useState<Date>(new Date());
  const [horaInicioAgendamiento, setHoraInicioAgendamiento] = useState<string>(TIME_OPTIONS[0]);
  const [horaFinAgendamiento, setHoraFinAgendamiento] = useState<string>(TIME_OPTIONS[0]);
  const [idProveedor, setIdProveedor] = useState<number | ''>('');
  const [detalle, setDetalle] = useState<ReservationDetail[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | ''>('');
  const [cantidad, setCantidad] = useState<string>('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      const providersResponse = await getProviders();
      setProviders(providersResponse.data);

      const productsResponse = await getProducts();
      setProducts(productsResponse.data);
    };

    loadData();

    if (reservation) {
      setFecha(new Date(reservation.fecha));
      setHoraInicioAgendamiento(reservation.horaInicioAgendamiento);
      setHoraFinAgendamiento(reservation.horaFinAgendamiento);
      setIdProveedor(reservation.idProveedor);
      setDetalle(reservation.detalle);
    }
  }, [reservation]);

  const handleSave = async () => {
    const newReservation: Reservation = {
      id: reservation ? reservation.id : undefined,
      fecha: formatDate(fecha),
      horaInicioAgendamiento,
      horaFinAgendamiento,
      idProveedor: Number(idProveedor),
      detalle: detalle.map((item) => ({
        ...item,
        idProducto: Number(item.idProducto), // Asegura que idProducto sea un número
        cantidad: Number(item.cantidad),      // Asegura que cantidad sea un número
      })),
    };

    try {
      if (reservation) {
        await updateReservation(newReservation);
      } else {
        await addReservation(newReservation);
      }
      onSave();
    } catch (error) {
      console.error('Error saving reservation:', error);
    }
  };

  const handleAddProduct = () => {
    const selectedProductData = products.find((p) => p.id === selectedProduct);
    if (selectedProduct && cantidad && selectedProductData) {
      setDetalle([
        ...detalle,
        {
          idProducto: selectedProduct as number,
          cantidad: parseInt(cantidad),
          product: selectedProductData,
        },
      ]);
      setSelectedProduct('');
      setCantidad('');
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setFecha(date);
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      <Button title="Seleccionar Fecha" onPress={showDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <Input placeholder="Fecha" value={formatDate(fecha)} editable={false} onChangeText={() => {}}/>
      <Picker
        selectedValue={horaInicioAgendamiento}
        onValueChange={(itemValue) => setHoraInicioAgendamiento(itemValue as string)}
        items={TIME_OPTIONS.map((time) => ({ label: time, value: time }))}
      />
      <Picker
        selectedValue={horaFinAgendamiento}
        onValueChange={(itemValue) => setHoraFinAgendamiento(itemValue as string)}
        items={TIME_OPTIONS.map((time) => ({ label: time, value: time }))}
      />
      <Picker
        selectedValue={idProveedor}
        onValueChange={(itemValue) => setIdProveedor(itemValue as number)}
        items={providers.map((p) => ({ label: p.nombre, value: p.id! }))}
      />

      <View style={styles.addProductContainer}>
        <Picker
          selectedValue={selectedProduct}
          onValueChange={(itemValue) => setSelectedProduct(Number(itemValue))}
          items={products.map((p) => ({ label: p.nombre, value: p.id! }))}
          style={{ flex: 2 }}
        />
        <Input
          placeholder="Cantidad"
          value={cantidad}
          onChangeText={setCantidad}
          keyboardType="numeric"
          style={{ flex: 1 }}
        />
        <Button title="Agregar" onPress={handleAddProduct} style={{ flex: 1 }} />
      </View>

      {/* Lista de productos agregados */}
      <View style={styles.detalleContainer}>
        {detalle.map((item, index) => (
          <View key={index} style={styles.detalleItem}>
            <Text>{item.product?.nombre}</Text>
            <Text>{item.cantidad}</Text>
          </View>
        ))}
      </View>

      <Button title="Guardar" onPress={handleSave} />
      <Button title="Cancelar" onPress={onCancel} style={{ backgroundColor: 'red' }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  addProductContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detalleContainer: {
    marginBottom: 20,
  },
  detalleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
});

export default ReservationForm;