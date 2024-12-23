import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import Button from '../common/Button';
import Input from '../common/Input';
import { Cage } from '../../models/Cage';
import { getCages, deleteCage } from '../../services/cageService';
import CageForm from './CageForm';

const CageList: React.FC = () => {
  const [cages, setCages] = useState<Cage[]>([]);
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedCage, setSelectedCage] = useState<Cage | null>(null);

  useEffect(() => {
    loadCages();
  }, []);

  const loadCages = async () => {
    try {
      const response = await getCages(filter);
      setCages(response.data);
    } catch (error) {
      console.error('Error loading cages:', error);
    }
  };

  const handleAdd = () => {
    setSelectedCage(null);
    setShowForm(true);
  };

  const handleEdit = (cage: Cage) => {
    setSelectedCage(cage);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCage(id);
      loadCages();
    } catch (error) {
      console.error('Error deleting cage:', error);
    }
  };

  const handleSave = () => {
    setShowForm(false);
    loadCages();
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedCage(null);
  };

  const renderItem = ({ item }: { item: Cage }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.nombre}</Text>
      <Text style={styles.cell}>{item.enUso === 'S' ? 'En Uso' : 'Disponible'}</Text>
      <Button title="Editar" onPress={() => handleEdit(item)} style={styles.button} />
      <Button title="Eliminar" onPress={() => handleDelete(item.id!)} style={[styles.button, { backgroundColor: 'red' }]} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Input placeholder="Filtrar por nombre" value={filter} onChangeText={setFilter} />
      <Button title="Buscar" onPress={loadCages} />
      <Button title="Agregar Jaula" onPress={handleAdd} />

      {showForm && <CageForm cage={selectedCage || undefined} onSave={handleSave} onCancel={handleCancel} />}

      <FlatList data={cages} keyExtractor={(item) => item.id!.toString()} renderItem={renderItem} />
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

export default CageList;