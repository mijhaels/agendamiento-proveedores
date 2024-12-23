import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import Button from '../common/Button';
import Input from '../common/Input';
import { Provider } from '../../models/Provider';
import { getProviders, deleteProvider } from '../../services/providerService';
import ProviderForm from './ProviderForm';

const ProviderList: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const response = await getProviders(filter);
      setProviders(response.data);
    } catch (error) {
      console.error('Error loading providers:', error);
    }
  };

  const handleAdd = () => {
    setSelectedProvider(null);
    setShowForm(true);
  };

  const handleEdit = (provider: Provider) => {
    setSelectedProvider(provider);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProvider(id);
      loadProviders();
    } catch (error) {
      console.error('Error deleting provider:', error);
    }
  };

  const handleSave = () => {
    setShowForm(false);
    loadProviders();
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedProvider(null);
  };

  const renderItem = ({ item }: { item: Provider }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.nombre}</Text>
      <Button title="Editar" onPress={() => handleEdit(item)} style={styles.button} />
      <Button title="Eliminar" onPress={() => handleDelete(item.id!)} style={[styles.button, { backgroundColor: 'red' }]} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Input placeholder="Filtrar por nombre" value={filter} onChangeText={setFilter} />
      <Button title="Buscar" onPress={loadProviders} />
      <Button title="Agregar Proveedor" onPress={handleAdd} />

      {showForm && (
        <ProviderForm provider={selectedProvider || undefined} onSave={handleSave} onCancel={handleCancel} />
      )}

      <FlatList data={providers} keyExtractor={(item) => item.id!.toString()} renderItem={renderItem} />
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

export default ProviderList;